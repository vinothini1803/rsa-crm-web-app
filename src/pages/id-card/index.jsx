import React, { useRef, useState } from "react";
import "./card-style.less";
import {
  LogoBg,
  Phoneicn,
  ProfileImg,
  Star,
  UserImg,
  DialogCloseSmallIcon,
  WalletIcon,
  CreditCardIcon,
  StartLocation,
  EndLocation,
  VehicleLocationBlueMarker,
  VehicleLocationMarker,
  GoogleMapAPIKey,
  InfoDarkIcon,
  ASPLocationMarker,
  RefreshIcon,
  RedLocationMarker,
  LogoImage,
} from "../../utills/imgConstants";
import { useLocation,useNavigate} from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { getIdCard } from "../../../services/caseService";
import { Dialog } from "primereact/dialog";
import GoogleMapReact from "google-map-react";
import { getAspLiveLocation } from "../../../services/caseService";
import { Button } from "primereact/button";
import { toast } from "react-toastify";
// import "../live-location/style.less";
// import "./styles.less";

const index = () => {
  const [visible, setVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [bdLat, setBdLat] = useState();
  const [bdLng, setBdLng] = useState();
  const [aspLoc, setAspLoc] = useState("");
  const [dropLoc, setDropLoc] = useState(null);
  const [breakdownLoc, setBreakDownLoc] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  // const [data, setData] = useState([]);
  const paramValues = {
    token: queryParams.get("token"),
    id: queryParams.get("entityId"),
  };
  // const { mutate, isLoading } = useMutation(getAspLiveLocation);
  // const { data } = useQuery(["getIdCard"], () =>
  //   getIdCard({
  //     token: paramValues?.token,
  //     activityId: paramValues?.id,
  //   })
  // );
  const { data } = useQuery(["getAspLiveLocation"], () =>
    getAspLiveLocation({
      token: paramValues?.token,
      activityId: paramValues?.id,
    })
  );
  console.log("Data", data);
 const handleCall=()=>{
  window.location.href = `tel:${"+"+data?.data?.data.serviceProvider?.contactNumber}`;
 }
 const handleTrack=()=>{
  navigate(`/service-provider/live-location/?token=${paramValues?.token}&entityId=${paramValues?.id}`)
 }

  return (
    // <!-- Web Container to Center the Card -->
    <div className="my-2">
      <div className="row main ">
        <div className="col-lg-6 col-md-12 col-sm-12">
          {/* <!-- Card is applied only for web view (screens above 768px) --> */}
          <div>
            {/* <!-- Logo Section --> */}
            <div className="logo"></div>

            {/* <!-- Profile Section --> */}
            <div className="profile-sec">
              {data?.data?.data?.attachment ? (
                <img
                  src={data?.data?.data?.attachment ?.filePath}
                  alt="Technician Image"
                  className="profile-image"
                />
              ) : (
                <img
                  src={UserImg}
                  alt="Technician Image"
                  className="profile-image"
                />
              )}
              <div>
                <h5 style={{fontSize:"14px"}}>{data?.data?.data?.serviceProvider?.name}</h5>
                <p className="text-muted mb-0" style={{ color: "#949494" ,fontSize:"14px"}}>
                  {data?.data?.data?.serviceProvider?.code}
                  {/* · Technician */}
                </p>

                {/* <div className="rating-sec">
                  <img src={Star} />
                  <p className="rating mb-0">4.9</p>
                </div> */}
              </div>
            </div>

            {/* <!-- Contact Information --> */}
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mb-3 d-flex align-items-center gap-2 p-3">
              {/* <div className="phone-sec px-3 "> */}
                {/* <img src={Phoneicn} alt="phone-img" />
                <a
                  href="tel:+7305424918"
                  className="text-decoration-none"
                  style={{ color: "#0370F2" }}
                >
                  {data?.data?.data.serviceProvider?.contactNumber}
                </a> */}
                
                <Button className="btn-white w-100  flex justify-center items-center phone-sec" onClick={()=>handleCall()}>  Call ASP</Button>
           
              
                <Button className="p-button p-component w-100  flex justify-center items-center  phone-sec" onClick={()=>handleTrack()}>  Track ASP</Button>
             
            </div>

            {/* <hr /> */}

            {/* <!-- Enterprise Information --> */}
            {data?.data?.data?.serviceProvider?.workshopName ? (
              <div className="px-3">
                <h6>{data?.data?.data?.serviceProvider?.workshopName}</h6>
                {/* <p className="text-muted">
                Authorised Service Provider of AO Smith India Water Products Pvt
                Ltd
              </p> */}
              </div>
            ) : null}

            {/* <!-- Resource Information --> */}
            <div className="resource-info mx-3 mb-3">
              {/* <label>Resource ID:</label> */}
              {/* <p>ASP:TECH-0008445</p>
              <label>Resource Type:</label>
              <p>ASP Technician</p>
              <label>Location:</label>
              <p>9876543211</p> */}
              <label>Address:</label>
              <p>
                {data?.data?.data?.serviceProvider?.addressLineOne
                  ? data?.data?.data?.serviceProvider?.addressLineOne
                  : "--"}
              </p>
            </div>

            {/* <!-- Validity --> */}
            {/* <div className="validity mb-3 px-3">
              <p>Valid Up To: Nov 2024</p>
            </div> */}
          </div>
          {/* <hr></hr> */}
        </div>
      </div>
      {/* <div className="container"> */}
    
    </div>
  );
};

export default index;
