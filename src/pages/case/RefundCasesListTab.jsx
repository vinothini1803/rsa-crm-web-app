import React, { useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import moment from "moment";
import { useSelector } from "react-redux";
import TableWrapper from "../../components/common/TableWrapper/TableWrapper";
import StatusBadge from "../../components/common/StatusBadge";
import { refundCaseList } from "../../../services/caseService";
import { caseStatus, myCaseFilterData } from "../../../services/masterServices";
import { CurrentUser } from "../../../store/slices/userSlice";
import NewCaseFilters from "../../components/common/NewCaseFilters";

const RefundCasesListTab = ({
  refundCasesDateFilterChange,
  refundCasesDateFilters,
  newFilters,
  onUpdateFilters,
  searchValue = "",
  onSearchChange,
}) => {
  const { userTypeId, id, entityId, role } = useSelector(CurrentUser);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filters, setFilters] = useState(refundCasesDateFilters);
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });

  // Update filters when date filters change
  React.useEffect(() => {
    if (refundCasesDateFilters.startDate || refundCasesDateFilters.endDate) {
      setFilters((prev) => ({
        ...prev,
        ...(refundCasesDateFilters.startDate && {
          startDate: refundCasesDateFilters.startDate,
        }),
        ...(refundCasesDateFilters.endDate && {
          endDate: refundCasesDateFilters.endDate,
        }),
      }));
    } else {
      setFilters((prev) => {
        const { startDate, endDate, ...rest } = prev;
        return rest;
      });
    }
  }, [refundCasesDateFilters]);

  // Function to handle new filter application
  const handleFilterApply = (filters) => {
    setPagination({
      limit: 10,
      offset: 0,
    });
    onUpdateFilters(filters);
    setIsFilterVisible(false);
    refundCasesDateFilterChange(filters);
  };

  // Calling List API for refund cases
  const { data: tableData, isFetching: tableLoading } = useQuery(
    ["refundCasesList", pagination, searchValue, filters, newFilters],
    () =>
      refundCaseList({
        ...pagination,
        ...(searchValue && {
          search: searchValue,
        }),
        ...filters,
        userTypeId: userTypeId,
        caseSubjectNames: newFilters?.caseSubjects
          ? newFilters?.caseSubjects
          : null,
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

  const { data: activityStatusData } = useQuery(["caseActiveStatus"], () =>
    caseStatus({
      apiType: "dropdown",
    })
  );

  const { data: myCaseFilterOptionsData } = useQuery(["myCaseFilterData"], () =>
    myCaseFilterData()
  );

  const permissions = role?.permissions?.map((item) => item.name);

  // Helper function to get refund status from record
  const getRefundStatus = (record) => {
    // First check if refundStatus is directly available in the record (from master service)
    if (record?.refundStatus) {
      return {
        refundStatusId: record.refundStatus.refundStatusId,
        refundStatusName: record.refundStatus.refundStatusName,
      };
    }

    // Fallback: Check if activities exist and have transactions with refund status
    if (record?.activities && record.activities.length > 0) {
      for (const activity of record.activities) {
        if (
          activity?.activityTransactions &&
          activity.activityTransactions.length > 0
        ) {
          for (const transaction of activity.activityTransactions) {
            if (transaction?.refundStatusId) {
              return {
                refundStatusId: transaction.refundStatusId,
                refundStatusName:
                  transaction.refundStatusName || "Refund Initiated",
              };
            }
          }
        }
      }
    }
    return null;
  };

  const columns = [
    {
      title: "Case ID",
      field: "caseDetail",
      body: (record, field) => {
        return (
          <Link
            className="auth-link"
            to={
              permissions?.includes("case-view-web") ||
              permissions?.includes("refund-cases-list-web")
                ? `/cases/view/${record?.caseDetailId}`
                : "#"
            }
          >
            {record?.caseDetail?.caseNumber}
          </Link>
        );
      },
    },
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
        return (
          <>
            {record?.customerMobileNumber ||
              record?.caseInformation?.customerMobileNumber ||
              "--"}
          </>
        );
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
      title: "Refund Status",
      field: "refundStatus",
      body: (record, field) => {
        const refundStatus = getRefundStatus(record);
        if (refundStatus) {
          return (
            <StatusBadge
              text={refundStatus.refundStatusName}
              statusType="refundStatus"
              statusId={refundStatus.refundStatusId}
            />
          );
        }
        return <>--</>;
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
      <TableWrapper
        title={"Refund Cases"}
        columns={columns}
        action={false}
        loading={tableLoading}
        data={tableData?.data?.data?.rows}
        totalRecords={tableData?.data?.data?.count}
        onPaginationChange={handlepageChange}
        onSearch={handleSearchChange}
        searchValue={searchValue}
        highlightIrateCustomer={true}
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
          { key: "services", label: "Services", type: "multiSelect" },
        ]}
      />
    </div>
  );
};

export default RefundCasesListTab;
