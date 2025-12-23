import React, { useRef, useState } from "react";
import { useQuery, useMutation } from "react-query";
import { Dialog } from "primereact/dialog";
import GoogleMapReact from "google-map-react";
import { useLocation, useNavigate } from "react-router-dom";

import {
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
  EmptyLocationImage,
} from "../../utills/imgConstants";
import { getAspLiveLocation } from "../../../services/caseService";
import { Button } from "primereact/button";
import { toast } from "react-toastify";
import "./styles.less";

const index = () => {
  const [visible, setVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [bdLat, setBdLat] = useState();
  const [bdLng, setBdLng] = useState();
  const [aspLoc, setAspLoc] = useState("");
  const [dropLoc, setDropLoc] = useState(null);
  const [breakdownLoc, setBreakDownLoc] = useState("");
  const [linkExpired, setLinkExpired] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const paramValues = {
    token: queryParams.get("token"),
    id: queryParams.get("entityId"),
  };
  const { mutate, isLoading, data } = useMutation(getAspLiveLocation);
  const infoWindowRef = useRef(null);
  const handleApiLoaded = (map, maps) => {
    let openInfoWindow = null; // Track the currently open InfoWindow

    mutate(
      {
        activityId: paramValues?.id,
        token: paramValues?.token,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            console.log("res?.data?.data", res?.data?.data);
            const aspLiveLocation = {
              lat: Number(res?.data?.data?.trackLinkResponse?.liveLocationLat),
              lng: Number(res?.data?.data?.trackLinkResponse?.liveLocationLong),
            };
            const breakdownLocation = {
              lat: Number(res?.data?.data?.trackLinkResponse?.bdLat),
              lng: Number(res?.data?.data?.trackLinkResponse?.bdLong),
            };
            const dropLocation = res?.data?.data?.trackLinkResponse?.dropLat
              ? {
                  lat: Number(res?.data?.data?.trackLinkResponse?.dropLat),
                  lng: Number(res?.data?.data?.trackLinkResponse?.dropLong),
                }
              : null;
            const aspLocation = {
              lat: Number(res?.data?.data?.trackLinkResponse?.aspLocationLat),
              lng: Number(res?.data?.data?.trackLinkResponse?.aspLocationLong),
            };

            // Set state
            setBdLat(res?.data?.data?.trackLinkResponse?.bdLat);
            setBdLng(res?.data?.data?.trackLinkResponse?.bdLong);
            setAspLoc(res?.data?.data?.trackLinkResponse?.aspLocation);
            setDropLoc(
              res?.data?.data?.trackLinkResponse?.dropLocation || "N/A"
            );
            setBreakDownLoc(res?.data?.data?.trackLinkResponse?.bdLocation);

            // Create markers and info popups with location names
            const createMarkerWithInfo = (
              position,
              title,
              locationName,
              icon
            ) => {
              const marker = new google.maps.Marker({
                position,
                map,
                title,
                icon,
              });

              const infoWindow = new google.maps.InfoWindow({
                content: `<div class="asp-location">
                              <div class="location-title">${title}</div>
                              <div class="location-detail">${
                                locationName || "Location not provided."
                              }</div>
                            </div>`,
              });

              marker.addListener("click", () => {
                if (openInfoWindow) {
                  openInfoWindow.close(); // Close the previously open InfoWindow
                }
                infoWindow.open(map, marker);
                openInfoWindow = infoWindow; // Update the reference to the currently open InfoWindow
              });

              return marker;
            };

            // Add markers with InfoWindows
            createMarkerWithInfo(
              aspLiveLocation,
              "ASP Live Location",
              "ASP Current Location",
              RedLocationMarker
            );

            createMarkerWithInfo(
              breakdownLocation,
              "Breakdown Location",

              res?.data?.data?.trackLinkResponse?.bdLocation,
              VehicleLocationBlueMarker
            );

            createMarkerWithInfo(
              aspLocation,
              "ASP Location",

              res?.data?.data?.trackLinkResponse?.aspLocation,
              StartLocation
            );

            if (dropLocation) {
              createMarkerWithInfo(
                dropLocation,
                "Drop Location",

                res?.data?.data?.trackLinkResponse?.dropLocation,
                EndLocation
              );
            }
            // Close info window when clicking outside
            google.maps.event.addListener(map, "click", () => {
              if (openInfoWindow) {
                openInfoWindow.close();
                openInfoWindow = null; // Reset the reference
              }
            });
            // Define directions request only with available locations
            const waypoints = dropLocation
              ? [{ location: breakdownLocation, stopover: true }]
              : [];

            const request = {
              origin: aspLocation,
              destination: dropLocation || breakdownLocation,
              waypoints,
              travelMode: "DRIVING",
            };

            const directionsService = new google.maps.DirectionsService();
            directionsService?.route(request, (response, status) => {
              if (status === "OK") {
                const directionsRenderer = new google.maps.DirectionsRenderer({
                  directions: response,
                  suppressMarkers: true,
                  polylineOptions: {
                    strokeOpacity: 0.8,
                    strokeWeight: 3,
                  },
                });
                directionsRenderer.setMap(map);
              } else {
                console.error("Error fetching directions:", status);
              }
            });
          } else {
            if (res?.data?.error) {
              setLinkExpired(res?.data?.error);
              toast.error(res?.data?.error);
            } else {
              res?.data?.errors?.forEach((el) => toast.error(el));
            }
          }
        },
      }
    );
  };
  const handleViewCard = () => {
    navigate(
      `/service-provider/id-card/?token=${paramValues?.token}&entityId=${paramValues?.id}`
    );
  };
  const ExpiredEle = () => (
    <>
      <div
        className="roadlocation-body-empty"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <img src={EmptyLocationImage} alt="Empty Location" />
      </div>
      <h5 className="text-center">Sorry, This Link Has Expired.</h5>
      <p className="roadlocation-body-content">
        If you need access to specific information, please reach out to the
        individual who shared the link for updated access.
      </p>
    </>
  );
  return (
    // <>
    //   <div class="container">
    //     <header>
    //       <img className="img-fluid" src={LogoImage} alt="logo" />
    //       <div>
    //         <h1>ASP Tracking</h1>
    //         <div className="d-flex align-items-center justify-content-between view-details">
    //           <button
    //             className="btn-link btn-text"
    //             onClick={() => setVisible(true)}
    //           >
    //             {" "}
    //             View Details
    //           </button>
    //         </div>
    //       </div>
    //     </header>
    //     <div className="d-flex justify-content-end">
    //       {" "}
    //       <Button
    //         onClick={() => {
    //           setRefresh(!refresh);
    //         }}
    //       >
    //         {/* <img src={RefreshIcon} /> */}
    //         Refresh Now
    //       </Button>
    //     </div>
    //     <div class="content">
    //       <div class="map-container">
    //         <GoogleMapReact
    //           key={refresh}
    //           // defaultCenter={{ lat: 59.95, lng: 30.33 }}
    //           defaultCenter={
    //             bdLat && bdLng
    //               ? {
    //                   lat: Number(bdLat),
    //                   lng: Number(bdLng),
    //                 }
    //               : { lat: 20.5937, lng: 78.9629 }
    //           }
    //           defaultZoom={12}
    //           bootstrapURLKeys={{
    //             key: GoogleMapAPIKey,
    //           }}
    //           center={
    //             bdLat && bdLng
    //               ? {
    //                   lat: Number(bdLat),
    //                   lng: Number(bdLng),
    //                 }
    //               : { lat: 20.5937, lng: 78.9629 }
    //           }
    //           yesIWantToUseGoogleMapApiInternals
    //           onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
    //         ></GoogleMapReact>
    //       </div>
    //       <div className="details-container">
    //       <div className="details-card">
    //         {/* ASP Current Location */}
    //         <div className="current-location mb-2">
    //           <h2 className="section-title">ASP  Location:</h2>
    //           <p className="location-text"  style={{ maxWidth: "282px", margin: "0 auto", textAlign: "justify" }}>
    //           {aspLoc}
    //           </p>
    //         </div>

    //           {/* Breakdown & Drop Location */}
    //           <div className="breakdown-details">
    //           {/* <h2 className="section-title">Breakdown & Drop Location Details</h2> */}
    //           <div className="location-item">
    //             {/* <span className="marker pickup"></span> */}
    //             <div>
    //               {/* <h3 className="location-title">Breakdown Location</h3> */}
    //               <h3 className="section-title">Breakdown Location:</h3>
    //               <p className="location-text"  style={{ maxWidth: "282px", margin: "0 auto", textAlign: "justify" }}>
    //               {breakdownLoc}
    //               </p>
    //             </div>
    //           </div>
    //     </div>
    //     {dropLoc !=null &&<div className="location-item">
    //             {/* <span className="marker drop"></span> */}
    //             <div>
    //               {/* <h3 className="location-title">Drop Location</h3> */}
    //               <h3 className="section-title">Drop Location:</h3>
    //               <p className="location-text"  style={{ maxWidth: "282px", margin: "0 auto", textAlign: "justify" }}>
    //               {dropLoc}
    //               </p>
    //             </div>
    //           </div>}
    //           </div>
    //     </div>
    //     </div>

    //   </div>

    //   {/* //<div className="map-container mt-3_4">
    // //<Button
    // //     onClick={() => {
    // //       setRefresh(!refresh);
    // //     }}
    // //   >
    // //     <img src={RefreshIcon} />
    // //   </Button> */}

    //   <Dialog
    //     header="Details"
    //     visible={visible}
    //     className="custom-dialog responsive-dialog"
    //     onHide={() => setVisible(false)}
    //     draggable={false}
    //     resizable={false}
    //     closeOnEscape
    //   >
    //     <div className="dialog-wrap">
    //       <h2>ASP  Location:</h2>
    //       <p>
    //         {aspLoc}
    //       </p>
    //       <h2>Breakdown Location:</h2>
    //       <p>
    //       {breakdownLoc}
    //       </p>
    //       <h2>Drop Location:
    //       </h2>
    //       <p>{dropLoc}</p>
    //       {/* <ul>
    //         <li>
    //           <strong>Pickup Location:</strong> {breakdownLoc}
    //         </li>
    //         <li>
    //           <strong>Drop Location:</strong>{dropLoc}
    //         </li>
    //       </ul> */}
    //     </div>
    //   </Dialog>
    // </>
    <div className="my-4">
      <div className="row main">
        {linkExpired != null || linkExpired == "The link has been expired" ? (
          <ExpiredEle />
        ) : (
          <div className="col-lg-6 col-md-8 col-sm-12">
            <header className="col-md-12 d-flex align-items-center justify-content-between">
              {/* Left Section: Logo & ASP Tracking */}
              <div className="d-flex align-items-center gap-2">
                <img className="img-fluid" src={LogoImage} alt="logo" />
                <h1 className="m-0">ASP Tracking</h1>{" "}
                {/* Ensure no extra margin */}
              </div>

              {/* Right Section: Refresh Button */}
              <button
                className="btn-link btn-text d-flex align-items-center gap-1"
                onClick={() => setRefresh(!refresh)}
                style={{ color: "#0370F2" }}
              >
                <img src={RefreshIcon} alt="Refresh" />
                Refresh
              </button>
            </header>

            <div class="content">
              <div class="map-container">
                <GoogleMapReact
                  key={refresh}
                  // defaultCenter={{ lat: 59.95, lng: 30.33 }}
                  defaultCenter={
                    bdLat && bdLng
                      ? {
                          lat: Number(bdLat),
                          lng: Number(bdLng),
                        }
                      : { lat: 20.5937, lng: 78.9629 }
                  }
                  defaultZoom={12}
                  bootstrapURLKeys={{
                    key: GoogleMapAPIKey,
                  }}
                  center={
                    bdLat && bdLng
                      ? {
                          lat: Number(bdLat),
                          lng: Number(bdLng),
                        }
                      : { lat: 20.5937, lng: 78.9629 }
                  }
                  yesIWantToUseGoogleMapApiInternals
                  onGoogleApiLoaded={({ map, maps }) =>
                    handleApiLoaded(map, maps)
                  }
                ></GoogleMapReact>
              </div>
              <div className="d-flex align-items-center justify-content-between m-0">
                <div>
                  <label className="section-title" style={{ color: "#333" }}>
                    Distance:{" "}
                  </label>
                  <span className="distance-text">
                    { data?.data?.data?.trackLinkResponse?.distance
                      ? " " +data?.data?.data?.trackLinkResponse?.distance
                      :" " + "-"}
                  </span>
                </div>
                <div>
                  <label className="section-title" style={{ color: "#333" }}>
                    ETA:{" "}
                  </label>
                  <span className="distance-text">
                    {data?.data?.data?.trackLinkResponse?.duration
                      ? " " + data?.data?.data?.trackLinkResponse?.duration
                      : " " + "-"}
                  </span>
                </div>
                <div></div>
              </div>
              <hr className="m-0" />
              <h6>
                {dropLoc != null
                  ? "Breakdown & Drop Location Details"
                  : "Breakdown Location Details"}
              </h6>
              <div className="details-container">
                <div className="details-card">
                  {/* Breakdown & Drop Location */}
                  <div className="breakdown-details">
                    <div className="location-item">
                      <div className="marker-container">
                        <span className="marker pickup"></span>
                        {dropLoc != null && <div className="line"></div>}
                      </div>
                      <div>
                        <h3 className="loc-title"> Breakdown Location:</h3>
                        <p className="location-text">{breakdownLoc}</p>
                      </div>
                    </div>

                    {dropLoc != null && (
                      <div className="location-item">
                        <div className="marker-container">
                          <span className="marker drop"></span>
                        </div>
                        <div>
                          <h3 className="loc-title">Drop Location:</h3>
                          <p className="location-text">{dropLoc}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Button
                className="p-button p-component w-100 view-card-btn "
                onClick={() => handleViewCard()}
                style={{ fontSize: "14px" }}
              >
                View ID Card
              </Button>
            </div>
          </div>
        )}
        <Dialog
          header="Details"
          visible={visible}
          className="custom-dialog responsive-dialog"
          onHide={() => setVisible(false)}
          draggable={false}
          resizable={false}
          closeOnEscape
        >
          <div className="dialog-wrap">
            <h2>ASP Location:</h2>
            <p>{aspLoc}</p>
            <h2>Breakdown Location:</h2>
            <p>{breakdownLoc}</p>
            <h2>Drop Location:</h2>
            <p>{dropLoc}</p>
            <h2>Distance</h2>
            <p>{data?.trackLinkResponse?.distanceToReachBd}</p>
            <h2>ETA</h2>
            <p>{data?.trackLinkResponse?.durationToReachBd}</p>

            {/* <ul>
                     <li>
                       <strong>Pickup Location:</strong> {breakdownLoc}
                     </li>
                     <li>
                       <strong>Drop Location:</strong>{dropLoc}
                     </li>
                   </ul> */}
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default index;
