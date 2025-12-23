import React, { useRef, useState, useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import { reimbursementGetList } from "../../../services/otherService";
import { CurrentUser } from "../../../store/slices/userSlice";
import moment from "moment";
import { useSelector } from "react-redux";
import {
  caseStatus,
  reimbursementFilterData,
} from "../../../services/masterServices";
import TableWrapper from "../../components/common/TableWrapper/TableWrapper";
import { Link } from "react-router-dom";
import StatusBadge from "../../components/common/StatusBadge";
import NewCaseFilters from "../../components/common/NewCaseFilters";

const ReimbursementListTab = ({ newFilters, onUpdateFilters, searchValue = "", onSearchChange }) => {
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  // const [newFilters, setNewFilters] = useState({
  //     calendar: [
  //         moment().startOf("month").toDate(),
  //         moment().endOf("month").toDate(),
  //     ],
  // });
  const { userTypeId, id, entityId, role } = useSelector(CurrentUser);
  const permissions = role?.permissions?.map((item) => item.name);
  //Calling List API
  const { data: tableData, isFetching: tableLoading } = useQuery(
    ["reimbursementGetList", pagination, searchValue, newFilters],
    () =>
      reimbursementGetList({
        ...pagination,
        // apiType: "list",
        ...(searchValue && {
          search: searchValue,
          // caseInfoSearch: searchValue
        }),
        //...filters,
        userTypeId: userTypeId,
        // userId: userTypeId == 141 ? id : entityId,
        caseStatusIds: newFilters?.caseStatuses
          ? newFilters?.caseStatuses
          : null,
        caseSubjectNames: newFilters?.caseSubjects
          ? newFilters?.caseSubjects
          : null,
        clientIds: newFilters?.clients ? newFilters?.clients : null,
        caseNumber: newFilters?.caseNumber ? newFilters?.caseNumber : null,
        caseVehicleRegistrationNumber: newFilters?.caseVehicleRegistrationNumber
          ? newFilters?.caseVehicleRegistrationNumber
          : null,
        breakdownAreaStateIds: newFilters?.states ? newFilters?.states : null,
        serviceIds: newFilters?.services ? newFilters?.services : null,
        breakdownLocationCategoryIds: newFilters?.locationCategories
          ? newFilters?.locationCategories
          : null,
        startDate: newFilters?.calendar?.[0]
          ? moment(newFilters?.calendar[0]).format("YYYY-MM-DD")
          : "",
        endDate: newFilters?.calendar?.[1]
          ? moment(newFilters?.calendar[1]).format("YYYY-MM-DD")
          : "",
        userId: id,
        roleId: role?.id,
      })
  );

  //   console.log("data list", tableData);

  const { data: activityStatusData } = useQuery(["caseActiveStatus"], () =>
    caseStatus({
      apiType: "dropdown",
    })
  );

  const { data: reimbursementFilterOptionsData } = useQuery(
    ["reimbursementFilterData"],
    () => reimbursementFilterData()
  );

  // Function to handle new filter application
  const handleFilterApply = (filters) => {
    setPagination({
      limit: 10,
      offset: 0,
    });
    onUpdateFilters(filters);
    setIsFilterVisible(false);
  };

  const columns = [
    {
      title: "Case ID",
      field: "caseNumber",
      body: (record, field) => (
        <Link
          className="auth-link"
          to={
            permissions?.includes("reimbursement-view-web")
              ? `/cases/view/${record?.caseDetailId}`
              : "#"
          }
        >
          {record?.caseNumber}
        </Link>
      ),
    },
    {
      title: "Customer Type",
      field: "caseType",
      body: (record, field) => {
        // console.log("record", record, field);
        return (
          <div className="d-flex gap-1_2">
            {record?.customerType?.irateCustomer == true && (
              <StatusBadge
                text={"Irate Customer"}
                statusId={"4"}
                statusType={"activityStatus"}
              />
            )}
            {record?.customerType?.womenAssist == true && (
              <StatusBadge
                text={"Women Assist"}
                statusId={"2"}
                statusType={"activityStatus"}
              />
            )}
            {record?.caseType && (
              <StatusBadge
                text={record?.caseType}
                statusId={"7"}
                statusType={"activityStatus"}
              />
            )}
          </div>
        );
      },
    },
    {
      title: "Subject",
      field: "subject",
    },
    {
      title: "Current Contact Name",
      field: "customerCurrentContactName",
    },
    {
      title: "Service Description",
      field: "service",
    },
    {
      title: "Payment Status",
      field: "reimbursementPaymentStatus",
      body: (record, field) => {
        return (
          <div>
            {record?.reimbursementPaymentStatus == "Pending" && (
              <StatusBadge
                text={record?.reimbursementPaymentStatus}
                statusId={190}
                statusType="paymentStatusId"
              />
            )}
            {record?.reimbursementPaymentStatus == "Success" && (
              <StatusBadge
                text={record?.reimbursementPaymentStatus}
                statusId={191}
                statusType="paymentStatusId"
              />
            )}
            {record?.reimbursementPaymentStatus == "Failed" && (
              <StatusBadge
                text={record?.reimbursementPaymentStatus}
                statusId={192}
                statusType="paymentStatusId"
              />
            )}
          </div>
        );
      },
    },
    {
      title: "Reimbursement Amount",
      field: "reimbursementAmount",
      body: (record, field) => {
        return <>{record?.reimbursementAmount || "--"}</>;
      },
    },
    {
      title: "Vehicle No",
      field: "registrationNumber",
    },
    {
      title: "Created On",
      field: "caseCreatedAt",
    },
    {
      title: "Case status",
      field: "caseStatus",
      alignFrozen: "right",
      body: (record, field) => {
        return (
          <div>
            {record?.caseStatus == "Open" && (
              <StatusBadge
                text={record?.caseStatus}
                statusType={"caserequestStatus"}
                statusId={1}
              />
            )}
            {record?.caseStatus == "In Progress" && (
              <StatusBadge
                text={record?.caseStatus}
                statusType={"caserequestStatus"}
                statusId={2}
              />
            )}
            {record?.caseStatus == "Cancelled" && (
              <StatusBadge
                text={record?.caseStatus}
                statusType={"caserequestStatus"}
                statusId={3}
              />
            )}
            {record?.caseStatus == "Closed" && (
              <StatusBadge
                text={record?.caseStatus}
                statusType={"caserequestStatus"}
                statusId={4}
              />
            )}
          </div>
        );
      },
    },
  ];

  // Handle Apply Filter
  // const handleFilter = (values) => {
  //     console.log("Filter form values", values);
  //     setPagination({
  //         limit: 10,
  //         offset: 0,
  //     });
  //     setFilters({
  //         ...values?.caseStatusId && { caseStatusId: values?.caseStatusId?.code },
  //         ...values?.date && {
  //             startDate: moment(values?.date?.value[0]).format("YYYY-MM-DD"),
  //             endDate: moment(values?.date?.value[1]).format("YYYY-MM-DD")
  //         }
  //     });
  // };
  // Handle Search change
  const handleSearchChange = (value) => {
    setPagination({
      limit: 10,
      offset: 0,
    });
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  // Handle Pagination
  const handlepageChange = (offset, limit) => {
    // console.log("offset", offset, limit);
    setPagination({
      offset: offset,
      limit: limit,
    });
  };
  return (
    <div>
      <TableWrapper
        //onFilterApply={handleFilter}
        title={"Reimbursement"}
        // rowSelection={false}
        columns={columns}
        action={false}
        loading={tableLoading}
        data={tableData?.data?.data?.rows}
        totalRecords={tableData?.data?.data?.count}
        onPaginationChange={handlepageChange}
        onSearch={handleSearchChange}
        searchValue={searchValue}
        highlightIrateCustomer={true}
        // filterFields={{
        //     filterFields: ["date", "caseStatus"],
        //     filterData: {
        //         caseStatus: activityStatusData?.data?.data?.map((item) => {
        //             return {
        //                 label: item.name,
        //                 code: item.id,
        //             };
        //         })
        //     }
        // }}
        filterChip={newFilters}
        filterOptions={reimbursementFilterOptionsData?.data?.data}
        removeChip={handleFilterApply}
        className="case-list-tab-page"
        showFilterButton={true}
        onFilterButtonClick={() => setIsFilterVisible(true)}
      />
      <NewCaseFilters
        visible={isFilterVisible}
        onHide={() => setIsFilterVisible(false)}
        onApply={handleFilterApply}
        newFilters={newFilters}
        filterOptions={{
          caseStatuses:
            reimbursementFilterOptionsData?.data?.data?.caseStatuses,
          caseSubjects:
            reimbursementFilterOptionsData?.data?.data?.caseSubjects,
          states: reimbursementFilterOptionsData?.data?.data?.states,
          locationCategories:
            reimbursementFilterOptionsData?.data?.data?.locationCategories,
          clients: reimbursementFilterOptionsData?.data?.data?.clients,
          services: reimbursementFilterOptionsData?.data?.data?.services,
        }}
        fieldsConfig={[
          { key: "calendar", label: "Requested Date", type: "calendar" },
          { key: "caseStatuses", label: "Case Statuses", type: "multiSelect" },
          { key: "caseSubjects", label: "Case Subjects", type: "multiSelect" },
          { key: "states", label: "States", type: "multiSelect" },
          { key: "caseNumber", label: "Case Number", type: "text" },
          {
            key: "caseVehicleRegistrationNumber",
            label: "Case Vehicle Registration Number",
            type: "text",
          },
          {
            key: "locationCategories",
            label: "Location Categories",
            type: "multiSelect",
          },
          { key: "clients", label: "Clients", type: "multiSelect" },
          { key: "services", label: "Services", type: "multiSelect" },
        ]}
      />
    </div>
  );
};

export default ReimbursementListTab;
