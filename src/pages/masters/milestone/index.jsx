import React, { useState } from "react";
import TableWrapper from "../../../components/common/TableWrapper/TableWrapper";
import StatusBadge from "../../../components/common/StatusBadge";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { Dialog } from "primereact/dialog";
import { DialogCloseSmallIcon } from "../../../utills/imgConstants";
import { Dropdown } from "primereact/dropdown";
import Note from "../../../components/common/Note";
import { toast } from "react-toastify";

const Milestone = () => {
  const [visible, setVisible] = useState(false);
  const defaultValues = {
    name: "",
    reminde_after: "",
    status: "Allow",
  };
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const { handleSubmit, control, getValues,  formState: { errors }, reset } = useForm({defaultValues});
  const columns = [
    { title: "Milestone name", field: "milestoneName" },
    { title: "Reminder", field: "reminder" },
    {
      title: "Status",
      field: "status",
      body: (record, field) => {
        console.log("record", record, field);
        return <StatusBadge text={record.status} statusId={record.statusId} />;
      },
      sorter: true
    },
  ];
  const data = Array.from({ length: 30 }, (element, index, k) => {
    return {
      milestoneName: "Started To Breakdown",
      reminder: "10 min ",
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
  };
  return (
    <div className="page-wrap">
      <div className="page-body milestone-page">
        <div className="mb-2_3">
          <Note type={"dark"} icon={false} purpose={"detail"}>
            <div>
              <span style={{ fontWeight: 700, marginRight: "7px" }}>
                NOTE :
              </span>
              A reminder to next activity will be activated after every milestone they have achieved.A reminder will popup to the agents to add reminder for the next milestone. 
            </div>
          </Note>
        </div>
        <TableWrapper
          title={"Milestone"}
          rowSelection
          columns={columns}
          data={data}
          totalRecords={data.length}
          onPaginationChange={handlepageChange}
          addbtn={{onClick: handleAdd }}
          className={"milestone-table"}
        />
      </div>
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title">Add MileStone</div>
          </div>
        }
        visible={visible}
        position={"bottom"}
        className="w-490"
        onHide={handleClose}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
      >
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="row row-gap-3_4">
            <div className="col-md-6">
              <div lassName="form-group">
                <label className="form-label">Name</label>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Name is required." ,
                    }}
                  render={({ field, fieldState }) => (
                    <>
                    <InputText {...field} placeholder="Enter Name" />
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
              <div>
                <label className="form-label">Remind After</label>
                <div className="p-inputgroup">
                  <Controller
                    name="reminde_after_time"
                    control={control}
                    render={({ field, fieldState }) => (
                      <>
                      <InputText {...field} placeholder="00:00" />
                      </>
                    )}
                  />

                  <Controller
                    name="reminde_after"
                    control={control}
                    render={({ field, fieldState }) => (
                      <>
                      <Dropdown
                        value={field.value}
                        placeholder="mins"  
                        options={[
                          { label: "Mins", value: "Mins" },
                          { label: "Sec", value: "Sec" },
                        ]}
                        optionLabel="label"
                        onChange={(e) => field.onChange(e.value)}
                      />
                      
                      </>
                    )}
                  />
                </div>
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

export default Milestone;
