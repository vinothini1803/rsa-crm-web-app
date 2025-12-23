import React, { useState } from "react";
import TableWrapper from "../../../components/common/TableWrapper/TableWrapper";
import { ImportFileBaseUrl } from "../../../utills/imgConstants";
import StatusBadge from "../../../components/common/StatusBadge";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router";

import {
  cities,
  deleteCity,
  updateCityStatus,
  cityImportMaster,
  cityExportMaster
} from "../../../../services/masterServices";
import ImportDialog from "../../../components/common/ImportDialog";
import ExportDialog from "../../../components/common/ExportDialog";
import { download } from "../../../utills/download";


const City = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const [importVisible, setImportVisible] = useState(false);
  const [exportVisible, setExportVisible] = useState(false);
  const [filters, setFilters] = useState();


  const { data, isFetching, refetch } = useQuery(
    ["cityList", pagination, searchValue, filters],
    () =>
      cities({
        apiType: "list",
        ...pagination,
        ...(searchValue && { search: searchValue }),
        ...filters
      })
  );

  const { mutate: statusMutate, isLoading: statusIsLoading } =
    useMutation(updateCityStatus);
  const { mutate: deletemutate, isLoading: deleteIsLoading } =
    useMutation(deleteCity);

  const { mutate: importMutate, isLoading: importIsLoading } =
    useMutation(cityImportMaster);

  const { mutate: exportMutate, isLoading: exportIsLoading } =
    useMutation(cityExportMaster);

  const columns = [
    { title: "City Name", field: "name" },
    { title: "State", field: "stateName" },
    { title: "Country", field: "countryName" },
    { title: "Taluk", field: "talukName" },
    { title: "District", field: "districtName" },
    { title: "Nearest City", field: "nearestCityName" },
    { title: "Service Organisation", field: "serviceOrganisationName" },
    { title: "Region", field: "regionName" },
    { title: "Location Type", field: "locationTypeName" },
    { title: "Municipal Limit", field: "municipalLimitName" },
    { title: "Location Category", field: "locationCategoryName" },
    { title: "Created Date and Time", field: "createdAt" },
    {
      title: "Status",
      field: "status",
      body: (record, field) => {
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
    navigate("/master/locations/add/city");
  };

  const handleEdit = (record) => {
    navigate(`edit/${record.id}`);
  };

  const handlepageChange = (offset, limit) => {
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

  //handle status update
  const handleStatusUpdate = (records, status, setVisible) => {
    // console.log(records, status);
    statusMutate(
      {
        cityIds: records?.map((row) => row.id),
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
  const handleDelete = (records, setVisible) => {
    // console.log("deleted record", records);
    deletemutate(
      {
        cityIds: records?.reduce((acc, el) => acc.concat(el.id), []),
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
              "City"
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
                "City"
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
            download(`${ImportFileBaseUrl}${res?.data?.path}`, "City");
          }
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
            setExportVisible(false);
            reset();
            if (res?.data?.path) {
              download(`${ImportFileBaseUrl}${res?.data?.path}`, "City");
            }
          } else {
            res?.data?.errors.forEach((el) => toast.error(el));
          }
        }
      },
    });
  };
  return (
    <>
      <TableWrapper
        title={"City"}
        rowSelection
        columns={columns}
        data={data?.data?.data?.rows}
        addbtn={{ onClick: handleAdd }}
        filterFields={{
          filterFields: ["activestatus"],
        }}
        onFilterApply={handleApplyFilter}
        onEdit={handleEdit}
        totalRecords={data?.data?.data?.count}
        onPaginationChange={handlepageChange}
        className="tab-page"
        loading={isFetching}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        onSearch={handleSearchChange}
        onStatusUpdate={handleStatusUpdate}
        statusLoading={statusIsLoading}
        action={true}
        // onDelete={handleDelete}
        // deleteLoading={deleteIsLoading}
        onImport={handleImport}
        onExport={handleExport}
      />
      <ImportDialog
        visible={importVisible}
        setVisible={setImportVisible}
        sampleExcel={`${ImportFileBaseUrl}/importTemplates/city_import_template.xlsx`}
        masterType={"city"}
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
    </>
  );
};

export default City;
