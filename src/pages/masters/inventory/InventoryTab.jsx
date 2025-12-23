import React, { useState } from "react";

import { useNavigate } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { Dialog } from "primereact/dialog";
import { DialogCloseSmallIcon } from "../../../utills/imgConstants";
import { InputText } from "primereact/inputtext";
import TableWrapper from "../../../components/common/TableWrapper/TableWrapper";
import { toast } from "react-toastify";


const InventoryTab = () => {
 
  const [visible, setVisible] = useState(false);
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const defaultValues = {
    item_name: ""
  }
  const { handleSubmit, control, getValues, formState: {errors}, reset } = useForm({defaultValues});
  const columns = [
    { title: "Inventory Items", field: "inventory_items" },
   
  ];


  const data = Array.from({ length: 22 }, (e, i) => {
    return {
      id: i,
      inventory_items: "Vehicle Manual"
    };
  });
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
  const handleAdd = () => {
    setVisible(true)
  };
  const handlepageChange = (offset, limit) => {
    console.log("offset", offset, limit);
    setPagination({
      offset: offset,
      limit: limit,
    });
  }
  return (
    <>
    <TableWrapper
      title={"Inventory"}
      columns={columns}
      data={data}
      rowSelection
      addbtn={{label: "create" ,onClick:handleAdd}}
      className="tab-page"
      totalRecords={data.length}
      onPaginationChange={handlepageChange}
      action={false}
    />
     <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title">Add Inventory</div>
          </div>
        }
        className="w-372"
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
                <label className="form-label">Item Name</label>
                <Controller
                  name="item_name"
                  control={control}
                  rules={{ required: "Item Name is required." ,
                    }}
                  render={({ field, fieldState }) => (
                    <>
                    <InputText
                      type="text"
                      placeholder="Enter Item Name"
                      {...field}
                      
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
      
          </div>
          <button className="btn form-submit-btn" type="submit">
            Save
          </button>
        </form>
      </Dialog>
    </>
  );
};

export default InventoryTab;
