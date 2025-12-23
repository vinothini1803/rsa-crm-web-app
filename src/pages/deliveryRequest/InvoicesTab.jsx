import React, { useState } from "react";
import TableWrapper from "../../components/common/TableWrapper/TableWrapper";
import CaseAction from "../case/CaseAction";
import { useNavigate } from "react-router";
import StatusBadge from "../../components/common/StatusBadge";
import SendNotificationSidebar from "../../components/common/SendNotificationSidebar";
import ReminderSidebar from "../../components/common/ReminderSidebar";
import { useQuery } from "react-query";
import { invoiceList } from "../../../services/deliveryRequestService";
import moment from "moment";
import CurrencyFormat from "../../components/common/CurrencyFormat";
import { CurrentUser } from "../../../store/slices/userSlice";
import { useSelector } from "react-redux";
import { ViewIcon } from "../../utills/imgConstants";
import TableActions from "../../components/common/TableActions";
import { NavLink } from "react-router-dom";

const InvoicesTab = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [reminderVisible, setReminderVisible] = useState(false);
  const { code, role, userTypeId } = useSelector(CurrentUser);
  const [filters, setFilters] = useState({
    period: `${moment()
      .clone()
      .startOf("month")
      .format("YYYY-MM-DD")} - ${moment()
      .clone()
      .endOf("month")
      .format("YYYY-MM-DD")}`,
  });
  const [searchValue, setSearchValue] = useState(null);
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const items = [
    {
      label: "Send Notification",
      command: () => handleNotification(),
    },
    {
      label: "Update activity",
    },
    {
      label: "Add Reminder",
      command: () => handleReminder(),
    },
    {
      label: "Add Interaction",
    },
  ];

  const { data, isFetching } = useQuery(
    ["invoiceList", pagination, filters, searchValue],
    () =>
      invoiceList({
        ...pagination,
        ...filters,
        ...(searchValue && { searchKey: searchValue }),
        ...(userTypeId == 140 && { dealerCode: code }),
      })
  );
  const handleNotification = () => {
    setVisible(true);
  };
  // Reminder Modal function
  const handleReminder = () => {
    setReminderVisible(true);
  };

  const handleSearch = (value) => {
    setSearchValue(value);
  };
  const columns = [
    {
      title: "Actions",
      field: "actions",
      body: (record, field) => (
        <TableActions
          view={{ url: `/delivery-request/invoice-view/${record.id}` }}
          download={{
            url: record?.vehicleDeliveryDealerEinvoicePdfUrl
              ? record?.vehicleDeliveryDealerEinvoicePdfUrl
              : record?.vehicleDeliveryDealerInvoicePdfUrl,
          }}
        />
      ),
    },
    ...(role?.id == 1 || role?.id == 31
      ? [
          {
            title: "Dealer Code",
            field: "dealerCode",
          },
        ]
      : []),

    {
      title: "Invoice Number",
      field: "invoiceNumber",
    },
    {
      title: "Invoice Amount",
      field: "invoiceAmount",
      body: (record, field) => <CurrencyFormat amount={record.invoiceAmount} />,
    },
    { title: "Subject", field: "subject" },
    { title: "Invoice Date", field: "invoiceDate" },
    { title: "Sub Service", field: "subService" },

    {
      title: "Invoice Status",
      field: "status",
      body: (record, field) => {
        // console.log("record", record, field);
        return <StatusBadge text={record.status} statusId={record.statusId} />;
      },
    },
  ];
  // const data = Array.from({ length: 22 }, (e, i) => {
  //   return {
  //     actions: "",
  //     ticket_number: "47887027989",
  //     subject: "Vehicle Transfer",
  //     invoice_number: "INV03947943",
  //     invoice_date: "20/08/2023",
  //     sub_service: "Flat Bed",
  //     status: i % 2 == 0 ? "Payment In progress" : "Paid",
  //     statusId: i % 2 == 0 ? 2 : 1,
  //   };
  // });
  //handle pagination change
  const handlepageChange = (offset, limit) => {
    // console.log("offset", offset, limit);
    setPagination({
      offset: offset,
      limit: limit,
    });
  };

  //handle Filters change
  const handleApplyFilter = (values) => {
    // console.log("Invoice Filter value", values);
    setPagination({
      limit: 10,
      offset: 0,
    });
    setFilters({
      ...(values.date && {
        period: `${moment(values.date.value[0]).format(
          "YYYY-MM-DD"
        )} - ${moment(values.date.value[1]).format("YYYY-MM-DD")}`,
      }),
    });
  };
  return (
    <>
      <TableWrapper
        title={"Invoices"}
        columns={columns}
        data={data?.data?.data?.rows}
        totalRecords={data?.data?.data?.count}
        className="tab-page"
        filterFields={{
          filterFields: ["date"],
        }}
        action={false}
        onSearch={handleSearch}
        onPaginationChange={handlepageChange}
        loading={isFetching}
        onFilterApply={handleApplyFilter}
      />
      <SendNotificationSidebar visible={visible} setVisible={setVisible} />
      <ReminderSidebar
        visible={reminderVisible}
        setVisible={setReminderVisible}
      />
    </>
  );
};

export default InvoicesTab;
