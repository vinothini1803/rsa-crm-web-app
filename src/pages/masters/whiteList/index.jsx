import React, { useState } from "react";
import TableWrapper from "../../../components/common/TableWrapper/TableWrapper";
import StatusBadge from "../../../components/common/StatusBadge";
import { Dialog } from "primereact/dialog";
import { Controller, useForm } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { DialogCloseSmallIcon } from "../../../utills/imgConstants";
import { toast } from "react-toastify";

const WhiteList = () => {
  const [visible, setVisible] = useState(false);
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const defaultValues = {
    start_ip: "",
    end_ip: '',
    status: "Allow"
  }
  const { handleSubmit, control, getValues, formState: {errors}, reset } = useForm({defaultValues});

  const columns = [
    {
      title: "Start IP",
      field: "startIp",
    },
    {
      title: "End IP",
      field: "endIp",
    },

    {
      title: "Created Date",
      field: "createdDate",
    },
    {
      title: "Created By",
      field: "createdBy",
      sorter: true
    },
    {
      title: "Updated By",
      field: "updatedBy",
      sorter: true
    },
    {
      title: "Updated Date",
      field: "updatedDate",
    },
    {
      title: "Deleted By",
      field: "deletedBy",
      sorter: true
    },
    {
      title: "Deleted Date",
      field: "deletedDate",
    },
    {
      title: "IS Deleted",
      field: "isDeleted",
    },
    {
      title: "Status",
      field: "status",
      body: (record, field) => {
        console.log("record", record, field);
        return <StatusBadge text={record.status} statusId={record.statusId} />;
      },
    },
  ];
  const data = Array.from({ length: 26 }, (el, index) => {
    return {
      startIp: "103.243.42.196",
      endIp: "103.243.42.196",
      createdDate: "19-01-2023 9:00AM",
      createdBy: "Abhi",
      updatedBy: "Abhi",
      updatedDate: "19-01-2023 9:00AM",
      deletedBy: "Abhi",
      deletedDate: "19-01-2023 9:00AM",
      isDeleted: "False",
      status: index % 2 == 0 ? "inActive" : "active",
      statusId: index % 2 == 0 ? 6 : 1,
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
  }
  return (
    <div className="page-wrap">
      <div className="page-body">
        <TableWrapper
          title={"Whitelist IP"}
          rowSelection
          columns={columns}
          data={data}
          totalRecords={data.length}
          onPaginationChange={handlepageChange}
          addbtn={{ label: "Create", onClick: handleAdd }}
        />
      </div>
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title">Add Vehicle Model</div>
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
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">Start IP</label>
                <Controller
                  name="start_ip"
                  control={control}
                  rules={{ required: "Start IP is required." }}
                  render={({ field, fieldState }) => (
                    <>
                    <Dropdown
                      value={field.value}
                      placeholder="Select"
                      options={[
                        { label: "Center 1", value: "center1" },
                        { label: "Center 2", value: "center2" },
                      ]}
                      optionLabel="label"
                      onChange={(e) => field.onChange(e.value)}
                    />
                     <div className="p-error">
                            {/* {errors[field.name]?.message} */}
                            {errors && errors[field.name]?.message}
                          </div>
                    </>
                  )}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">End IP</label>
                <Controller
                  name="end_ip"
                  control={control}
                  rules={{ required: "End IP is required." }}
                  render={({ field, fieldState }) => (
                    <>
                    <InputText {...field} placeholder="Enter End IP" />
                    <div className="p-error">
                            {/* {errors[field.name]?.message} */}
                            {errors && errors[field.name]?.message}
                          </div>
                    </>
                  )}
                />
              </div>
            </div>
           
            <div className="col-md-6">
              <div className="form-group radio-form-group">
                <label className="form-label">Status</label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="common-radio-group">
                      <div className="common-radio-item">
                        <RadioButton
                          inputId="radio_allow"
                          {...field}
                          value="Allow"
                          checked={field.value === "Allow"}
                        />
                        <label
                          htmlFor="radio_allow"
                          className="common-radio-label"
                        >
                          Allow
                        </label>
                      </div>
                      <div className="common-radio-item">
                        <RadioButton
                          inputId="radio_deny"
                          {...field}
                          value="Deny"
                          checked={field.value === "Deny"}
                        />
                        <label
                          htmlFor="radio_deny"
                          className="common-radio-label"
                        >
                          Deny
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

export default WhiteList;
