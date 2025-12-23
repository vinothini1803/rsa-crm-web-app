import React, { useCallback, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import GoogleMapReact from "google-map-react";
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
} from "../../utills/imgConstants";
import { mappls, mappls_plugin } from "mappls-web-maps";

import { OverlayPanel } from "primereact/overlaypanel";
import { Controller, useForm } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { RadioButton } from "primereact/radiobutton";
import { useMutation, useQueries, useQuery } from "react-query";
import { paymentMethod } from "../../../services/masterServices";
import { Button } from "primereact/button";
import {
  acceptAndPay,
  getLiveLocation,
  makePayment,
  walletBalance,
} from "../../../services/deliveryRequestViewService";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { CurrentUser } from "../../../store/slices/userSlice";
import TravelledKM from "../../components/common/TravelledKM";
import { serviceDeatils } from "../../../services/assignServiceProvider";
const ServiceViewTowingDialog = ({
  visible,
  setVisible,
  activityId,
  aspId,
  aspName,
  locationDetails,
}) => {
  const [refresh, setRefresh] = useState(false);
  const { mutate, isLoading, data } = useMutation(getLiveLocation);

  const mapLocation = {
    pickupLocation: {
      lat: Number(locationDetails?.pickupDealer?.lat),
      lng: Number(locationDetails?.pickupDealer?.long),
    },
    dropLocation: {
      lat: Number(locationDetails?.dropDealer?.lat),
      lng: Number(locationDetails?.dropDealer?.long),
    },
    aspLocation: {
      lat: Number(locationDetails?.asp?.lat),
      lng: Number(locationDetails?.asp?.long),
    },
  };
  // console.log("change", locationDetails?.pickupDealer?.location);
  //Map styling
  const handleApiLoaded = (map, maps) => {
    mutate(
      {
        activityId: activityId,
        aspId: aspId,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            // console.log(
            //   "asp live location",
            //   {
            //     lat: Number(res?.data?.data?.latitude),
            //     lng: Number(res?.data?.data?.longitude),
            //   },
            //   "mapLocation",
            //   mapLocation
            // );
            const aspLiveLocation = {
              lat: Number(res?.data?.data?.recentLiveLocation?.latitude),
              lng: Number(res?.data?.data?.recentLiveLocation?.longitude),
            };
            // Create a new DirectionsService
            const AspLiveMarker = new google.maps.Marker({
              position: aspLiveLocation, // ASP LIVE Location
              map,
              title: "ASP Live Location",
              icon: RedLocationMarker, // Replace with your icon URL
            });
            const directionsService = new google.maps.DirectionsService();

            const origin = mapLocation?.aspLocation; // Replace with your starting location
            const destination = mapLocation?.dropLocation; // Replace with your destination
            const waypoints = [
              {
                location: mapLocation?.pickupLocation,
                stopover: true,
              },
            ]; // Add waypoints if needed

            // Define your directions request
            const request = {
              origin,
              destination,
              waypoints,
              travelMode: "DRIVING", // You can change the mode to WALKING, BICYCLING, or TRANSIT
            };
            // console.log("location", locationDetails?.pickupDealer);
            // Request directions
            directionsService?.route(request, (response, status) => {
              // console.log("mapResponse=>", response);
              const startInfoWindow = new google.maps.InfoWindow();
              if (status == "OK") {
                //Create Marker
                const PickupWindow = new google.maps.InfoWindow({
                  content: `<div class="asp-location"><div class="location-title">Pickup Location</div><div class="location-detail">${locationDetails?.pickupDealer?.location}</div></div>`,
                  ariaLabel: "Uluru",
                });
                const Dropwindow = new google.maps.InfoWindow({
                  content: `<div class="asp-location"><div class="location-title">Drop Location</div><div class="location-detail">${locationDetails?.dropDealer?.location}</div></div>`,
                  ariaLabel: "Uluru",
                });
                const ASPwindow = new google.maps.InfoWindow({
                  content: `<div class="asp-location"><div class="location-title">ASP Location</div><div class="location-detail">${locationDetails?.asp?.location}</div></div>`,
                  ariaLabel: "Uluru",
                });

                const ASPLivewindow = new google.maps.InfoWindow({
                  content: `<div class="asp-location"><div class="location-title">ASP Current Location</div></div>`,
                  ariaLabel: "Uluru",
                });
                const startMarker = new google.maps.Marker({
                  position: response?.request?.origin?.location,
                  icon: StartLocation,
                  map: map,
                  title: "ASP Location",
                });
                startMarker.addListener("click", () => {
                  ASPwindow.open({
                    anchor: startMarker,
                    map,
                  });
                  PickupWindow.close();
                  Dropwindow.close();
                  ASPLivewindow.close();
                });

                const endMarker = new google.maps.Marker({
                  position: response?.request?.destination?.location,
                  icon: EndLocation,
                  map: map,
                  title: "Drop Location",
                });

                endMarker.addListener("click", () => {
                  Dropwindow.open({
                    anchor: endMarker,
                    map,
                  });
                  PickupWindow.close();
                  ASPwindow.close();
                  ASPLivewindow.close();
                });
                const pickupMarker = new google.maps.Marker({
                  position: response?.request?.waypoints[0]?.location?.location,
                  icon: VehicleLocationBlueMarker,
                  map: map,
                  title: `Pickup Location`,
                });
                pickupMarker.addListener("click", () => {
                  PickupWindow.open({
                    anchor: pickupMarker,
                    map,
                  });
                  Dropwindow.close();
                  ASPwindow.close();
                  ASPLivewindow.close();
                });
                AspLiveMarker.addListener("click", () => {
                  ASPLivewindow.open({
                    anchor: AspLiveMarker,
                    map,
                  });
                  PickupWindow.close();
                  Dropwindow.close();
                  ASPwindow.close();
                });
                // console.log("Direction request", request, response, status);
                const directionsRenderer = new google.maps.DirectionsRenderer({
                  directions: response,

                  suppressMarkers: true, // Customize as needed
                  polylineOptions: {
                    //strokeColor: "#1A2E35", // Customize the color of your direction line
                    strokeOpacity: 0.8,
                    strokeWeight: 3,
                  },
                });

                directionsRenderer.setMap(map);
                directionsRenderer.setDirections(response);
              } else {
                console.error("Error fetching directions:", status);
              }
            });
            /*   ASP Travelled path direction */

            /*  console.log(
              "asp waypoints",
              res?.data?.data?.allLiveLocations?.slice(2, 25)?.map((item) => {
                return {
                  lat: Number(item?.latitude),
                  lng: Number(item?.longitude),
                };
              })
            );
            const aspLocation = {
              origin: {
                lat: Number(res?.data?.data?.allLiveLocations[0]?.latitude),
                lng: Number(res?.data?.data?.allLiveLocations[0]?.longitude),
              },

              destination: {
                lat: Number(
                  res?.data?.data?.allLiveLocations[
                    res?.data?.data?.allLiveLocations?.length - 1
                  ]?.latitude
                ),
                lng: Number(
                  res?.data?.data?.allLiveLocations[
                    res?.data?.data?.allLiveLocations?.length - 1
                  ].longitude
                ),
              },

              waypoints: res?.data?.data?.allLiveLocations
                ?.slice(2, 27)
                ?.map((item) => {
                  return {
                    location: {
                      lat: Number(item?.latitude),
                      lng: Number(item?.longitude),
                    },
                    stopover: true,
                  };
                }),
              travelMode: "DRIVING",
            };
            directionsService?.route(aspLocation, (response, status) => {
              console.log("asp mapResponse=>", response);

              if (status == "OK") {
                const aspdirectionsRenderer =
                  new google.maps.DirectionsRenderer({
                    directions: response,

                    suppressMarkers: true, // Customize as needed
                    polylineOptions: {
                      strokeColor: "yellow", // Customize the color of your direction line
                    },
                  });
                aspdirectionsRenderer.setMap(map);
                aspdirectionsRenderer.setDirections(response);
              } else {
                console.error("Error fetching directions:", status);
              }
            }); */
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
  };

  return (
    <div>
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title">{aspName}</div>
            <div className="refresh-btn">
              <Button
                onClick={() => {
                  setRefresh(!refresh);
                }}
              >
                {/* <img src={RefreshIcon} /> */}
                Refresh Now
              </Button>
            </div>
          </div>
        }
        pt={{
          root: { className: "w-968" },
        }}
        visible={visible}
        position={"bottom"}
        onHide={() => setVisible(false)}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
      >
        <div className="map-container mt-3_4">
          <GoogleMapReact
            key={refresh}
            defaultCenter={{ lat: 59.95, lng: 30.33 }}
            defaultZoom={11}
            bootstrapURLKeys={{
              key: GoogleMapAPIKey,
            }}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
          ></GoogleMapReact>
        </div>
      </Dialog>
    </div>
  );
};

export default ServiceViewTowingDialog;
