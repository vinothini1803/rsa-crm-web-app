import React, { useState } from "react";
import "../style.less";
import {
  CloseIcon,
  DialogCloseSmallIcon,
  KMStoneIcon,
  SpannerImage,
} from "../../../utills/imgConstants";
import Filters from "../../../components/common/Filters";
import { Checkbox } from "primereact/checkbox";
import Note from "../../../components/common/Note";
import { Dialog } from "primereact/dialog";
import { Controller, useForm } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useLocation, useNavigate } from "react-router";
const CaseInfoCard = () => {
  const [filters, setFilters] = useState(null);
  const navigate = useNavigate();
  const [dropLocationForm, setDropLocationForm] = useState(false);
  const [checked, setChecked] = useState(false);
  const { pathname } = useLocation();
  console.log(pathname);
  const { handleSubmit, control, getValues, formState, reset } = useForm();

  const handleFilter = () => {};
  const handleClearFilter = () => {};
  const handleClose = () => {
    navigate("/cases")
  };
  const handleFormSubmit = () => {};
  const filterData = {
    distance: [
      {
        name: 1,
        label: "Nearest Asp to Breakdown Location",
      },
      {
        name: 2,
        label: "Nearest Asp to Drop Location",
      },
    ],
    
  };
  return (
    <>
      <div className="asp-case-info-card">
        <div className="row row-gap-3_4 h-100 mb-2_3">
          <div className="col-md-6 border-right">
            <div className="asp-case-info-header">
              <h4 className="asp-case-title">Case Info</h4>
              <span className="asp-case-sub"> - F23COROTRPC00283</span>
            </div>
            <div className="asp-case-detail">
              <div className="asp-case-name">
                <img src={SpannerImage} alt="spanner_icon" />
                <span>Mechanical - Battery Jump-Start </span>
              </div>
              <div className="asp-case-name">
                <img src={KMStoneIcon} alt={"milestone-icon"} />
                <span>34 KM to BD</span>
              </div>
            </div>
            <div className="asp-case-filter">
              <div className="asp-case-filter-left">
                <Filters
                  onFilterApply={handleFilter}
                  filters={filters}
                  filterFields={{
                    filterFields: ["Distance", "ASP"],
                    filterData:filterData
                  }}
                />
                <div className="d-flex gap-2">
                  <Checkbox
                    onChange={(e) => setChecked(e.checked)}
                    checked={checked}
                  ></Checkbox>
                  <label>Include 3rd party ASP</label>
                </div>
              </div>
              <span
                className="asp-case-filter-right"
                onClick={handleClearFilter}
              >
                Clear Filter
              </span>
            </div>
          </div>
          <div className="col-md-6">
            <div className="asp-location-header">
              <h4 className="asp-location-title">Location Details</h4>
              <button className="btn btn-close" onClick={handleClose}>
                <img className="img-fluid" src={CloseIcon} alt="Close" />
              </button>
            </div>
            <div className="asp-location-content">
              <div>
                <h4 className="asp-location-content-title">
                  Breakdown Location
                </h4>
                <div className="d-flex gap-3">
                  <p className="asp-location-content-text">
                    96, Ranganath, Extension, Gopal Gowda, Shivamogga,
                    Karnataka.
                  </p>
                  <div
                    className="blue_text"
                    onClick={() => setDropLocationForm(true)}
                  >
                    Edit
                  </div>
                </div>
              </div>
              {pathname !== "/cases/asp-mechanic" && (
                <div>
                  <h4 className="asp-location-content-title">Drop Location</h4>
                  <div className="d-flex gap-3">
                    <p className="asp-location-content-text">
                      {" "}
                      ARK Automobiles, Madiwala Circle, Karnataka.
                    </p>
                    <div
                      className="blue_text"
                      onClick={() => setDropLocationForm(true)}
                    >
                      Edit
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <Note type={"info"} icon={true} purpose={"note"}>
          <div>
            Comparison of ASP’s based on distance, travel time and many more
            parameters. Comparison between ASP’s have been carried out to help
            you identify to make best decision for selecting the nearest ASP.
          </div>
        </Note>
      </div>
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title"> Edit Drop Location</div>
          </div>
        }
        visible={dropLocationForm}
        position={"bottom"}
        onHide={() => setDropLocationForm(false)}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
      >
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="row row-gap-3_4">
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">Reason</label>
                <Controller
                  name="reason"
                  control={control}
                  render={({ field, fieldState }) => (
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
                  )}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">Drop Location Type</label>
                <Controller
                  name="drop_location_type"
                  control={control}
                  render={({ field, fieldState }) => (
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
                  )}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">
                  Customer Preferred Location
                </label>
                <Controller
                  name="customer_preferred_location"
                  control={control}
                  render={({ field, fieldState }) => (
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
                  )}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">Dealers</label>
                <Controller
                  name="dealers"
                  control={control}
                  render={({ field, fieldState }) => (
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
                  )}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">Drop Latitude & longitude</label>
                <Controller
                  name="modelName"
                  control={control}
                  render={({ field, fieldState }) => (
                    <InputText autoResize {...field} placeholder="Comments" />
                  )}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">
                  Garage to Breakdown Distance
                </label>
                <Controller
                  name="garge_breakdow_distance"
                  control={control}
                  render={({ field, fieldState }) => (
                    <InputText autoResize {...field} placeholder="Comments" />
                  )}
                />
              </div>
            </div>
          </div>
          <button className="btn form-submit-btn" type="submit">
            Confirm
          </button>
        </form>
      </Dialog>
    </>
  );
};

export default CaseInfoCard;
