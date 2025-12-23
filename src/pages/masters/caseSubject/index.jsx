import React, { useState } from "react";
import TableWrapper from "../../../components/common/TableWrapper/TableWrapper";
import { useNavigate } from "react-router";
import { ImportFileBaseUrl } from "../../../utills/imgConstants";
import StatusBadge from "../../../components/common/StatusBadge";
import { toast } from "react-toastify";
import {
  subject,
  deleteSubject,
  updateSubjectStatus,
  subjectImportMaster,
  subjectExportMaster,
  caseSubjectQuestionnaireImport,
  caseSubjectQuestionnaireExport,
} from "../../../../services/masterServices";
import { useMutation, useQuery } from "react-query";
import ImportDialog from "../../../components/common/ImportDialog";
import ExportDialog from "../../../components/common/ExportDialog";
import { download } from "../../../utills/download";

const CaseSubject = () => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const [selectedRows, setSelectedRows] = useState(null);
  const [filters, setFilters] = useState();
  const [importVisible, setImportVisible] = useState(false);
  const [exportVisible, setExportVisible] = useState(false);
  const [importQuestionnaireVisible, setImportQuestionnaireVisible] =
    useState(false);
  const [exportQuestionnaireVisible, setExportQuestionnaireVisible] =
    useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { data, isFetching, refetch } = useQuery(
    ["caseSubjectList", pagination, searchValue, filters],
    () =>
      subject({
        apiType: "list",
        ...pagination,
        ...(searchValue && { search: searchValue }),
        ...filters,
      })
  );

  const { mutate: deletemutate, isLoading: deleteIsLoading } =
    useMutation(deleteSubject);
  const { mutate: statusMutate, isLoading: statusIsLoading } =
    useMutation(updateSubjectStatus);
  const { mutate: importMutate, isLoading: importIsLoading } =
    useMutation(subjectImportMaster);
  const { mutate: exportMutate, isLoading: exportIsLoading } =
    useMutation(subjectExportMaster);
  const {
    mutate: importQuestionnaireMutate,
    isLoading: importQuestionnaireIsLoading,
  } = useMutation(caseSubjectQuestionnaireImport);
  const {
    mutate: exportQuestionnaireMutate,
    isLoading: exportQuestionnaireIsLoading,
  } = useMutation(caseSubjectQuestionnaireExport);
  const columns = [
    /*     {
          title: "Taluk_Id",
          field: "id",
          body: (record, field) => record?.id ?? "--",
        },
     */
    { title: "Case Subject", field: "name" },
    { title: "Client", field: "clientName" },
    { title: "Case Type", field: "caseTypeName" },
    { title: "Created Date", field: "createdAt" },
    {
      title: "Status",
      field: "status",
      body: (record, field) => {
        console.log("record", record, field);
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
    navigate("/master/case-subject/add");
  };
  const handlepageChange = (offset, limit) => {
    console.log("offset", offset, limit);
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
    navigate(`/master/case-subject/edit/${record.id}`);
  };
  const handleDelete = (records, setVisible) => {
    console.log("deleted record", records);
    deletemutate(
      {
        caseSubjectIds: records?.reduce((acc, el) => acc.concat(el.id), []),
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setSelectedRows();
            setVisible(false);
            refetch();
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
    console.log(records, status);
    statusMutate(
      {
        caseSubjectIds: records?.map((row) => row.id),
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
              res?.data?.errors?.forEach((el) => toast.error(el));
            }
          }
        },
      }
    );
  };
  const handleApplyFilter = (values) => {
    setPagination({
      limit: 10,
      offset: 0,
    });
    setFilters({
      status: values?.status?.label,
    });
  };
  const handleImport = () => {
    setImportVisible(true);
  };
  const handleExport = () => {
    setExportVisible(true);
  };
  const handleQuestionnaireImport = () => {
    setImportQuestionnaireVisible(true);
  };
  const handleQuestionnaireExport = () => {
    setExportQuestionnaireVisible(true);
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
              "Case Subject"
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
                "Case Subject"
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
            download(`${ImportFileBaseUrl}${res?.data?.path}`, "Case Subject");
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
            setExportVisible(false);
            reset();
            if (res?.data?.path) {
              download(
                `${ImportFileBaseUrl}${res?.data?.path}`,
                "Case Subject"
              );
            }
          } else {
            res?.data?.errors.forEach((el) => toast.error(el));
          }
        }
      },
    });
  };
  const handleImportQuestionnaireSubmit = (formData, reset) => {
    // console.log(
    //   "Case Subject Questionnaire Import - Calling caseSubjectQuestionnaireImport API"
    // );
    importQuestionnaireMutate(formData, {
      onSuccess: (res) => {
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          setImportQuestionnaireVisible(false);
          reset();
          refetch();
          if (res?.data?.errorFilePath) {
            download(
              `${ImportFileBaseUrl}${res?.data?.errorFilePath}`,
              "Case Subject Questionnaire"
            );
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
            setImportQuestionnaireVisible(false);
            reset();
            refetch();
            if (res?.data?.errorFilePath) {
              download(
                `${ImportFileBaseUrl}${res?.data?.errorFilePath}`,
                "Case Subject Questionnaire"
              );
            }
          } else {
            res?.data?.errors.forEach((el) => toast.error(el));
          }
        }
      },
    });
  };
  const handleExportQuestionnaireSubmit = (values, reset) => {
    exportQuestionnaireMutate(values, {
      onSuccess: (res) => {
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          setExportQuestionnaireVisible(false);
          reset();
          if (res?.data?.path) {
            download(
              `${ImportFileBaseUrl}${res?.data?.path}`,
              "Case Subject Questionnaire"
            );
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
            setExportQuestionnaireVisible(false);
            reset();
            if (res?.data?.path) {
              download(
                `${ImportFileBaseUrl}${res?.data?.path}`,
                "Case Subject Questionnaire"
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
          title={"Case Subject"}
          rowSelection
          columns={columns}
          data={data?.data?.data?.rows}
          totalRecords={data?.data?.data?.count}
          onPaginationChange={handlepageChange}
          addbtn={{ onClick: handleAdd }}
          filterFields={{
            filterFields: ["activestatus"],
          }}
          onFilterApply={handleApplyFilter}
          onEdit={handleEdit}
          loading={isFetching}
          onSearch={handleSearchChange}
          action={true}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          onStatusUpdate={handleStatusUpdate}
          statusLoading={statusIsLoading}
          // onDelete={handleDelete}
          // deleteLoading={deleteIsLoading}
          onImport={handleImport}
          onExport={handleExport}
          onQuestionnaireImport={handleQuestionnaireImport}
          onQuestionnaireExport={handleQuestionnaireExport}
        />
      </div>
      <ImportDialog
        visible={importVisible}
        setVisible={setImportVisible}
        sampleExcel={`${ImportFileBaseUrl}/importTemplates/case_subject_import_template.xlsx`}
        masterType={"caseSubject"}
        onSubmit={handleImportSubmit}
        loading={importIsLoading}
      />
      <ExportDialog
        visible={exportVisible}
        setVisible={setExportVisible}
        loading={exportIsLoading}
        onSubmit={handleExportSubmit}
        formats="xlsx"
        dateRangeOptional={true}
      />
      <ImportDialog
        visible={importQuestionnaireVisible}
        setVisible={setImportQuestionnaireVisible}
        sampleExcel={`${ImportFileBaseUrl}/importTemplates/case_subject_questionnaire_import_template.xlsx`}
        masterType={"caseSubjectQuestionnaire"}
        onSubmit={handleImportQuestionnaireSubmit}
        loading={importQuestionnaireIsLoading}
      />
      <ExportDialog
        visible={exportQuestionnaireVisible}
        setVisible={setExportQuestionnaireVisible}
        loading={exportQuestionnaireIsLoading}
        onSubmit={handleExportQuestionnaireSubmit}
        formats="xlsx"
        dateRangeOptional={true}
      />
    </div>
  );
};

export default CaseSubject;
