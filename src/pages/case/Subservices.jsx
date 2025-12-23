import React, { useEffect, useState } from "react";
import { useQuery, useQueries } from "react-query";
import { useSelector } from "react-redux";
import moment from "moment";
import { Link } from "react-router-dom";
import { Tooltip } from "primereact/tooltip";
import GridView from "./gridSubServiceView/GridView";
import StatusBadge from "../../components/common/StatusBadge";
import TableWrapper from "../../components/common/TableWrapper/TableWrapper";
import TimerChip from "../../components/common/TimerChip";
import CaseAction from "./CaseAction";
import { activityStatus } from "../../../services/adminService";
import {
  getSubServiceList,
  subServiceGrid,
} from "../../../services/caseService";
import { CurrentUser } from "../../../store/slices/userSlice";
import {
  caseStatus,
  subServiceFilterData,
} from "../../../services/masterServices";
import NewCaseFilters from "../../components/common/NewCaseFilters";

const SubServiceList = ({
  layout,
  selectedFilter,
  subServiceDateFilterChange,
  subServiceDateFilters,
  newFilters,
  onUpdateFilters,
  searchValue = "",
  onSearchChange,
}) => {
  const fixedSelectedFilter =
    !selectedFilter ||
    String(selectedFilter).trim() === "" ||
    selectedFilter === "null"
      ? 8
      : selectedFilter;
  // console.log("Fixed selectedFilter:", fixedSelectedFilter);
  const { userTypeId, id, entityId, role } = useSelector(CurrentUser);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  // const [filters, setFilters] = useState({
  //   startDate: moment().startOf("month").format("YYYY-MM-DD"),
  //   endDate: moment().endOf("month").format("YYYY-MM-DD"),
  // });

  const params = {
    //limit: 10,
    //offset: 0,
    //userId: 246,
    // userTypeId: userTypeId,
    search: "",
    // startDate: "",
    // endDate: "",
    //roleId: role?.id,
    //statusType: 1,
  };
  const permissions = role?.permissions?.map((item) => item.name);
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  // useEffect(()=>{
  //   setFilters((prev) => {
  //     if (selectedFilter === " ") {
  //       const { caseStatusId, ...rest } = prev; // Remove caseStatusId
  //       return rest;
  //     }
  //     return {
  //       ...prev,
  //       caseStatusId: selectedFilter,
  //     };
  //   });
  // },[selectedFilter])
  const activityStatusList = [
    {
      id: 1,
      name: "AGENT UNASSIGNED",
    },
    {
      id: 2,
      name: "NOT PICKED",
    },
    {
      id: 3,
      name: "ASP NOT ASSIGNED",
    },
    {
      id: 9,
      name: "ASP NOT REACHED BEYOND SLA",
    },
    {
      id: 4,
      name: "INPROGRESS",
    },
    {
      id: 5,
      name: "CANCELED",
    },
    {
      id: 6,
      name: "REJECTED",
    },
    {
      id: 7,
      name: "CLOSED",
    },
  ];
  // const { data: caseSubServicesList, isFetching: tableLoading } = useQuery(
  //   ["caseSubServicesList", pagination, searchValue, filters],
  //   () =>
  //     getSubServiceList({
  //       ...pagination,
  //       ...(searchValue && {
  //         search: searchValue,
  //       }),
  //       ...filters,
  //       userTypeId: userTypeId,
  //       // userId: userTypeId == 141 ? id : entityId,
  //       userId:id,
  //       roleId: role?.id,
  //       // userTypeId: 141,
  //       // userId: 246
  //     })
  // );
  // const result = useQueries(
  //         activityStatusList
  //             ? activityStatusList?.map((activity, i) => {
  //                 const currentStatus = activity?.name;
  //                 return {
  //                     queryKey: [`subServiceGrid${currentStatus}`, pagination[currentStatus]?.offset],
  //                     queryFn: () =>
  //                         subServiceGrid({
  //                             ...params,
  //                             offset: pagination[currentStatus]?.offset,
  //                             limit: pagination[currentStatus]?.limit,
  //                             userTypeId: userTypeId,
  //                             // userId: userTypeId == 141 ? id : entityId,
  //                             userId:id,
  //                             roleId: role?.id,
  //                             statusType: activity?.id,
  //                             caseStatusId: activity?.id
  //                         }),
  //                     enabled: activityStatusList?.length > 0 ? true : false,
  //                 };
  //             })
  //             : []
  //     );
  const { data: subService, isFetching: subServiceFetching } = useQuery(
    ["subServiceGrid", selectedFilter, pagination, searchValue, newFilters],
    () =>
      subServiceGrid({
        ...params,
        ...pagination,
        ...(searchValue && {
          search: searchValue,
        }),
        //...filters,
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
        activityStatusIds: newFilters?.activityStatuses
          ? newFilters?.activityStatuses
          : null,
        aspActivityStatusIds: newFilters?.aspActivityStatuses
          ? newFilters?.aspActivityStatuses
          : null,
        breakdownAreaStateIds: newFilters?.states ? newFilters?.states : null,
        serviceIds: newFilters?.services ? newFilters?.services : null,
        breakdownLocationCategoryIds: newFilters?.locationCategories
          ? newFilters?.locationCategories
          : null,
        slaStatusIds: newFilters?.slaStatuses ? newFilters?.slaStatuses : null,
        userTypeId: userTypeId,
        startDate: newFilters?.calendar?.[0]
          ? moment(newFilters?.calendar[0]).format("YYYY-MM-DD")
          : "",
        endDate: newFilters?.calendar?.[1]
          ? moment(newFilters?.calendar[1]).format("YYYY-MM-DD")
          : "",
        // userId: userTypeId == 141 ? id : entityId,
        userId: id,
        roleId: role?.id,
        statusType: fixedSelectedFilter,
        //caseStatusId: activity?.id
      }),
    { enabled: activityStatusList?.length > 0 }
  );

  const { data: activityStatusData } = useQuery(["caseActiveStatus"], () =>
    caseStatus({
      apiType: "dropdown",
    })
  );
  const { data: activityData } = useQuery(["activityStatus"], () =>
    activityStatus({
      apiType: "dropdown",
    })
  );
  const { data: subServiceFilterOptionsData } = useQuery(
    ["subServiceFilterData"],
    () => subServiceFilterData()
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
  const handlePageChange = (offset, limit) => {
    setPagination({
      offset: offset,
      limit: limit,
    });
  };

  const handleSearchChange = (value) => {
    setPagination({
      limit: 10,
      offset: 0,
    });
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  // const handleFilter = (values) => {
  //   console.log("values=>", values);
  //   setPagination({
  //     limit: 10,
  //     offset: 0,
  //   });
  //   setFilters({
  //     ...(values?.caseStatusId && { caseStatusId: values?.caseStatusId?.code }),
  //     ...(values?.activityStatus && {
  //       activityStatusId: values?.activityStatus?.code,
  //     }),
  //     ...(values?.date && {
  //       startDate: moment(values?.date?.value[0]).format("YYYY-MM-DD"),
  //       endDate: moment(values?.date?.value[1]).format("YYYY-MM-DD"),
  //     }),
  //   });
  // };

  const columns = [
    {
      title: "Case ID",
      field: "caseNumber",
      body: (record, field) => {
        // console.log("record", record);
        return (
          <div className="d-flex gap-1_2">
            <Link
              className="auth-link"
              to={
                permissions?.includes("sub-service-view-web")
                  ? `/cases/view/${record?.caseDetailId}`
                  : "#"
              }
            >
              {record?.caseNumber}
            </Link>
            {(!record?.activityAgentPickedAt ||
              record?.activityAgentPickedAt == null) &&
              record?.activityStatusId == 1 &&
              record?.caseStatusId == 2 && (
                <StatusBadge
                  text={"Not Picked"}
                  statusId={"13"}
                  statusType={"activityStatus"}
                />
              )}
          </div>
        );
      },
    },
    {
      title: [1, 3, 7].includes(role?.id) ? "SLA Timer" : "",
      field: "crmSla",
      body: (record, field) => {
        if ([1, 3, 7].includes(role?.id)) {
          return record.crmSla?.slaStatus ? (
            <>
              <Tooltip target=".sla-tooltip" position="mouse" />
              <span
                className="sla-tooltip"
                data-pr-tooltip={record?.crmSla?.slaConfigName}
              >
                <TimerChip
                  label={record?.crmSla?.slaStatus}
                  type={record?.crmSla?.statusColor}
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
      title: "Customer Type",
      field: "customerType",
      body: (record, field) => {
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
      body: (record, field) => {
        return <>{record?.subject || "--"}</>;
      },
    },
    {
      title: "Current Contact Name",
      field: "customerContactName",
      body: (record, field) => {
        return <>{record?.customerContactName || "--"}</>;
      },
    },
    {
      title: "Customer Mobile",
      field: "customerMobileNumber",
      body: (record, field) => {
        return <>{record?.customerMobileNumber || "--"}</>;
      },
    },
    {
      title: "Service",
      field: "service",
      body: (record, field) => {
        return <>{record?.service || "--"}</>;
      },
    },
    {
      title: "Sub Service",
      field: "subService",
      body: (record, field) => {
        return <>{record?.subService || "--"}</>;
      },
    },
    {
      title: "Vehicle No",
      field: "registrationNumber",
      body: (record, field) => {
        return <>{record?.registrationNumber || "--"}</>;
      },
    },
    {
      title: "Policy Type",
      field: "policyType",
      body: (record, field) => {
        return <>{record?.policyType || "--"}</>;
      },
    },
    {
      title: "Channel",
      field: "channel",
      body: (record, field) => {
        return <>{record?.channel || "--"}</>;
      },
    },
    {
      title: "Created on",
      field: "activityCreatedAt",
      body: (record, field) => {
        return (
          <>
            {moment(record?.activityCreatedAt, "DD/MM/YYYY hh:mm a").format(
              "DD-MM-YYYY"
            )}
          </>
        );
      },
    },
    {
      title: "Case Status",
      field: "caseStatus",
      body: (record, field) => {
        return (
          <StatusBadge
            text={record?.caseStatus}
            statusType={"caserequestStatus"}
            statusId={record?.caseStatusId}
          />
        );
      },
    },
    {
      title: "Activity Status",
      field: "activityStatus",
      body: (record, field) => {
        return (
          <StatusBadge
            text={record?.activityStatus}
            statusType={"activityStatus"}
            statusId={record?.activityStatusId}
          />
        );
      },
    },
  ];

  return (
    <div>
      {layout == "list" ? (
        <>
          <TableWrapper
            //onFilterApply={handleFilter}
            title={"Sub Services List"}
            columns={columns}
            action={false}
            //loading={tableLoading}
            //data={caseSubServicesList?.data?.data?.rows}
            //totalRecords={caseSubServicesList?.data?.data?.count}
            loading={subServiceFetching}
            data={subService?.data.data?.rows}
            totalRecords={subService?.data?.data?.count}
            onPaginationChange={handlePageChange}
            onSearch={handleSearchChange}
            searchValue={searchValue}
            highlightIrateCustomer={true}
            // filterFields={{
            //   filterFields: ["date", "activityStatus", "caseStatus"],
            //   filterData: {
            //     caseStatus: activityStatusData?.data?.data?.map((item) => {
            //       return {
            //         label: item.name,
            //         code: item.id,
            //       };
            //     }),
            //     activityStatus: activityData?.data?.data?.map((item) => {
            //       return {
            //         label: item.name,
            //         code: item.id,
            //       };
            //     }),
            //   },
            // }}
            filterChip={newFilters}
            filterOptions={subServiceFilterOptionsData?.data?.data}
            removeChip={handleFilterApply}
            className="case-list-tab-page"
            showFilterButton={true}
            onFilterButtonClick={() => setIsFilterVisible(true)}
          />
          {/* Right-Side Filter Panel */}
          <NewCaseFilters
            visible={isFilterVisible}
            onHide={() => setIsFilterVisible(false)}
            onApply={handleFilterApply}
            newFilters={newFilters}
            filterOptions={{
              caseStatuses:
                subServiceFilterOptionsData?.data?.data?.caseStatuses,
              caseSubjects:
                subServiceFilterOptionsData?.data?.data?.caseSubjects,
              states: subServiceFilterOptionsData?.data?.data?.states,
              locationCategories:
                subServiceFilterOptionsData?.data?.data?.locationCategories,
              slaStatuses: subServiceFilterOptionsData?.data?.data?.slaStatuses,
              clients: subServiceFilterOptionsData?.data?.data?.clients,
              services: subServiceFilterOptionsData?.data?.data?.services,
              activityStatuses:
                subServiceFilterOptionsData?.data?.data?.activityStatuses,
              aspActivityStatuses:
                subServiceFilterOptionsData?.data?.data?.aspActivityStatuses,
            }}
            fieldsConfig={[
              { key: "calendar", label: "Requested Date", type: "calendar" },
              {
                key: "caseStatuses",
                label: "Case Statuses",
                type: "multiSelect",
              },
              {
                key: "caseSubjects",
                label: "Case Subjects",
                type: "multiSelect",
              },
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
              {
                key: "slaStatuses",
                label: "Breakdown Reach SLA Statuses",
                type: "multiSelect",
              },
              { key: "clients", label: "Clients", type: "multiSelect" },
              { key: "services", label: "Services", type: "multiSelect" },
              {
                key: "activityStatuses",
                label: "Activity Statuses",
                type: "multiSelect",
              },
              {
                key: "aspActivityStatuses",
                label: "ASP Activity Statuses",
                type: "multiSelect",
              },
            ]}
          />
        </>
      ) : (
        <GridView activityStatusList={activityStatusList} />
      )}
    </div>
  );
};

export default SubServiceList;
