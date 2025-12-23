import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import moment from "moment";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import CaseAction from "./CaseAction";
import TableWrapper from "../../components/common/TableWrapper/TableWrapper";
import StatusBadge from "../../components/common/StatusBadge";
import TimerChip from "../../components/common/TimerChip";
import GridView from "./gridMyCaseView/GridView";
import { Button } from "primereact/button";
import { caseList } from "../../../services/caseService";
import { caseStatus, myCaseFilterData } from "../../../services/masterServices";
import { CurrentUser } from "../../../store/slices/userSlice";
import NewCaseFilters from "../../components/common/NewCaseFilters";

const MyCases = ({
  layout,
  selectedFilter,
  myCasesDateFilterChange,
  myCasesDateFilters,
  newFilters,
  onUpdateFilters,
  searchValue = "",
  onSearchChange,
}) => {
  const { userTypeId, id, entityId, role } = useSelector(CurrentUser);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filters, setFilters] = useState(myCasesDateFilters);

  useEffect(() => {
    setFilters((prev) => {
      if (selectedFilter === " ") {
        const { caseStatusId, psfStatus, ...rest } = prev; // Remove caseStatusId and psfStatus
        return rest;
      }
      
      // Check if it's a PSF status filter
      if (selectedFilter === "psf-completed") {
        const { caseStatusId, ...rest } = prev; // Remove caseStatusId when setting PSF filter
        return {
          ...rest,
          psfStatus: 2,
          ...(myCasesDateFilters.startDate && {
            startDate: myCasesDateFilters.startDate,
          }),
          ...(myCasesDateFilters.endDate && {
            endDate: myCasesDateFilters.endDate,
          }),
        };
      } else if (selectedFilter === "psf-not-completed") {
        const { caseStatusId, ...rest } = prev; // Remove caseStatusId when setting PSF filter
        return {
          ...rest,
          psfStatus: 1,
          ...(myCasesDateFilters.startDate && {
            startDate: myCasesDateFilters.startDate,
          }),
          ...(myCasesDateFilters.endDate && {
            endDate: myCasesDateFilters.endDate,
          }),
        };
      } else {
        // It's a case status filter
        const { psfStatus, ...rest } = prev; // Remove psfStatus when setting case status filter
        return {
          ...rest,
          caseStatusId: selectedFilter,
          ...(myCasesDateFilters.startDate && {
            startDate: myCasesDateFilters.startDate,
          }),
          ...(myCasesDateFilters.endDate && {
            endDate: myCasesDateFilters.endDate,
          }),
        };
      }
    });
  }, [selectedFilter, myCasesDateFilters]);
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });

  // Function to handle new filter application
  const handleFilterApply = (filters) => {
    setPagination({
      limit: 10,
      offset: 0,
    });
    onUpdateFilters(filters);
    setIsFilterVisible(false);
    myCasesDateFilterChange(filters);
  };
  //Calling List API
  const { data: tableData, isFetching: tableLoading } = useQuery(
    ["caseList", pagination, searchValue, filters, newFilters],
    () =>
      caseList({
        ...pagination,
        ...(searchValue && {
          search: searchValue,
        }),
        ...filters,
        userTypeId: userTypeId,
        // userId: userTypeId == 141 ? id : entityId,
        caseSubjectNames: newFilters?.caseSubjects
          ? newFilters?.caseSubjects
          : null,
        //clientIds: newFilters?.clients ? newFilters?.clients : null,
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
    setPagination({
      offset: offset,
      limit: limit,
    });
  };

  // Handle Apply Filter
  // const handleFilter = (values) => {
  //   setPagination({
  //     limit: 10,
  //     offset: 0,
  //   });
  //   setFilters({
  //     ...(values?.caseStatusId && { caseStatusId: values?.caseStatusId?.code }),
  //     ...(values?.date && {
  //       startDate: moment(values?.date?.value[0]).format("YYYY-MM-DD"),
  //       endDate: moment(values?.date?.value[1]).format("YYYY-MM-DD"),
  //     }),
  //   });
  // };

  const { data: activityStatusData } = useQuery(["caseActiveStatus"], () =>
    caseStatus({
      apiType: "dropdown",
    })
  );
  const { data: myCaseFilterOptionsData } = useQuery(["myCaseFilterData"], () =>
    myCaseFilterData()
  );

  const permissions = role?.permissions?.map((item) => item.name);
  const isPSFUser = permissions?.includes("psf-cases");

  const columns = [
    /* {
          title: "Actions",
          field: "actions",
          body: (record, field) => <CaseAction items={items} />,
        }, */
    /* {
          title: "SLA Timer",
          field: "slatimer",
          body: (record, field) => <TimerChip label="SLA Violated" type="danger" />,
        }, */
    {
      title: "Case ID",
      field: "caseDetail",
      body: (record, field) => {
        return (
          <Link
            className="auth-link"
            to={
              permissions?.includes("case-view-web") || permissions?.includes("psf-case-view")
                ? `/cases/view/${record?.caseDetailId}`
                : "#"
            }
          >
            {record?.caseDetail?.caseNumber}
          </Link>
        );
      },
    },
    ...(isPSFUser
      ? [
          {
            title: "PSF Status",
            field: "caseDetail",
            body: (record, field) => {
              const statusText = record?.caseDetail?.psfStatus === 2 ? "Completed" : "Not Completed";
              return (
                <StatusBadge
                  text={statusText}
                  statusType="psfStatus"
                  statusId={record?.caseDetail?.psfStatus}
                />
              );
            },
          },
        ]
      : []),
    {
      title: "Customer Type",
      field: "caseType",
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
      field: "caseDetail",
      body: (record, field) => {
        return <>{record?.caseDetail?.subject}</>;
      },
    },
    {
      title: "Current Contact Name",
      field: "customerContactName",
    },
    {
      title: "Customer Mobile",
      field: "customerMobileNumber",
      body: (record, field) => {
        return <>{record?.customerMobileNumber || record?.caseInformation?.customerMobileNumber || "--"}</>;
      },
    },
    {
      title: "Service",
      field: "service",
    },
    {
      title: "Vehicle No",
      field: "caseDetail",
      body: (record, field) => {
        return <>{record?.caseDetail?.registrationNumber || "--"}</>;
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
      field: "caseDetail",
      body: (record, field) => {
        return (
          <>
            {moment(record?.caseDetail?.createdAt, "DD/MM/YYYY hh:mm a").format(
              "DD-MM-YYYY"
            )}
          </>
        );
      },
    },
    {
      title: "Case Status",
      field: "caseDetail",
      body: (record, field) => {
        return (
          <StatusBadge
            text={record?.caseDetail?.status}
            statusType={"caserequestStatus"}
            statusId={record?.caseDetail?.statusId}
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
            title={"All Cases"}
            columns={columns}
            action={false}
            loading={tableLoading}
            data={tableData?.data?.data?.rows}
            totalRecords={tableData?.data?.data?.count}
            onPaginationChange={handlepageChange}
            onSearch={handleSearchChange}
            searchValue={searchValue}
            highlightIrateCustomer={true}
            //selectedDateFilters={filters}
            // expand={searchValue?true:false}
            // filterFields={{
            //   filterFields: ["date", "caseStatus"],
            //   filterData: {
            //     caseStatus: activityStatusData?.data?.data?.map((item) => {
            //       return {
            //         label: item.name,
            //         code: item.id,
            //       };
            //     }),
            //   },
            // }}
            // filterFields={{
            //   filterFields:["date"]
            // }}
            filterChip={newFilters}
            filterOptions={myCaseFilterOptionsData?.data?.data}
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
              caseSubjects: myCaseFilterOptionsData?.data?.data?.caseSubjects,
              states: myCaseFilterOptionsData?.data?.data?.states,
              locationCategories:
                myCaseFilterOptionsData?.data?.data?.locationCategories,
              services: myCaseFilterOptionsData?.data?.data?.services,
              calendar: myCaseFilterOptionsData?.data?.data?.calendar,
            }}
            fieldsConfig={[
              { key: "calendar", label: "Requested Date", type: "calendar" },
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
              //{ key: "clients", label: "Clients", type: "multiSelect" },
              { key: "services", label: "Services", type: "multiSelect" },
            ]}
          />
        </>
      ) : (
        <GridView activityStatusData={activityStatusData?.data?.data} />
      )}
    </div>
  );
};

export default MyCases;
