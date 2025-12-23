import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { Button } from "primereact/button";
import TableWrapper from "../../components/common/TableWrapper/TableWrapper";
import StatusBadge from "../../components/common/StatusBadge";
import UpdateCallInitiateDialog from "./UpdateCallInitiateDialog";
import {
  getCallInitiateList,
  getCallInitiateFilterData,
  exportCallInitiate,
} from "../../../services/caseService";
import { EditIcon } from "../../utills/imgConstants";
import moment from "moment";
import ExportDialog from "../../components/common/ExportDialog";
import { useSelector } from "react-redux";
import { CurrentUser } from "../../../store/slices/userSlice";
import { ImportFileBaseUrl } from "../../utills/imgConstants";
import { download } from "../../utills/download";

const CallInitiate = () => {
  const location = useLocation();
  const [callinitiateVisible, setCallInitiateVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [exportVisible, setExportVisible] = useState(false);
  const { role } = useSelector(CurrentUser);
  const [filters, setFilters] = useState({
    startDate: moment().startOf("month").format("YYYY-MM-DD"),
    endDate: moment().endOf("month").format("YYYY-MM-DD"),
  });
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const permissions = role?.permissions?.map((perm) => perm.name) || [];

  //Calling List API
  const {
    data: tableData,
    refetch: tableRefetch,
    isFetching: tableLoading,
  } = useQuery(["callInitiateList", pagination, searchValue, filters], () =>
    getCallInitiateList({
      ...pagination,
      apiType: "list",
      ...(searchValue && { searchKey: searchValue }),
      ...filters,
    })
  );

  const { data: filterData } = useQuery(["callInitiateListFilter"], () =>
    getCallInitiateFilterData()
  );
  const { mutate: exportMutate, isLoading: exportIsLoading } =
    useMutation(exportCallInitiate);
  // console.log('Table Data => ', tableData);
  // console.log('Table Filter Data => ', filterData);

  //handle Pagination
  const handlePaginationChange = (offset, limit) => {
    // console.log("offset", offset, limit);
    setPagination({
      offset: offset,
      limit: limit,
    });
  };

  // Handle Search change
  const handleSearchChange = (value) => {
    setPagination({
      limit: 10,
      offset: 0,
    });
    setSearchValue(value);
  };

  // Handle Apply Filter
  const handleApplyFilter = (values) => {
    // console.log("filter Values => ", values);
    setPagination({
      limit: 10,
      offset: 0,
    });
    setFilters({
      ...(values?.subjectId && { subjectId: values?.subjectId?.code }),
      ...(values?.dispositionId && {
        dispositionId: values?.dispositionId?.code,
      }),
      ...(values?.clientId && { clientId: values?.clientId?.code }),
      ...(values?.date && {
        startDate: moment(values?.date?.value[0]).format("YYYY-MM-DD"),
        endDate: moment(values?.date?.value[1]).format("YYYY-MM-DD"),
      }),
    });
  };

  // Handle Edit Button Click
  const handleEditClick = (record) => {
    // console.log("edit record => ", record);
    setEditRecord(record);
    setCallInitiateVisible(true);
  };

  useEffect(() => {
    // Check if 'refetch' parameter exists in the query string
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.has("refetch")) {
      // Perform your action here when 'refetch' parameter is present
      // console.log("Refetch parameter is present!");
      // Example: Call a function or dispatch an action
      tableRefetch();
    }
  }, [location?.search]);

  // Table Columns
  const columns = [
    {
      title: "Actions",
      field: "actions",
      body: (record, field) => {
        return (
          <>
            <div className="table-action-container">
              {permissions?.includes("call-initiation-update") && (
                <div className="action-icon">
                  <Button
                    className="btn btn-icon"
                    text
                    onClick={() => handleEditClick(record)}
                  >
                    <EditIcon />
                  </Button>
                </div>
              )}
            </div>
          </>
        );
      },
    },
    {
      title: "Subject",
      field: "subjectName",
    },
    {
      title: "Account",
      field: "clientName",
    },
    {
      title: "Contact Name",
      field: "contactName",
    },
    {
      title: "Mobile Number",
      field: "mobileNumber",
    },
    {
      title: "Call From",
      field: "callName",
    },
    {
      title: "Disposition",
      field: "disposition",
    },
    {
      title: "Case Number",
      field: "caseNumber",
      body: (record, field) => {
        return <>{record?.caseNumber || "--"}</>;
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
      title: "Preferred Lang",
      field: "contactLanguage",
      body: (record, field) => {
        return <>{record?.contactLanguage || "--"}</>;
      },
    },
    {
      title: "Remarks",
      field: "remarks",
      body: (record, field) => {
        return <>{record?.remarks || "--"}</>;
      },
    },
  ];
  const handleExport = () => {
    setExportVisible(true);
  };
  const handleExportSubmit = (values, reset) => {
    exportMutate(values, {
      onSuccess: (res) => {
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          setExportVisible(false);
          reset();
          if (res?.data?.path) {
            download(`${ImportFileBaseUrl}${res?.data?.path}`, "Call Initiate");
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
            setExportVisible(false);
            reset();
            if (res?.data?.path) {
              download(
                `${ImportFileBaseUrl}${res?.data?.path}`,
                "Call Initiate"
              );
            }
          } else {
            res?.data?.errors.forEach((el) => toast.error(el));
          }
        }
      },
    });
  };

  return (
    <div className="page-wrap">
      <div className="page-body">
        <TableWrapper
          title={"Call Initiation"}
          columns={columns}
          data={tableData?.data?.data?.rows}
          loading={tableLoading}
          totalRecords={tableData?.data?.data?.count}
          onPaginationChange={handlePaginationChange}
          onSearch={handleSearchChange}
          filterFields={{
            filterFields: ["subject", "disposition", "account", "date"],
            filterData: {
              subject: filterData?.data?.data?.extras?.subject?.map((item) => {
                return {
                  label: item.name,
                  code: item.id,
                };
              }),
              account: filterData?.data?.data?.extras?.clients?.map((item) => {
                return {
                  label: item.name,
                  code: item.id,
                };
              }),
              disposition: filterData?.data?.data?.extras?.disposition?.map(
                (item) => {
                  return {
                    label: item.name,
                    code: item.id,
                  };
                }
              ),
            },
          }}
          onFilterApply={handleApplyFilter}
          action={true}
          // onExport={handleExport}
          onExport={
            permissions?.includes("call-initiation-export")
              ? handleExport
              : null
          }
        />
        <ExportDialog
          visible={exportVisible}
          setVisible={setExportVisible}
          loading={exportIsLoading}
          onSubmit={handleExportSubmit}
          formats="xlsx"
        />
        {callinitiateVisible && (
          <UpdateCallInitiateDialog
            callinitiateVisible={callinitiateVisible}
            setCallInitiateVisible={setCallInitiateVisible}
            record={editRecord}
            tableRefetch={tableRefetch}
          />
        )}
      </div>
    </div>
  );
};

export default CallInitiate;
