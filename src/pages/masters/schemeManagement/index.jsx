import React, { useState } from "react";
import TableWrapper from "../../../components/common/TableWrapper/TableWrapper";
import { Dialog } from "primereact/dialog";
import { DialogCloseSmallIcon } from "../../../utills/imgConstants";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { toast } from "react-toastify";

const SchemeManagement = () => {
  const [visible, setVisible] = useState(false);
  const defaultValues = {
    scheme: "",
  };
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const { handleSubmit, control, getValues, formState: { errors }, reset } = useForm({defaultValues});

  const columns = [{ title: "Scheme Name", field: "scheme_name" }];

  const data = [
    { scheme_name: "OEM" },
    { scheme_name: "Dealer" },
    { scheme_name: "OEM" },
    { scheme_name: "Dealer" },
    { scheme_name: "OEM" },
    { scheme_name: "Dealer" },
    { scheme_name: "OEM" },
    { scheme_name: "Dealer" },
    { scheme_name: "OEM" },
    { scheme_name: "Dealer" },
    { scheme_name: "OEM" },
    { scheme_name: "Dealer" },

    { scheme_name: "OEM" },
    { scheme_name: "Dealer" },
    { scheme_name: "OEM" },
    { scheme_name: "Dealer" },
  ];
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
          title={"Scheme Management"}
          rowSelection
          columns={columns}
          data={data}
          action={false}
          totalRecords={data.length}
          onPaginationChange={handlepageChange}
          addbtn={{ onClick: handleAdd }}
        />
      </div>
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title">Add Scheme</div>
          </div>
        }
        className="w-460"
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
                <label className="form-label">Scheme</label>
                <Controller
                  name="scheme"
                  rules={{ required: "Scheme is required." }}
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                    <Dropdown
                      value={field.value}
                      placeholder="Select Scheme"
                      options={[
                        { label: "OEM", value: "OEM" },
                        { label: "Dealer", value: "Dealer" },
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
          </div>
          <button className="btn form-submit-btn" type="submit">
            Save
          </button>
        </form>
      </Dialog>
    </div>
  );
};

export default SchemeManagement;
