import React, { useState } from "react";
import TableWrapper from "../../../components/common/TableWrapper/TableWrapper";
import StatusBadge from "../../../components/common/StatusBadge";
import { Dialog } from "primereact/dialog";
import { DialogCloseSmallIcon } from "../../../utills/imgConstants";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { toast } from "react-toastify";

const ServiceType = () => {
  const [visible, setVisible] = useState(false);
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const defaultValues = {
    service_type: "",
    status: "Active",
  };
  const { handleSubmit, control, getValues, formState: { errors }, reset } = useForm({defaultValues});

  const columns = [
    { title: "Service Type", field: "service_type" },
    { title: "Created Date", field: "createDate" },
    { title: "Created By", field: "createBy" ,sorter:true},
    { title: "Updated By", field: "updateBy",sorter:true },
    { title: "Updated Date", field: "updateDate" },
    { title: "Deleted By", field: "deletedBy",sorter:true },
    { title: "Deleted Date", field: "deletedDate" },
    { title: "IS Deleted", field: "isDeleted" },
    {
      title: "Status",
      field: "status",
      body: (record, field) => {
        console.log("record", record, field);
        return <StatusBadge text={record.status} statusId={record.statusId} />;
      },
    },
  ];
  const data = Array.from({ length: 10 }, (e, i) => {
    return {
      service_type: "Hydra- Recovery",
      createDate: "19-01-2023 9:00AM",
      createBy: "Abhi",
      updateBy: "Abhi",
      updateDate: "19-01-2023 9:00AM",
      deletedBy: "Abhi",
      deletedDate: "19-01-2023 9:00AM",
      isDeleted: "False",
      status: "inActive",
      statusId: 6,
    };
  });

  const handleAdd = () => {
    setVisible(true);
  };

  const handleFormSubmit = (values) => {
    console.log("form values", values);
    if(values){
       toast.success("Added Successfully",{
        autoClose: 1000,
      })
      setVisible(false)
      reset(defaultValues);
    }
  };
  const handleClose = ()=>{
    setVisible(false);
    reset(defaultValues)
   }
   const handlepageChange = (offset, limit) => {
    console.log("offset", offset, limit);
    setPagination({
      offset: offset,
      limit: limit,
    });
  };
  return (
    <div className="page-wrap">
      <div className="page-body">
        <TableWrapper
          title={"Service Type"}
          rowSelection
          columns={columns}
          data={data}
          totalRecords={data.length}
          onPaginationChange={handlepageChange}
          addbtn={{onClick: handleAdd }}
        />
      </div>
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title">Add Service Type</div>
          </div>
        }
        visible={visible}
        position={"bottom"}
        onHide={handleClose}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
      >
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="row row-gap-3_4">
            <div className="col-md-12">
              <div className="form-group">
                <label className="form-label">Service Type</label>
                <Controller
                  name="service_type"
                  rules={{ required: "Service Type is required." ,
                    }}
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                    <InputText {...field} placeholder="Enter Service Type" />
                    <div className="p-error">
                            {/* {errors[field.name]?.message} */}
                            {errors && errors[field.name]?.message}
                          </div>
                    </>
                  )}
                />
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group radio-form-group">
                <label className="form-label">Status</label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="common-radio-group">
                      <div className="common-radio-item">
                        <RadioButton
                          inputId="radio_active"
                          {...field}
                          value="Active"
                          checked={field.value === "Active"}
                        />
                        <label
                          htmlFor="radio_active"
                          className="common-radio-label"
                        >
                          Active
                        </label>
                      </div>
                      <div className="common-radio-item">
                        <RadioButton
                          inputId="radio_inactive"
                          {...field}
                          value="Inactive"
                          checked={field.value === "Inactive"}
                        />
                        <label
                          htmlFor="radio_inactive"
                          className="common-radio-label"
                        >
                          Inactive
                        </label>
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
          <button className="btn form-submit-btn" type="submit">
            Save
          </button>
        </form>
      </Dialog>
    </div>
  );
};

export default ServiceType;
