import React, { useState } from "react";
import TableWrapper from "../../../components/common/TableWrapper/TableWrapper";
import StatusBadge from "../../../components/common/StatusBadge";
import { Dialog } from "primereact/dialog";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { DialogCloseSmallIcon } from "../../../utills/imgConstants";
import RequestResponeDialoag from "./RequestResponeDialoag";
import "./style.less";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
const ApiDetails = () => {
  const navigate =useNavigate();
  const [visible, setVisible] = useState(false);
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const [viewVisible, setViewVisible] = useState(false);
  const defaultValues = {
    api_type: "Inbound",
    api_url: "",
    api_name: "",
  }
  const { control, handleSubmit ,formState: {errors}, reset } = useForm({defaultValues});

 
  const columns = [
    { title: "API NAme", field: "apiName" ,body: (record, field) => (
      <div
        className="text-blue"
        // onClick={() => navigate("/delivery-request/service-provider")}
      >
        {record.apiName}
      </div>)},
    { title: "API HOST", field: "apiHost" ,sorter:true},
    { title: "API Url", field: "apiUrl" ,body: (record, field) => (
      <a
        className="text-blue"
        // onClick={() => navigate("/delivery-request/service-provider")}
      >
        {record.apiUrl}
      </a>
    ),
    sorter:true,
  },
    { title: "Created Date", field: "createdDate" },
    { title: "Token", field: "token" },
    {
      title: "Request/Response",
      field: "req_res",
      body: (record, field) => (
        <button className="btn-link btn-text" onClick={handleView}>
          View
        </button>
      ),
    },
    {
      title: "API TYPE",
      field: "apiType",
      body: (record, field) => {
        console.log("record", record, field);
        return (
          <StatusBadge text={record.apiType} statusId={record.apitypeId} />
        );
      },
    },
  ];
  const data = Array.from({ length: 20 }, (e, i) => {
    return {
      id: i,
      apiName: "FieldAgentOTPVerify",
      apiHost: "Unifydcm",
      apiUrl:
        "https://link.unifyd.com/UNFYD_CRM_QA/CasesHandlerAction+Field AgentOTPVerify",
      createdDate: "19-01-2023 9:00AM",
      token: "--",
      req_res: "--",
      apiType: i % 2 == 0 ? "Outbound" : "Inbound",
      apitypeId: i % 2 == 0 ? 6 : 1,
    };
  });
  console.log("api Details data", data);

  const handleAdd = () => {
    setVisible(true);
  };
  const handleClose = ()=>{
    setVisible(false);
    reset(defaultValues)
  }
  const handleFormSubmit = (values) => {
    console.log("form values", values);
    if (values) {
      toast.success("Added Successfully", {
        autoClose: 1000,
      });
   
      setVisible(false)
      reset(defaultValues)
    }

  };
  const handleView = () => {
    setViewVisible(true);
  };
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
          title={"API Details"}
          columns={columns}
          data={data}
          filterFields={{
            filterFields: ["Status", "date",],
        
          }}
          totalRecords={data.length}
          onPaginationChange={handlepageChange}
          action={false}
          addbtn={{ label: "New", onClick: handleAdd }}
          selectionMode={null}
        />
      </div>
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title">Add API</div>
          </div>
        }
        pt={{
          root: { className: "w-560" },
        }}
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
                <label className="form-label">API Name</label>
                <Controller
                  name="api_name"
                  control={control}
                  rules={{ required: "API Name is required." }}
                  render={({ field, fieldState }) => (
                    <>
                    <InputText {...field} placeholder="Enter API Name" />
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
                <label className="form-label">API URL</label>
                <Controller
                  name="api_url"
                  rules={{ required: "API URL is required." }}
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                    <InputText {...field} placeholder="Enter API URL" />
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
                <label className="form-label">API Type</label>
                <Controller
                  name="api_type"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="common-radio-group">
                      <div className="common-radio-item">
                        <RadioButton
                          inputId="radio_Inbound"
                          {...field}
                          value="Inbound"
                          checked={field.value === "Inbound"}
                        />
                        <label
                          htmlFor="radio_Inbound"
                          className="common-radio-label"
                        >
                          Inbound
                        </label>
                      </div>
                      <div className="common-radio-item">
                        <RadioButton
                          inputId="radio_Outbound"
                          {...field}
                          value="Outbound"
                          checked={field.value === "Outbound"}
                        />
                        <label
                          htmlFor="radio_Outbound"
                          className="common-radio-label"
                        >
                          Outbound
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
      <RequestResponeDialoag
        visible={viewVisible}
        setVisible={setViewVisible}
      />
    </div>
  );
};

export default ApiDetails;
