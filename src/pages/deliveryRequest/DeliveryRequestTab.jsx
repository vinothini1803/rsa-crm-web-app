import React, { useRef, useState } from "react";
import TableWrapper from "../../components/common/TableWrapper/TableWrapper";
import { useLocation, useNavigate } from "react-router";
import CaseAction from "../case/CaseAction";
import StatusBadge from "../../components/common/StatusBadge";
import TimerChip from "../../components/common/TimerChip";
import SendNotificationSidebar from "../../components/common/SendNotificationSidebar";
import ReminderSidebar from "../../components/common/ReminderSidebar";
import { useMutation, useQuery } from "react-query";
import { deliveryRequestList } from "../../../services/deliveryRequestService";
import moment from "moment";
import { caseStatus, dealer, services } from "../../../services/masterServices";
import { NavLink } from "react-router-dom";
import { CurrentUser } from "../../../store/slices/userSlice";
import { useSelector } from "react-redux";
import { Dialog } from "primereact/dialog";
import { Tooltip } from "primereact/tooltip";
import {
  ASPLocationMarker,
  DialogCloseSmallIcon,
  EndLocation,
  GoogleMapAPIKey,
  VehicleLocationBlueMarker,
} from "../../utills/imgConstants";
import GoogleMapReact from "google-map-react";
import CurrencyFormat from "../../components/common/CurrencyFormat";
import { getLiveLocation } from "../../../services/deliveryRequestViewService";
import { Button } from "primereact/button";
import ServiceTowingDialog from "./ServiceTowingDialog";
import ServiceViewTowingDialog from "./ServiceViewTowingDialog";

const DeliveryRequestTab = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const params = useLocation();
  const [reminderVisible, setReminderVisible] = useState(false);
  const [filters, setFilters] = useState({
    startDate: moment().startOf("month").format("YYYY-MM-DD"),
    endDate: moment().endOf("month").format("YYYY-MM-DD"),
  });
  const [searchValue, setSearchValue] = useState(null);
  const [livetrackVisible, setLiveTrackVisible] = useState(false);
  const { userTypeId, id, entityId, role } = useSelector(CurrentUser);
  const [aspDetails, setAspDetails] = useState();

  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const {
    data: deliveryListData,
    isLoading,
    isFetching,
  } = useQuery(["deliveryRequestList", pagination, filters, searchValue], () =>
    deliveryRequestList({
      ...pagination,
      ...filters,
      userTypeId: userTypeId,
      userId: userTypeId == 141 ? id : entityId,
      ...(searchValue && { search: searchValue }),
      roleId: role?.id,
      // startDate:'',
      // endDate:''
    })
  );

  const { data: servicesListData } = useQuery(["services"], () =>
    services({
      apiType: "dropdown",
    })
  );

  const { data: activityStatusData } = useQuery(["activityStatus"], () =>
    caseStatus({
      apiType: "dropdown",
    })
  );

  const { data: dealerData } = useQuery(["dealerlist"], () =>
    dealer({
      apiType: "dropdown",
      includeParanoidFalse: 1,
    })
  );

  // console.log(
  //   "servicesListData",
  //   servicesListData?.data?.data,
  //   activityStatusData?.data?.data
  // );

  // console.log("deliveryListData", deliveryListData);

  // Add Notification Modal
  const handleNotification = () => {
    setVisible(true);
  };
  // Reminder Modal function
  const handleReminder = () => {
    setReminderVisible(true);
  };

  //update Activity
  const handleUpdateActivity = () => {
    navigate(`/delivery-request/view/${params?.id}`);
  };

  //handle pagination change
  const handlepageChange = (offset, limit) => {
    // console.log("offset", offset, limit);
    setPagination({
      offset: offset,
      limit: limit,
    });
  };
  const filterData = {
    // service: servicesListData?.data?.data?.map((service) => {
    //   return {
    //     code: service?.id,
    //     label: service?.name,
    //   };
    // }),
    activityStatus: activityStatusData?.data?.data?.map((activity) => {
      return {
        code: activity?.id,
        label: activity?.name,
      };
    }),
    dealers: dealerData?.data?.data?.map((dealer) => {
      return {
        code: dealer?.id,
        label: dealer?.code,
      };
    }),
  };
  const items = [
    {
      label: "Send Notification",
      command: () => handleNotification(),
    },
    {
      label: "Update activity",
      command: () => handleUpdateActivity(),
    },
    {
      label: "Add Reminder",
      command: () => handleReminder(),
    },
  ];
  const columns = [
    {
      title: "Actions",
      field: "actions",
      body: (record, field) => <CaseAction items={items} />,
    },
    {
      title: [1, 3, 7].includes(role?.id) ? "SLA Timer" : "",
      field: "slaStatus",
      body: (record, field) => {
        if ([1, 3, 7].includes(role?.id)) {
          return record.slaSetting?.slaStatus ? (
            <>
              <Tooltip target=".sla-tooltip" position="mouse" />
              <span
                className="sla-tooltip"
                data-pr-tooltip={record?.slaSetting?.slaName}
              >
                <TimerChip
                  label={record.slaSetting.slaStatus}
                  type={record.slaSetting.statusColor}
                />
              </span>
            </>
          ) : (
            "--"
          );
        } else {
          return null;
        }
      },
      className: "bg-color",
      hidden: ![1, 3, 7].includes(role?.id),
    },
    {
      title: "Request ID",
      field: "caseNumber",
      body: (record, field) => (
        <NavLink
          className="text-blue"
          to={`/delivery-request/view/${record.id}`}
        >
          {record.caseNumber ?? "--"}
        </NavLink>
      ),
    },
    {
      title: "Subject",
      field: "subject",
      body: (record, field) => (record.subject !== "" ? record.subject : "--"),
    },
    { title: "Sub Service", field: "subService" },
    {
      title: "Request Date",
      field: "createdAt",
      body: (record, field) =>
        moment(record?.createdAt, "DD/MM/YYYY hh:mm").format("DD/MM/YYYY"),
    },
    {
      title: "Tracking Link",
      field: "tracking_link",
      body: (record, field) =>
        record?.hasTrackingLink ? (
          <a
            className="text-blue text-decoration-underline"
            onClick={() => {
              setAspDetails({
                activityId: record?.activityId,
                aspId: record?.aspId,
                aspName: record?.aspLocation?.details?.aspName,
                pickupDealer: {
                  lat: record?.pickupLocation?.latitude,
                  long: record?.pickupLocation?.longitude,
                  location: record?.pickupLocation?.details?.address,
                },
                dropDealer: {
                  lat: record?.dropLocation?.latitude,
                  long: record?.dropLocation?.longitude,
                  location: record?.dropLocation?.details.address,
                },
                asp: {
                  lat: record?.aspLocation?.latitude,
                  long: record?.aspLocation?.longitude,
                  location: record?.aspLocation?.details?.addressLineOne,
                },
              });
              setLiveTrackVisible(true);
            }}
          >
            View
          </a>
        ) : (
          "--"
        ),
    },
    {
      title: "Estimated Total Amount",
      field: "estimatedTotalAmount",
      body: (record, field) =>
        record?.estimatedTotalAmount ? (
          <CurrencyFormat amount={record?.estimatedTotalAmount} />
        ) : (
          "--"
        ),
    },
    {
      title: "Estimated Total Amount Paid",
      field: "estimatedTotalAmountPaid",
      body: (record, field) =>
        record?.estimatedTotalAmountPaid ? (
          <CurrencyFormat amount={record?.estimatedTotalAmountPaid} />
        ) : (
          "--"
        ),
    },
    {
      title: "Actual Total Amount",
      field: "actualTotalAmount",
      body: (record, field) =>
        record?.actualTotalAmount ? (
          <CurrencyFormat amount={record?.actualTotalAmount} />
        ) : (
          "--"
        ),
    },
    {
      title: "Difference Amount",
      field: "totalDifferenceAmount",
      body: (record, field) =>
        record?.totalDifferenceAmount ? (
          <CurrencyFormat amount={record?.totalDifferenceAmount} />
        ) : (
          "--"
        ),
    },
    {
      title: "Activity Status",
      field: "activityStatusName",
      body: (record, field) =>
        record?.activityStatusName ? (
          <StatusBadge
            text={record?.activityStatusName}
            statusId={record?.activityStatusId}
            statusType={"activityStatus"}
          />
        ) : (
          "--"
        ),
    },
    {
      title: "ASP Activity Status",
      field: "aspActivityStatusName",
      body: (record, field) => <>{record?.aspActivityStatusName ?? "--"}</>,
    },
    {
      title: "Pickup Date",
      field: "deliveryRequestPickupDate",
    },
    {
      title: "Pickup Time",
      field: "deliveryRequestPickupTime",
    },
    {
      title: "Status",
      field: "status",
      body: (record, field) => {
        // console.log("record", record, field);
        return (
          <StatusBadge
            text={record?.status}
            statusId={record?.statusId}
            statusType={"caserequestStatus"}
          />
        );
      },
    },
  ];

  const handleAdd = () => {
    navigate("/delivery-request/new");
  };

  //handle Filters change
  const handleApplyFilter = (values) => {
    // console.log("delivery filterd values", values, values?.service?.code);
    setPagination({
      limit: 10,
      offset: 0,
    });
    setFilters({
      ...(values?.activityStatus && {
        caseStatusId: values?.activityStatus?.code,
      }),
      ...(values?.dealer
        ? {
            dealerId: values?.dealer?.code,
          }
        : {}),
      ...(values.date && {
        startDate: moment(values.date.value[0]).format("YYYY-MM-DD"),
        endDate: moment(values.date.value[1]).format("YYYY-MM-DD"),
      }),
    });
  };

  const handleSearchChange = (value) => {
    setPagination({
      limit: 10,
      offset: 0,
    });
    setSearchValue(value == "" ? null : value);
  };

  const handleReport = () => {
    navigate("/delivery-request/report");
  };

  return (
    <>
      <TableWrapper
        title={"Requests"}
        columns={columns}
        onFilterApply={handleApplyFilter}
        totalRecords={deliveryListData?.data?.data?.count}
        data={deliveryListData?.data?.data?.rows}
        addbtn={role?.id == 2 ? { label: "Create", onClick: handleAdd } : false}
        className="tab-page"
        filterFields={{
          filterFields:
            role?.id == 31
              ? ["activityStatus", "dealer", "date"]
              : ["activityStatus", "date"],
          filterData: filterData,
        }}
        onPaginationChange={handlepageChange}
        action={false}
        loading={isFetching}
        onSearch={handleSearchChange}
        onReport={handleReport}
      />
      <SendNotificationSidebar visible={visible} setVisible={setVisible} />
      <ReminderSidebar
        visible={reminderVisible}
        setVisible={setReminderVisible}
      />
      {/* <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title">{"Live Tracking"}</div>
            <div className="refresh-btn">
              <Button  onClick={handleRefresh}>Refresh</Button>
            </div>
          </div>
        }
        pt={{
          root: { className: "w-968" },
        }}
        visible={livetrackVisible}
        position={"bottom"}
        onHide={() => setLiveTrackVisible(false)}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
      >
        <div className="map-container mt-3_4">
          <GoogleMapReact
            key={refresh}
            defaultCenter={{ lat: 59.95, lng: 30.33 }}
            defaultZoom={11}
            bootstrapURLKeys={{
              key: GoogleMapAPIKey,
            }}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
          ></GoogleMapReact>
        </div>
      </Dialog> */}
      <ServiceViewTowingDialog
        visible={livetrackVisible}
        setVisible={setLiveTrackVisible}
        aspId={aspDetails?.aspId}
        activityId={aspDetails?.activityId}
        aspName={aspDetails?.aspName}
        locationDetails={{
          pickupDealer: aspDetails?.pickupDealer,
          dropDealer: aspDetails?.dropDealer,
          asp: aspDetails?.asp,
        }}
      />
    </>
  );
};

export default DeliveryRequestTab;
