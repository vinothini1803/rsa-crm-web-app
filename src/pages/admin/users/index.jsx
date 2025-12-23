import React, { useState } from "react";
import TableWrapper from "../../../components/common/TableWrapper/TableWrapper";
import { useNavigate } from "react-router";
import StatusBadge from "../../../components/common/StatusBadge";
import {
  FileBaseUrl,
  ProfileImage,
  ProfileUrl,
} from "../../../utills/imgConstants";
import { useMutation, useQuery } from "react-query";
import {
  deleteUser,
  updateUserStatus,
  usersList,
  exportUser,
  importUser,
  importUserSkill,
  exportUserSkill,
} from "../../../../services/adminService";
import { toast } from "react-toastify";
import Avatar from "../../../components/common/Avatar";
import ImportDialog from "../../../components/common/ImportDialog";
import ExportDialog from "../../../components/common/ExportDialog";
import { download } from "../../../utills/download";
import { ImportFileBaseUrl } from "../../../utills/imgConstants";

const Users = () => {
  const navigate = useNavigate();
  const [importVisible, setImportVisible] = useState(false);
  const [exportVisible, setExportVisible] = useState(false);
  const [importSkillVisible, setImportSkillVisible] = useState(false);
  const [exportSkillVisible, setExportSkillVisible] = useState(false);
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const [selectedRows, setSelectedRows] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const { data, isFetching, refetch } = useQuery(
    ["userList", pagination, searchValue],
    () =>
      usersList({
        ...pagination,
        ...(searchValue && { search: searchValue }),
      })
  );

  const { mutate, isLoading } = useMutation(deleteUser);
  const { mutate: statusMutate, isLoading: statusIsLoading } =
    useMutation(updateUserStatus);
  // console.log("user data", data?.data?.data?.rows);
  const { mutate: importMutate, isLoading: importIsLoading } =
    useMutation(importUser);
  const { mutate: exportMutate, isLoading: exportIsLoading } =
    useMutation(exportUser);
  const { mutate: importSkillMutate, isLoading: importSkillIsLoading } =
    useMutation(importUserSkill);
  const { mutate: exportSkillMutate, isLoading: exportSkillIsLoading } =
    useMutation(exportUserSkill);
  const columns = [
    {
      title: "Profile",
      field: "profile",
      body: (record, field) => {
        // console.log("record", record, field);

        return record.profileName ? (
          <img
            src={`${ProfileUrl}${record.profileName}`}
            className="user-table-list-profile"
            alt="user"
            style={{ width: "42px", height: "42px", borderRadius: "50%" }}
          />
        ) : (
          <Avatar
            text={record?.name?.charAt(0).toUpperCase()}
            className={"user-list-avatar"}
          />
        );
      },
    },
    { title: "Name", field: "name" },
    { title: "Username", field: "userName" },

    { title: "Role", field: "roleName" },
    {
      title: "Contact Number",
      field: "mobileNumber",
      body: (record, field) => record?.mobileNumber ?? "--",
    },
    {
      title: "Email",
      field: "email",
      body: (record, field) => record?.email ?? "--",
    },
    {
      title: "Last Login",
      field: "lastLoginDateTime",
      body: (record, field) => record?.lastLoginDateTime ?? "--",
    },
    { title: "created at", field: "createdAt" },
    ,
    {
      title: "Inactive Date & Time",
      field: "inActiveDate",
      body: (record, field) => record?.inActiveDate ?? "--",
    },
    // {
    //   title: "Login Flag",
    //   field: "login_flag",
    //   body: (record, field) => {
    //     return <div style={{ textTransform: "capitalize" }}>{}</div>;
    //   },
    // },
    {
      title: "Status",
      field: "status",
      body: (record, field) => {
        // console.log("record", record, field);
        return (
          <StatusBadge
            text={record.status}
            statusId={record.status == "Active" ? 1 : 0}
            statusType={"activestatus"}
          />
        );
      },
    },
  ];

  const handleAdd = () => {
    navigate("/admin/users/add");
  };
  const handlepageChange = (offset, limit) => {
    // console.log("offset", offset, limit);
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
    setSearchValue(value);
  };

  const handleEdit = (record) => {
    navigate(`edit/${record.id}`);
  };

  const handleDelete = (records, setVisible) => {
    mutate(
      {
        userIds: records?.reduce((acc, el) => acc.concat(el.id), []),
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setVisible(false);
            refetch();
            setSelectedRows();
          } else {
            if (res?.data?.error) {
              toast.error(res?.data?.error);
            } else {
              res?.data?.errors?.forEach((el) => toast.error(el));
            }
          }
        },
      }
    );
  };

  const handleStatusUpdate = (records, status, setVisible) => {
    // console.log(records, status);
    statusMutate(
      {
        userIds: records?.map((row) => row.id),
        status: status,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            refetch();
            setVisible(false);
            setSelectedRows();
          } else {
            if (res?.data?.error) {
              toast.error(res?.data?.error);
            } else {
              es?.data?.errors?.forEach((el) => toast.error(el));
            }
          }
        },
      }
    );
  };

  const handleImport = () => {
    setImportVisible(true);
  };
  const handleExport = () => {
    setExportVisible(true);
  };
  const handleSkillImport = () => {
    setImportSkillVisible(true);
  };
  const handleSkillExport = () => {
    setExportSkillVisible(true);
  };
  const handleImportSubmit = (formData, reset) => {
    importMutate(formData, {
      onSuccess: (res) => {
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          setImportVisible(false);
          reset();
          refetch();
          if (res?.data?.errorFilePath) {
            download(
              `${ImportFileBaseUrl}${res?.data?.errorFilePath}`,
              "Users"
            );
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
            setImportVisible(false);
            reset();
            refetch();
            if (res?.data?.errorFilePath) {
              download(
                `${ImportFileBaseUrl}${res?.data?.errorFilePath}`,
                "Users"
              );
            }
          } else {
            res?.data?.errors.forEach((el) => toast.error(el));
          }
        }
      },
    });
  };
  const handleExportSubmit = (values, reset) => {
    exportMutate(values, {
      onSuccess: (res) => {
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          setExportVisible(false);
          reset();
          if (res?.data?.path) {
            download(`${ImportFileBaseUrl}${res?.data?.path}`, "users");
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
            setExportVisible(false);
            reset();
            if (res?.data?.path) {
              download(`${ImportFileBaseUrl}${res?.data?.path}`, "users");
            }
          } else {
            res?.data?.errors.forEach((el) => toast.error(el));
          }
        }
      },
    });
  };

  // User Skill import and export
  const handleImportSkillSubmit = (formData, reset) => {
    importSkillMutate(formData, {
      onSuccess: (res) => {
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          setImportSkillVisible(false);
          reset();
          refetch();
          if (res?.data?.path) {
            download(`${ImportFileBaseUrl}${res?.data?.path}`, "User Skill");
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
            setImportSkillVisible(false);
            reset();
            refetch();
            if (res?.data?.path) {
              download(`${ImportFileBaseUrl}${res?.data?.path}`, "User Skill");
            }
          } else {
            res?.data?.errors.forEach((el) => toast.error(el));
          }
        }
      },
    });
  };

  const handleExportSkillSubmit = (values, reset) => {
    exportSkillMutate(values, {
      onSuccess: (res) => {
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          setExportSkillVisible(false);
          reset();
          if (res?.data?.path) {
            download(`${ImportFileBaseUrl}${res?.data?.path}`, "User Skill");
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
            setExportSkillVisible(false);
            reset();
            if (res?.data?.path) {
              download(`${ImportFileBaseUrl}${res?.data?.path}`, "User Skill");
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
          title={"Users"}
          className={"table-with-profile"}
          rowSelection
          columns={columns}
          data={data?.data?.data?.rows}
          totalRecords={data?.data?.data?.count}
          onPaginationChange={handlepageChange}
          // filterFields={{
          //   filterFields: ["designation", "role", "team", "Status"],
          // }}
          exportAction={false}
          addbtn={{ label: "New User", onClick: handleAdd }}
          onSearch={handleSearchChange}
          loading={isFetching}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          onEdit={handleEdit}
          // onDelete={handleDelete}
          onStatusUpdate={handleStatusUpdate}
          // deleteLoading={isLoading}
          statusLoading={statusIsLoading}
          action={true}
          onImport={handleImport}
          onExport={handleExport}
          onSkillImport={handleSkillImport}
          onSkillExport={handleSkillExport}
        />
        <ImportDialog
          visible={importVisible ? importVisible : importSkillVisible}
          setVisible={importVisible ? setImportVisible : setImportSkillVisible}
          //sampleCSV={`${ImportFileBaseUrl}/importTemplates/user_master_import_template.csv`}
          sampleExcel={`${ImportFileBaseUrl}/importTemplates/${
            importVisible
              ? "user_master_import_template.xlsx"
              : "userSkill_import_template.xlsx"
          }`}
          masterType={importVisible ? "user" : "userSkill"}
          onSubmit={
            importVisible ? handleImportSubmit : handleImportSkillSubmit
          }
          loading={importVisible ? importIsLoading : importSkillIsLoading}
        />
        <ExportDialog
          visible={exportVisible ? exportVisible : exportSkillVisible}
          setVisible={exportVisible ? setExportVisible : setExportSkillVisible}
          loading={exportVisible ? exportIsLoading : exportSkillIsLoading}
          onSubmit={
            exportVisible ? handleExportSubmit : handleExportSkillSubmit
          }
          formats="xlsx"
          dateRangeOptional={true}
        />
      </div>
    </div>
  );
};

export default Users;
