import React, { useEffect, useRef, useState } from "react";
import "../style.less";
import CaseInfoCard from "./CaseInfoCard";

import {
  DialogCloseSmallIcon,
  LocationPointIcon,
  PhoneGrayIcon,
} from "../../../utills/imgConstants";
import { Tooltip } from "primereact/tooltip";
import { OverlayPanel } from "primereact/overlaypanel";
import { useLocation } from "react-router";
import ASPCard from "../../../components/common/ASPCard";
import { Dialog } from "primereact/dialog";
import { Controller, useForm } from "react-hook-form";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import GoogleMapReact from "google-map-react";

const AspAssignment = () => {
  const [notifyPopup, setNotifyPopup] = useState(true);
  const [acceptVisible, setAcceptVisible] = useState(false);
  const [rejcetVisible, setRejectVisible] = useState(false);
  const [mapViewVisble, setMapViewVisible] = useState(false);
  const [mapLocationShow, setMapLocationShow] = useState(false);
  const { handleSubmit, control, getValues, formState, reset } = useForm();
  const { pathname } = useLocation();
  const ASPNote = () => (
    <div className="bg-gray">
      <div className="note-page-content">
        <div className="note-content-contanier">
          <div className="note-title">Note</div>
          <div className="note-content">
            Dial ASPs sequentially from the list, proceeding to the next ASP
            after the first one rejects the call.
          </div>
          <button
            className="bg-transparent  got-it-btn"
            onClick={() => setNotifyPopup(false)}
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
  const CardDetail = [
    {
      company_name: "TVS A.A Own Patrol",
      company_code: "OWDL46605",
      point: 4.5,
      status: "Available",
      location: "Madiwala Circle, Hosur",
      contact: ["9876543211", "8967543231"],
      kms: "4.5Kms",
      time: "10 mins",
      regional_manager_name: "Arun Kumar",
      zonal_manager_name: "Vignesh",
    },
    {
      company_name: "TVS A.A Own Patrol",
      company_code: "OWDL46605",
      point: 4.5,
      status: "Available",
      location: "Madiwala Circle, Hosur",
      contact: ["9876543211", "8967543231"],
      kms: "4.5Kms",
      time: "10 mins",
      regional_manager_name: "Arun Kumar",
      zonal_manager_name: "Vignesh",
    },
    {
      company_name: "TVS A.A Own Patrol",
      company_code: "OWDL46605",
      point: 4.5,
      status: "Available",
      location: "Madiwala Circle, Hosur",
      contact: ["9876543211", "8967543231"],
      kms: "4.5Kms",
      time: "10 mins",
      regional_manager_name: "Arun Kumar",
      zonal_manager_name: "Vignesh",
    },
  ];
  const handleFormSubmit = () => {};
  return (
    <div className="page-wrap bg-white">
      <div className="asp-page-body">
        <div className="asp-view-card">
          <div>
            <CaseInfoCard />
          </div>
          <div className="asp-card-container">
            <div className="row row-gap-3_4 h-100 ">
              <div className="col-md-6 border-right">
                <div className="asp-card-header">
                  <img
                    className="asp-title-icon"
                    src={LocationPointIcon}
                    alt="locaion_icon"
                  />

                  <h4 className="asp-card-title">Nearest ASP from Breakdown</h4>
                </div>
                {notifyPopup && <ASPNote />}
                <div className="asp-card-content">
                  {CardDetail?.map((data,i) => (
                    <div key={i}>
                      <ASPCard
                        companyName={data.company_name}
                        companyCode={data.company_code}
                        point={data.point}
                        status={data.status}
                        location={data.location}
                        distance={data.kms}
                        duration={data.time}
                        reginalManager={data.regional_manager_name}
                        zonalManager={data.zonal_manager_name}
                        contact={data.contact}
                        setTowingMapview={setMapViewVisible}
                        setAcceptVisible={setAcceptVisible}
                        setRejectVisible={setRejectVisible}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-md-6">
                {pathname !== "/cases/asp-mechanic" && (
                  <>
                    <div className="asp-card-header">
                      <img
                        className="asp-title-icon"
                        src={LocationPointIcon}
                        alt="locaion_icon"
                      />

                      <h4 className="asp-card-title">
                        Nearest ASP from Breakdown
                      </h4>
                    </div>
                    <div className="asp-card-content">
                      {CardDetail?.map((data,i) => (
                        <div key={i}>
                          <ASPCard
                            companyName={data.company_name}
                            companyCode={data.company_code}
                            point={data.point}
                            status={data.status}
                            location={data.location}
                            distance={data.kms}
                            duration={data.time}
                            reginalManager={data.regional_manager_name}
                            zonalManager={data.zonal_manager_name}
                            contact={data.contact}
                            setTowingMapview={setMapViewVisible}
                            setAcceptVisible={setAcceptVisible}
                            setRejectVisible={setRejectVisible}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title"> TVS A.A Own Patrol</div>
          </div>
        }
        visible={mapViewVisble}
        position={"bottom"}
        
        onHide={() => setMapViewVisible(false)}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
      >
        <div
          className="map-view-card"
          onClick={() =>
            mapLocationShow
              ? setMapLocationShow(false)
              : setMapLocationShow(true)
          }
        >
          {mapLocationShow && (
            <div className="map-card-content gap-4_5">
              <div>
                <span className="map-card-title">Total Travel KM</span>
                <div className="color-grey">
                  300 KM <span className="color-success">(In-limit)</span>
                </div>
              </div>

              <div>
                <span className="map-card-title">Basic</span>
                <div className="fnt-sbd">
                  ₹ 300/40 KM <span className="color-success">+ GST</span>
                </div>
              </div>
              <div>
                <span className="map-card-title">
                  Service Cost <span className="color-grey">(Approx)</span>{" "}
                </span>
                <div className="color-success">Free</div>
              </div>
            </div>
          )}
          {!mapLocationShow && (
            <div className="map-card-content gap-4_5">
              <div>
                <span className="map-card-title">Total Travel Km</span>
                <div className=" color-grey">
                  300 KM <span className="color-success">(Not-In-limit)</span>
                </div>
              </div>

              <div>
                <span className="map-card-title">Basic</span>
                <div className="fnt-sbd">
                  ₹ 300/40 KM <span className="color-success">+ GST</span>
                </div>
              </div>
              <div>
                <span className="map-card-title">Excess KM</span>
                <div className="color-grey">100 km</div>
              </div>
              <div>
                <span className="map-card-title">
                  Service Cost <span className="color-grey">(Approx)</span>{" "}
                </span>
                <div className="d-flex gap-3">
                  <div className="color-success">₹ 3000 - ₹ 5000 </div>
                  <div className="blue_text">Send Link</div>
                </div>
              </div>
            </div>
          )}
           <div className="map-container">
         
        </div>
        </div>
      </Dialog>
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title">
              {" "}
              {acceptVisible == true ? "ASP Accepted" : "ASP Rejected"}
            </div>
          </div>
        }
        visible={acceptVisible == true ? acceptVisible : rejcetVisible}
        position={"bottom"}
        onHide={() =>
          acceptVisible == true
            ? setAcceptVisible(false)
            : setRejectVisible(false)
        }
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
      >
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="row row-gap-3_4">
            {acceptVisible == true && (
              <>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Start time</label>
                    <Controller
                      name="start_time"
                      control={control}
                      rules={{ required: "Input is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Calendar
                            inputId={field.name}
                            value={field.value}
                            onChange={field.onChange}
                            timeOnly
                            icon={<img src={PhoneGrayIcon} />}
                            hourFormat="12"
                            placeholder="Select Start Time"
                          />
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Reach time</label>
                    <Controller
                      name="reachtime"
                      control={control}
                      rules={{ required: "Input is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Calendar
                            inputId={field.name}
                            value={field.value}
                            onChange={field.onChange}
                            timeOnly
                            icon={<img src={PhoneGrayIcon} />}
                            hourFormat="12"
                            placeholder="Select Reach Time"
                          />
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <label className="form-label">Comments</label>
                    <Controller
                      name="comments"
                      control={control}
                      render={({ field, fieldState }) => (
                        <InputTextarea
                          autoResize
                          {...field}
                          placeholder="Comments"
                          rows={5}
                          cols={30}
                        />
                      )}
                    />
                  </div>
                </div>
              </>
            )}
            {rejcetVisible == true && (
              <>
                <div className="col-md-12">
                  <div className="form-group">
                    <label className="form-label">Reject Reason</label>
                    <Controller
                      name="reject_reason"
                      control={control}
                      rules={{ required: "Input is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            placeholder="Select"
                            options={[
                              { label: "status1", value: "status1" },
                              { label: "status2", value: "status2" },
                            ]}
                            optionLabel="label"
                            onChange={(e) => field.onChange(e.value)}
                          />
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <label className="form-label">Comments</label>
                    <Controller
                      name="comments"
                      control={control}
                      render={({ field, fieldState }) => (
                        <InputTextarea
                          autoResize
                          {...field}
                          placeholder="Comments"
                          rows={5}
                          cols={30}
                        />
                      )}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          <button className="btn form-submit-btn" type="submit">
            Confirm
          </button>
        </form>
      </Dialog>
    </div>
  );
};

export default AspAssignment;
