import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import CustomBreadCrumb from "../../../components/common/CustomBreadCrumb";
import { CloseIcon, hierarchyIcon } from "../../../utills/imgConstants";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { TabMenu } from "primereact/tabmenu";
import "./style.less";
import { TabPanel, TabView } from "primereact/tabview";
import CustomAccordion from "./CustomAccordion";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "react-query";
import { getAllPermissions, saveRole } from "../../../../services/roleService";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { NavLink } from "react-router-dom";

const AddRoles = () => {
  const navigate = useNavigate();

  const [activeIndex, setActiveIndex] = useState(0);
  const { roleId } = useParams();
  // console.log("roleId", roleId);
  const methods = useForm();
  const [permissionIds, setpermissionIds] = useState([]);
  const [mobilePermissionIds, setMobilePermissionIds] = useState([]);
  const statusList = [
    {
      status: "Active",
      label: "Active",
      id: 1,
    },
    {
      status: "InActive",
      label: "Inactive",
      id: 0,
    },
  ];

  const { data } = useQuery(
    ["permissionslist"],
    () =>
      getAllPermissions({
        roleId: roleId ? roleId : "",
      }),

    {
      refetchOnWindowFocus: false,
      onSuccess: (res) => {
        if (res?.data?.success) {
          if (roleId) {
            const flatted = (array) => {
              return array?.reduce((acc, el) => {
                return acc?.concat(
                  el.id,
                  el.child || el.subChild
                    ? flatted(el.child || el.subChild)
                    : []
                );
              }, []);
            };

            // console.log("flated web", flatted(res?.data?.data?.web));
            setpermissionIds(
              res?.data?.data?.selectedPermissionIds?.filter((id) =>
                flatted(res?.data?.data?.web).some((el) => el == id)
              )
            );

            setMobilePermissionIds(
              res?.data?.data?.selectedPermissionIds?.filter((id) =>
                flatted(res?.data?.data?.mobile).some((el) => el == id)
              )
            );
            delete res?.data?.data?.role?.id;
            if (res?.data?.data?.role) {
              Object.entries(res?.data?.data?.role)?.forEach((el) => {
                if (el[0] == "status") {
                  return methods?.setValue(
                    el[0],
                    statusList?.find((status) => status.id == el[1])
                  );
                }
                return methods?.setValue(el[0], el[1]);
              });
            }
          }
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
  const { mutate, isLoading } = useMutation(saveRole);

  // console.log("permissionids", permissionIds);

  // console.log("permissionslist data", data);
  const errors = methods.formState.errors;
  // console.log("errors", errors);
  const MenuItems = [
    {
      label: <div onClick={() => navigate("/admin/roles")}>Roles</div>,
    },
    { label: <div>{roleId ? "Edit" : "Add"} Role</div> },
  ];

  const handleClose = () => {
    navigate("/admin/roles");
    methods.reset();
  };
  const items = [
    {
      label: "Web",
    },
    {
      label: "Mobile",
    },
  ];
  // console.log("updated permissionIds", permissionIds);
  const handleAddRole = (data) => {
    // console.log("roledata", data);
    mutate(
      {
        ...data,
        permissionIds: [...permissionIds, ...mobilePermissionIds],
        roleId: roleId ? roleId : "",
        status: data?.status?.id,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            navigate("/admin/roles");
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
    // if (data) {
    //   toast.success("Added Successfully", {
    //     autoClose: 1000,
    //   });
    //   // navigate("/admin/roles");

    //   methods.reset();
    // }
  };
  const handleSearch = (e) => {
    // console.log("search value", e.target.value);
  };

  const handleWebSelection = (ids) => {
    // console.log("web ids", ids);
    setpermissionIds(ids);
  };
  const handleMobileSelection = (ids) => {
    setMobilePermissionIds(ids);
  };

  return (
    <div className="page-wrap">
      <CustomBreadCrumb items={MenuItems} milestone={false} />
      <div className="page-body">
        <div className="page-content-wrap form-page">
          <div className="page-content-header">
            <div className="d-flex align-items-center justify-content-between">
              <div className="page-content-title-wrap">
                <div className="page-content-title-icon">
                  <img
                    className="img-fluid"
                    src={hierarchyIcon}
                    alt="Title Icon"
                  />
                </div>
                <div>
                  <h5 className="page-content-title">
                    {roleId ? "Edit" : "Add"} Role
                  </h5>
                </div>
              </div>
              <div className="page-content-header-right">
                <button className="btn btn-close" onClick={handleClose}>
                  <img className="img-fluid" src={CloseIcon} alt="Close" />
                </button>
              </div>
            </div>
          </div>
          <div className="page-content-body">
            <form
              id="permission-form"
              onSubmit={methods.handleSubmit(handleAddRole)}
            >
              <div className="row row-gap-3_4">
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <Controller
                      name="name"
                      control={methods.control}
                      rules={{ required: "Name is required." }}
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
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">Display Name</label>
                    <Controller
                      name="displayName"
                      control={methods.control}
                      rules={{ required: "Display Name is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            {...field}
                            placeholder="Enter Display Name"
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
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <Controller
                      name="description"
                      control={methods.control}
                      rules={{ required: "description is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputTextarea
                            {...field}
                            placeholder="Enter Description"
                            pt={{
                              root: {
                                rows: 1,
                                cols: 30,
                              },
                            }}
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

                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">
                      ASP & Sales Portal Role Name
                    </label>
                    <Controller
                      name="aspRoleName"
                      control={methods.control}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText {...field} placeholder="Enter Role Name" />
                        </>
                      )}
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label filter-label">Status</label>
                    <Controller
                      name="status"
                      control={methods.control}
                      rules={{ required: "Status is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            id={field.name}
                            value={field.value}
                            className="form-control-select"
                            optionLabel="label"
                            placeholder="Select a status"
                            onChange={(e) => field.onChange(e.value)}
                            options={statusList}
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
              <div className="role-permission">
                <h4 className="role-permission-title">
                  Permissions for this role
                </h4>
                <h4 className="role-permission-subtitle">
                  Choose who can access
                </h4>
              </div>
              <div className="role-permission-tab">
                <TabMenu
                  model={items}
                  activeIndex={activeIndex}
                  onTabChange={(e) => {
                    setActiveIndex(e.index);
                  }}
                  className="spearate-tab-menu tab-bg-grey"
                />
                <TabView
                  activeIndex={activeIndex}
                  onTabChange={(e) => {
                    setActiveIndex(e.index);
                  }}
                  className="tab-header-hidden dealer-tabview"
                >
                  <TabPanel>
                    <div className="tab-container column-gap-3_4">
                      <div className="col-md-4">
                        <CustomAccordion
                          value={data?.data?.data?.web}
                          onSelectionChange={handleWebSelection}
                          selectedIds={permissionIds}
                        />
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div className="tab-container column-gap-3_4">
                      <div className="col-md-4">
                        <CustomAccordion
                          value={data?.data?.data?.mobile}
                          onSelectionChange={handleMobileSelection}
                          selectedIds={mobilePermissionIds}
                        />
                      </div>
                    </div>
                  </TabPanel>
                </TabView>
              </div>
            </form>
          </div>
          <div className="page-content-footer">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex gap-2 ms-auto">
                <Button
                  className="btn btn-primary"
                  form="permission-form"
                  loading={isLoading}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRoles;
