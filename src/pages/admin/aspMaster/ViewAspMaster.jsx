import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import CustomBreadCrumb from "../../../components/common/CustomBreadCrumb";
import {
  CallCentreIcon,
  CloseIcon,
  DialogCloseSmallIcon,
  NextImage,
  PlusIcon,
  PrevImage,
  UserShieldIcon,
} from "../../../utills/imgConstants";
import { TabMenu } from "primereact/tabmenu";
import { TabPanel, TabView } from "primereact/tabview";
import ViewGrid from "../../../components/common/ViewGrid";
import TableWrapper from "../../../components/common/TableWrapper/TableWrapper";
import { DataTable } from "primereact/datatable";
import EmptyComponent from "../../../components/common/TableWrapper/EmptyComponent";
import { Column } from "primereact/column";
import StatusBadge from "../../../components/common/StatusBadge";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import ViewASPTable from "../../../components/common/ViewTable";
import ViewTable from "../../../components/common/ViewTable";
import { useQuery } from "react-query";
import { viewASP } from "../../../../services/adminService";
import Loader from "../../../components/common/Loader";

const ViewAspMaster = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const { handleSubmit, control, getValues, formState, reset } = useForm();
  const [activeIndex, setActiveIndex] = useState(0);
  const [rows, setRows] = useState(10);
  const { aspId } = useParams();
  const [first, setFirst] = useState(0);
  const { data: aspViewData, isFetching } = useQuery(["aspView"], () =>
    viewASP({
      aspId: aspId,
    })
  );

  const aspData = aspViewData?.data?.data?.asp;

  const MenuItems = [
    {
      label: (
        <div onClick={() => navigate("/admin/asp-master")}>ASP Master</div>
      ),
    },
    { label: <div>View ASP Master</div> },
  ];
  const handleClose = () => {
    navigate("/admin/asp-master");
  };

  const BasicDetailsData = [
    {
      label: "Tier ",
      value: aspData?.tierName ?? "--",
    },
    {
      label: "Axapta Code",
      value: aspData?.axaptaCode ?? "--",
      vlaueClassName: "info-badge info-badge-purple",
    },
    {
      label: "Salutation",
      value: aspData?.salutationName ?? "--",
    },
    {
      label: "Name",
      value: aspData?.name ?? "--",
    },
    {
      label: "ASP Code",
      value: aspData?.code ?? "--",
      vlaueClassName: "info-badge info-badge-purple",
    },

    { label: "Workshop Name", value: aspData?.workShopName ?? "--" },
    { label: "Email", value: aspData?.email ?? "--" },
    {
      label: "WhatsApp Number",
      value: aspData?.whatsAppNumber ?? "--",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "Contact Number",
      value: aspData?.contactNumber ?? "--",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "Working Hours",
      value: aspData?.workingHourName ?? "--",
    },
    // {
    //   label: "Login status",
    //   value: "--",
    //   vlaueClassName: "info-badge info-badge-red",
    // },
    {
      label: "Performance",
      value: aspData?.performanceName ?? "--",
    },
    {
      label: "Priority",
      value: aspData?.priorityName ?? "--",
      vlaueClassName: "info-badge info-badge-red",
    },
    {
      label: "Regional Manager Name",
      value: aspData?.rmName ?? "--",
    },
    {
      label: "Regional Manager  Number",
      value: aspData?.rmContactNumber ?? "--",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "Own Patrol",
      value: aspData?.isOwnPatrol ?? "--",
      vlaueClassName: `info-badge info-badge-${
        aspData?.hasMechanic == "Yes" ? "green" : "red"
      }`,
    },
    {
      label: "Has Mechanic",
      value: aspData?.hasMechanic ?? "--",
      vlaueClassName: `info-badge info-badge-${
        aspData?.hasMechanic == "Yes" ? "green" : "red"
      }`,
    },
    {
      label: "Is Finance Admin",
      value: aspData?.isFinanceAdmin ?? "--",
      vlaueClassName: `info-badge info-badge-${
        aspData?.isFinanceAdmin == "Yes" ? "green" : "red"
      }`,
    },
    {
      label: "Status",
      value: aspData?.status ?? "--",
      vlaueClassName: `info-badge info-badge-${
        aspData?.status == "Active" ? "green" : "red"
      }`,
    },
  ];

  const AddressDetailsData = [
    {
      label: "Address Line 1",
      value: aspData?.addressLineOne ?? "--",
    },
    {
      label: "Address Line 2",
      value: aspData?.addressLineTwo ?? "--",
    },
    {
      label: "State",
      value: aspData?.stateName ?? "--",
    },
    {
      label: "City",
      value: aspData?.cityName ?? "--",
    },
    {
      label: "Pincode",
      value: aspData?.pincode ?? "--",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "Location",
      value: aspData?.location ?? "--",
    },
    {
      label: "Latitude",
      value: aspData?.latitude ?? "--",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "Longitude",
      value: aspData?.longitude ?? "--",
      vlaueClassName: "info-badge info-badge-yellow",
    },
  ];
  const columns = [
    {
      title: "Mechanic Code",
      field: "code",
      body: (record, field) => (
        <div
          className="text-blue"
          // onClick={() => navigate("/admin/asp-master/view-mechanic")}
        >
          {record.code}
        </div>
      ),
    },
    { title: "Mechanic Name", field: "name" },
    { title: "Contact Number", field: "contactNumber" },
    {
      title: "Email",
      field: "email",
      body: (record, field) => record?.email ?? "--",
    },
    { title: "Address", field: "address" },
    /*  { title: "Last Login", field: "" },
    {
      title: "Login Status",
      field: "",
      body: (record, field) => {
        console.log("record", record, field);
        return;
      },
    },
    { title: "Business Hours", field: "business_hours" }, */
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
  const serviceColumns = [
    { title: "Sub Service", field: "sub_service" },
    { title: "Service", field: "service" },

    {
      title: "Status",
      field: "status",
      body: (record, field) => {
        console.log("record", record, field);
        return <StatusBadge text={record.status} statusId={record.statusId} />;
      },
    },
  ];
  const clientColumns = [
    { title: "Client Name", field: "client_name" },
    {
      title: "Status",
      field: "status",
      body: (record, field) => {
        console.log("record", record, field);
        return <StatusBadge text={record.status} statusId={record.statusId} />;
      },
    },
  ];
  const data = Array.from({ length: 15 }, (element, index, k) => {
    return {
      mechanic_code: "GJM2FS6316",
      mechanic_name: "Abhi",
      contactnumber: "9876543211",
      email_id: "abhi@gmail.com",
      address: "TVS AA Own Patrol - Lake Town",
      last_login: "19-01-2023  9:00AM",
      login_status: index % 2 == 0 ? "inActive" : "active",
      statusId: index % 2 == 0 ? 6 : 1,
      business_hours: "business",
      // status: index % 2 == 0 ? "inActive" : "active",
      // statusId: index % 2 == 0 ? 6 : 1,
    };
  });
  const clientdata = Array.from({ length: 15 }, (element, index, k) => {
    return {
      client_name: "TATA Motors Limited",
      status: index % 2 == 0 ? "inActive" : "active",
      statusId: index % 2 == 0 ? 6 : 1,
    };
  });
  const servicedata = Array.from({ length: 15 }, (element, index, k) => {
    return {
      service: "Mechanical",
      sub_service: "2 Wheeler Mechanic",
      status: index % 2 == 0 ? "inActive" : "active",
      statusId: index % 2 == 0 ? 6 : 1,
    };
  });
  const handleAdd = () => {
    if (activeIndex == 2 || activeIndex == 3) {
      setVisible(true);
    } else {
      navigate("/admin/asp-master/add-mechanic");
    }
  };
  const handleFormSubmit = () => {};
  const items = [
    {
      label: "Basic Details",
      content: (
        <div className="border-box bg-white">
          <ViewGrid items={BasicDetailsData} className="grid-4" />
        </div>
      ),
    },
    {
      label: "Address Details",
      content: (
        <div className="border-box bg-white">
          <ViewGrid items={AddressDetailsData} className="grid-4" />
        </div>
      ),
    },
    // {
    //   label: "Services",
    //   content: (
    //     <ViewTable
    //       data={servicedata}
    //       Columns={serviceColumns}
    //       first={first}
    //       rows={rows}
    //       setRows={setRows}
    //       setFirst={setFirst}
    //       className={"asp-custom-table"}
    //     />
    //   ),
    // },
    // {
    //   label: "Clients",
    //   content: (
    //     <ViewTable
    //       data={clientdata}
    //       Columns={clientColumns}
    //       first={first}
    //       setFirst={setFirst}
    //       rows={rows}
    //       setRows={setRows}
    //       className={"asp-custom-table"}
    //     />
    //   ),
    // },
    {
      label: "Mechanics",
      content: (
        <ViewTable
          data={aspViewData?.data?.data?.aspMechanics}
          Columns={columns}
          first={first}
          setFirst={setFirst}
          rows={rows}
          setRows={setRows}
          className={"asp-custom-table"}
        />
      ),
    },
  ];
  return (
    <div className="page-wrap">
      <CustomBreadCrumb items={MenuItems} milestone={false} />
      {isFetching ? (
        <Loader />
      ) : (
        <div className="page-body">
          <div className="page-content-wrap">
            <div className="page-content-header">
              <div className="d-flex align-items-center justify-content-between">
                <div className="page-content-title-wrap">
                  <div className="page-content-title-icon">
                    <img
                      className="img-fluid"
                      src={UserShieldIcon}
                      alt="Title Icon"
                    />
                  </div>
                  <div>
                    <h5 className="page-content-title">ASP</h5>
                  </div>
                </div>
                {/*  <div className="page-content-header-right">
                {activeIndex !== 0 && activeIndex !== 1 && (
                  <div>
                    <button
                      className="btn btn-primary btn-with-icon"
                      onClick={handleAdd}
                    >
                      <img src={PlusIcon} />
                      <span>Add</span>
                    </button>
                  </div>
                )}
                <button className="btn btn-close" onClick={handleClose}>
                  <img className="img-fluid" src={CloseIcon} alt="Close" />
                </button>
              </div> */}
              </div>
            </div>
            <div className="page-content-body">
              <TabMenu
                model={items}
                activeIndex={activeIndex}
                onTabChange={(e) => {
                  setActiveIndex(e.index);
                  setFirst(0);
                }}
                className="spearate-tab-menu tab-bg-grey"
              />
              <TabView
                activeIndex={activeIndex}
                onTabChange={(e) => {
                  setActiveIndex(e.index);
                  setFirst(0);
                }}
                className="tab-header-hidden dealer-tabview"
              >
                {items?.map((el) => {
                  return <TabPanel>{el?.content}</TabPanel>;
                })}
              </TabView>
            </div>
          </div>
        </div>
      )}
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title">
              {activeIndex == 2 ? "Add Service" : "Add Client"}
            </div>
          </div>
        }
        visible={visible}
        position={"bottom"}
        onHide={() => setVisible(false)}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
      >
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="row row-gap-3_4">
            {activeIndex == 2 && (
              <>
                <div className="col-md-6">
                  <div lassName="form-group">
                    <label className="form-label">Service</label>
                    <Controller
                      name="service"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Dropdown
                          value={field.value}
                          placeholder="Select Service"
                          options={[
                            { label: "service 1", value: "Service 1" },
                            { label: "Service 2", value: "Service 2" },
                          ]}
                          optionLabel="label"
                          onChange={(e) => field.onChange(e.value)}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div>
                    <label className="form-label">Sub Service</label>
                    <Controller
                      name="sub_service"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Dropdown
                          value={field.value}
                          placeholder="Select Sub Service"
                          options={[
                            { label: "Service 1", value: "Service 1" },
                            { label: "Service 2", value: "Service 2" },
                          ]}
                          optionLabel="label"
                          onChange={(e) => field.onChange(e.value)}
                        />
                      )}
                    />
                  </div>
                </div>
              </>
            )}
            {activeIndex == 3 && (
              <>
                <div className="col-md-6">
                  <div lassName="form-group">
                    <label className="form-label">Client</label>
                    <Controller
                      name="client"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Dropdown
                          value={field.value}
                          placeholder="Select Client"
                          options={[
                            { label: "center1", value: "center1" },
                            { label: "center2", value: "center2" },
                          ]}
                          optionLabel="label"
                          onChange={(e) => field.onChange(e.value)}
                        />
                      )}
                    />
                  </div>
                </div>
              </>
            )}
            <div className="col-md-12">
              <div className="form-group radio-form-group">
                <label className="form-label">Status</label>
                <Controller
                  name="activeStatus"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="common-radio-group">
                      <div className="common-radio-item">
                        <RadioButton
                          inputId="radio_yes"
                          {...field}
                          value="Yes"
                          checked={field.value === "Yes"}
                        />
                        <label
                          htmlFor="radio_yes"
                          className="common-radio-label"
                        >
                          Active
                        </label>
                      </div>
                      <div className="common-radio-item">
                        <RadioButton
                          inputId="radio_no"
                          {...field}
                          value="No"
                          checked={field.value === "No"}
                        />
                        <label
                          htmlFor="radio_no"
                          className="common-radio-label"
                        >
                          InActive
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

export default ViewAspMaster;
