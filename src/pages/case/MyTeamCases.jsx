import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { getAgentProductivityList } from "../../../services/otherService";
import { CurrentUser } from "../../../store/slices/userSlice";
import moment from "moment-timezone";
import { useSelector } from "react-redux";
import TableWrapper from "../../components/common/TableWrapper/TableWrapper";
import StatusBadge from "../../components/common/StatusBadge";
import NewCaseFilters from "../../components/common/NewCaseFilters";

const MyTeamCases = ({
  newFilters,
  onUpdateFilters,
  myTeamCasesDateFilterChange,
  myTeamCasesDateFilters,
  searchValue = "",
  onSearchChange,
}) => {
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const { id, role } = useSelector(CurrentUser);

  // Calling List API with auto-refresh for real-time updates
  const { data: tableData, isFetching: tableLoading } = useQuery(
    ["getAgentProductivityList", pagination, searchValue, newFilters],
    () =>
      getAgentProductivityList({
        ...pagination,
        ...(searchValue && {
          search: searchValue,
        }),
        startDate: newFilters?.calendar?.[0]
          ? moment
              .tz(newFilters?.calendar[0], "Asia/Kolkata")
              .format("YYYY-MM-DD")
          : "",
        endDate: newFilters?.calendar?.[1]
          ? moment
              .tz(newFilters?.calendar[1], "Asia/Kolkata")
              .format("YYYY-MM-DD")
          : "",
        userId: id,
        roleId: role?.id,
      }),
    {
      enabled: role?.id === 7 || role?.id === 1, // Only fetch if team leader or admin
    }
  );

  // Function to handle new filter application
  const handleFilterApply = (filters) => {
    setPagination({
      limit: 10,
      offset: 0,
    });
    onUpdateFilters(filters);
    setIsFilterVisible(false);
    myTeamCasesDateFilterChange(filters);
  };

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

  // Function to format time in human-readable format
  const formatTimeInHumanReadable = (seconds) => {
    if (seconds === null || seconds === undefined || isNaN(seconds)) {
      return "0 sec";
    }

    const totalSeconds = Math.floor(parseFloat(seconds));

    if (totalSeconds === 0) {
      return "0 sec";
    }

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    const parts = [];
    if (hours > 0) {
      parts.push(`${hours} ${hours === 1 ? "hr" : "hrs"}`);
    }
    if (minutes > 0) {
      parts.push(`${minutes} ${minutes === 1 ? "min" : "mins"}`);
    }
    if (secs > 0 || parts.length === 0) {
      parts.push(`${secs} ${secs === 1 ? "sec" : "sec"}`);
    }

    return parts.join(" ");
  };

  const columns = [
    {
      title: "Agent Name",
      field: "agentName",
    },
    {
      title: "Date",
      field: "date",
      body: (record, field) => {
        return record?.date
          ? moment.tz(record.date, "Asia/Kolkata").format("DD/MM/YYYY")
          : "--";
      },
    },
    {
      title: "Login Date",
      field: "loginDatetime",
      body: (record, field) => {
        return record?.loginDatetime
          ? moment
              .tz(record.loginDatetime, "Asia/Kolkata")
              .format("DD/MM/YYYY hh:mm A")
          : "--";
      },
    },
    {
      title: "Current Working Status",
      field: "currentWorkingStatus",
      body: (record, field) => {
        const status = record?.currentWorkingStatus || "Idle";
        // Map status to statusId: Active=1, Idle=2, Present=3, Absent=4, Break=5, Lunch=6
        let statusId = 2; // Default to Idle
        if (status === "Active") {
          statusId = 1;
        } else if (status === "Idle") {
          statusId = 2;
        } else if (status === "Present") {
          statusId = 3;
        } else if (status === "Absent") {
          statusId = 4;
        } else if (status === "Break") {
          statusId = 5;
        } else if (status === "Meal Break") {
          statusId = 6;
        }
        return (
          <StatusBadge
            text={status}
            statusId={statusId}
            statusType="agentProductivityStatus"
          />
        );
      },
    },
    {
      title: "Active Time",
      field: "activeTime",
      body: (record, field) => {
        // Parse string to number if needed (TEXT column)
        const activeTimeSeconds = record?.activeTime
          ? typeof record.activeTime === "string"
            ? parseFloat(record.activeTime)
            : record.activeTime
          : 0;
        return <>{formatTimeInHumanReadable(activeTimeSeconds)}</>;
      },
    },
    {
      title: "Idle Time",
      field: "idleTime",
      body: (record, field) => {
        // Show "--" for absent agents (null idleTime)
        if (record?.idleTime === null || record?.idleTime === undefined) {
          return <>--</>;
        }
        // Parse string to number if needed (TEXT column)
        const idleTimeSeconds =
          typeof record.idleTime === "string"
            ? parseFloat(record.idleTime)
            : record.idleTime;
        return <>{formatTimeInHumanReadable(idleTimeSeconds)}</>;
      },
    },
    {
      title: "Assigned",
      field: "assigned",
      body: (record, field) => {
        return <>{record?.assigned || 0}</>;
      },
    },
    {
      title: "Not Picked",
      field: "notPicked",
      body: (record, field) => {
        return <>{record?.notPicked || 0}</>;
      },
    },
    {
      title: "Picked",
      field: "picked",
      body: (record, field) => {
        return <>{record?.picked || 0}</>;
      },
    },
    {
      title: "In Progress",
      field: "inprogress",
      body: (record, field) => {
        return <>{record?.inprogress || 0}</>;
      },
    },
    {
      title: "Cancelled",
      field: "cancelled",
      body: (record, field) => {
        return <>{record?.cancelled || 0}</>;
      },
    },
    {
      title: "Completed",
      field: "completed",
      body: (record, field) => {
        return <>{record?.completed || 0}</>;
      },
    },
    // {
    //   title: "Last Case Allocated Date",
    //   field: "lastCaseAllocatedDateTime",
    //   body: (record, field) => {
    //     return record?.lastCaseAllocatedDateTime
    //       ? moment
    //           .tz(record.lastCaseAllocatedDateTime, "Asia/Kolkata")
    //           .format("DD/MM/YYYY hh:mm A")
    //       : "--";
    //   },
    // },
  ];

  // Handle Pagination
  const handlepageChange = (offset, limit) => {
    setPagination({
      offset: offset,
      limit: limit,
    });
  };

  return (
    <div>
      <TableWrapper
        title={"My Team Cases"}
        columns={columns}
        action={false}
        loading={tableLoading}
        data={tableData?.data?.data?.rows}
        totalRecords={tableData?.data?.data?.count}
        onPaginationChange={handlepageChange}
        onSearch={handleSearchChange}
        searchValue={searchValue}
        filterChip={newFilters}
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
        filterOptions={{}}
        fieldsConfig={[
          { key: "calendar", label: "Date Range", type: "calendar" },
        ]}
      />
    </div>
  );
};

export default MyTeamCases;
