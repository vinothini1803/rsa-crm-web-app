import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { useNavigate } from "react-router";
import { RadioButton } from "primereact/radiobutton";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { CloseIcon, DialogCloseSmallIcon } from "../../../utills/imgConstants";
import TableWrapper from "../../../components/common/TableWrapper/TableWrapper";
import { MultiSelect } from "primereact/multiselect";
import { toast } from "react-toastify";

const VehicleInventoryTab = () => {
  const [visible, setVisible] = useState(false);
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const  defaultValues = {
    client_name: "",
    inventory_items: "",
    status: "Active",
  }
  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
    reset,
  } = useForm({
   defaultValues
  });
  const columns = [
    { title: "Client", field: "client" },
    { title: "Inventory Items", field: "inventory_items" },
  ];
  const data = Array.from({ length: 60 }, (e, i) => {
    return {
      id: i,
      client: "Honda",
      inventory_items: "Vehicle Manual, Wheel Jack, Spare Wheel",
    };
  });
  const handleFormSubmit = (values) => {
    console.log("form values", values);
    if (values) {
      toast.success("Added Successfully", {
        autoClose: 1000,
      });
      setVisible(false);
      reset(defaultValues);
    }
  };
  const handlepageChange = (offset, limit) => {
    console.log("offset", offset, limit);
    setPagination({
      offset: offset,
      limit: limit,
    });
  }
  const handleClose = () => {
    setVisible(false);
    reset(defaultValues);
  };
  const handleAdd = () => {
    setVisible(true);
  };
  const cities = [
    { name: "New York", code: "NY" },
    { name: "Rome", code: "RM" },
    { name: "London", code: "LDN" },
    { name: "Istanbul", code: "IST" },
    { name: "Paris", code: "PRS" },
  ];
  return (
    <>
      <TableWrapper
        title={"Vehicle Inventory"}
        columns={columns}
        data={data}
        rowSelection
        className="tab-page"
        totalRecords={data.length}
        onPaginationChange={handlepageChange}
        addbtn={{ label: "create", onClick: handleAdd }}
        action={false}
      />
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title">Add Vehicle Inventory</div>
          </div>
        }
        visible={visible}
        className="w-372"
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
                <label className="form-label">Client Name</label>
                <Controller
                  name="client_name"
                  control={control}
                  rules={{ required: "Client Name is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        placeholder="Select Scheme"
                        options={[
                          { label: "TVS", value: "OEM" },
                          { label: "ABS", value: "Dealer" },
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
            <div className="col-md-12">
              <div className="form-group">
                <label className="form-label">Inventory Items</label>

                <Controller
                  name="inventory_items"
                  control={control}
                  rules={{ required: "Inventory Items is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <MultiSelect
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        options={cities}
                        optionLabel="name"
                        display="chip"
                        placeholder="Select Cities"
                        maxSelectedLabels={3}
                        className="custom-multiselect"
                        removeIcon={(options) => (
                          <img src={CloseIcon} {...options.iconProps} />
                        )}
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
                          inputId="radio_Inactive"
                          {...field}
                          value="Inactive"
                          checked={field.value === "Inactive"}
                        />
                        <label
                          htmlFor="radio_Inactive"
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
    </>
  );
};

export default VehicleInventoryTab;
