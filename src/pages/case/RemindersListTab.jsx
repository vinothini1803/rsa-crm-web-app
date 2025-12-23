import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { reminderGetList } from "../../../services/otherService";
import { CurrentUser } from "../../../store/slices/userSlice";
import moment from "moment-timezone";
import { useSelector } from "react-redux";
import TableWrapper from "../../components/common/TableWrapper/TableWrapper";
import StatusBadge from "../../components/common/StatusBadge";
import NewCaseFilters from "../../components/common/NewCaseFilters";
import { Tooltip } from "primereact/tooltip";

const RemindersListTab = ({
  newFilters,
  onUpdateFilters,
  remindersDateFilterChange,
  remindersDateFilters,
  searchValue = "",
  onSearchChange,
}) => {
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const { userTypeId, id, entityId, role } = useSelector(CurrentUser);
  const permissions = role?.permissions?.map((item) => item.name);

  //Calling List API
  const { data: tableData, isFetching: tableLoading } = useQuery(
    ["reminderGetList", pagination, searchValue, newFilters],
    () =>
      reminderGetList({
        ...pagination,
        ...(searchValue && {
          search: searchValue,
        }),
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

  // Function to handle new filter application
  const handleFilterApply = (filters) => {
    setPagination({
      limit: 10,
      offset: 0,
    });
    onUpdateFilters(filters);
    setIsFilterVisible(false);
    remindersDateFilterChange(filters);
  };

  const columns = [
    {
      title: "Case ID",
      field: "caseNumber",
      body: (record, field) => {
        return <>{record?.caseNumber || "--"}</>;
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
      title: "Subject",
      field: "subject",
    },
    {
      title: "Description",
      field: "description",
      body: (record, field) => {
        const description = record?.description || "--";
        const truncatedDescription =
          description.length > 50
            ? `${description.substring(0, 50)}...`
            : description;
        const tooltipId = `desc-tooltip-${
          record?.id || field || Math.random()
        }`;

        return (
          <div>
            <span
              id={tooltipId}
              data-pr-tooltip={description}
              style={{
                cursor:
                  description !== "--" && description.length > 50
                    ? "help"
                    : "default",
              }}
            >
              {truncatedDescription}
            </span>
            <Tooltip target={`#${tooltipId}`} />
          </div>
        );
      },
    },
    {
      title: "Schedule Time",
      field: "scheduleTime",
      body: (record, field) => {
        return (
          <>
            {record?.scheduleTime
              ? moment
                  .tz(record.scheduleTime, "Asia/Kolkata")
                  .format("DD/MM/YYYY hh:mm A")
              : "--"}
          </>
        );
      },
    },
    {
      title: "Priority",
      field: "priority",
      body: (record, field) => {
        return (
          <div>
            {record?.priority?.name ? (
              <StatusBadge
                text={record.priority.name}
                statusId={record.priority.id}
                statusType="priority"
              />
            ) : (
              "--"
            )}
          </div>
        );
      },
    },
    {
      title: "Type",
      field: "type",
      body: (record, field) => {
        return (
          <div>
            {record?.type?.name ? (
              <StatusBadge
                text={record.type.name}
                statusId={record.type.id}
                statusType="type"
              />
            ) : (
              "--"
            )}
          </div>
        );
      },
    },
    {
      title: "Dismiss",
      field: "dismiss",
      body: (record, field) => {
        return (
          <div>
            {record?.dismiss ? (
              <StatusBadge text="Yes" statusId={1} statusType="dismiss" />
            ) : (
              <StatusBadge text="No" statusId={0} statusType="dismiss" />
            )}
          </div>
        );
      },
    },
    {
      title: "Snooze Count",
      field: "snoozeCount",
      body: (record, field) => {
        return <>{record?.snoozeCount || 0}</>;
      },
    },
    {
      title: "Created By",
      field: "createdBy",
      body: (record, field) => {
        return <>{record?.createdBy || "--"}</>;
      },
    },
    {
      title: "Created At",
      field: "createdAt",
      body: (record, field) => {
        return (
          <>
            {record?.createdAt
              ? moment
                  .tz(record.createdAt, "Asia/Kolkata")
                  .format("DD/MM/YYYY hh:mm A")
              : "--"}
          </>
        );
      },
    },
  ];

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

  return (
    <div>
      <TableWrapper
        title={"Reminders"}
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
          { key: "calendar", label: "Created Date", type: "calendar" },
        ]}
      />
    </div>
  );
};

export default RemindersListTab;
