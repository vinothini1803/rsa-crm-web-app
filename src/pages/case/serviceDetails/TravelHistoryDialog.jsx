import React, { useEffect, useRef } from "react";
import {
  DialogCloseSmallIcon,
  EndLocation,
  MechanicLocation,
  StartLocation,
  InfoDarkIcon,
  GoogleMapAPIKey,
  VehicleLocationBlueMarker,
} from "../../../utills/imgConstants";
import { OverlayPanel } from "primereact/overlaypanel";
import { Dialog } from "primereact/dialog";
import GoogleMapReact from "google-map-react";
import { mappls, mappls_plugin } from "mappls-web-maps";
import { useQuery, useMutation } from "react-query";
import { getToken } from "../../../../services/mapServices";
import { Button } from "primereact/button";
import { toast } from "react-toastify";
import TravelledKM from "../../../components/common/TravelledKM";
import { useNavigate } from "react-router";
import {
  sendPaymentLinkToCustomer,
  caseMapView,
} from "../../../../services/caseService";
import { serviceDeatils } from "../../../../services/assignServiceProvider";
import CurrencyFormat from "../../../components/common/CurrencyFormat";

const TravelHistoryDialog = ({
  visible,
  setVisible,
  aspResultData,
  viewMode,
  getData,
  caseData,
}) => {
  // console.log(">>>> ", aspResultData);
  // console.log("==> ", getData);
  // console.log("data==> ", caseData);
  const TotalKMpanel = useRef(null);
  const { mutate: sendLinkMutate, isLoading: sendLinkMutateLoading } =
    useMutation(sendPaymentLinkToCustomer);
  const navigate = useNavigate();

  const {
    data: serviceData,
    refetch,
    isLoading: serviceDetailIsLoading,
  } = useQuery(
    ["serviceDetail"],
    () =>
      serviceDeatils({
        activityId: aspResultData?.activityId,
      }),
    {
      enabled: viewMode == "view" ? true : false,
    }
  );
  // console.log("aspResultData?.activityId", aspResultData?.activityId);

  const { data: mapData, isLoading: mapIsLoading } = useQuery(
    ["mapview"],
    () =>
      caseMapView({
        caseDetailId: aspResultData?.caseDetail?.id,
        aspId: aspResultData?.asp?.id,
        serviceId: aspResultData?.serviceId,
        activityId: aspResultData?.activityId,
      }),
    {
      enabled: viewMode == "view" ? true : false,
    }
  );
  // console.log("serviceData===>", serviceData);
  // console.log("serviceData===>", mapData);
  const chargeDetails = aspResultData?.chargesDetail?.filter(
    (charges) => charges.typeId == 150
  );
  const serviceDetails =
    viewMode == "view" ? mapData?.data?.data : serviceData?.data.data[0];
  // console.log("==>", serviceDetails);
  const mapLocation = {
    aspLocation: {
      lat: Number(aspResultData?.asp?.latitude),
      lng: Number(aspResultData?.asp?.longitude),
    },
    pickupLocation: {
      lat: Number(serviceData?.data?.data?.[0]?.breakdownLocation?.latitude),
      lng: Number(serviceData?.data?.data?.[0]?.breakdownLocation?.longitude),
    },
    dropLocation: {
      lat: Number(serviceData?.data?.data?.[0]?.dropLocation?.latitude),
      lng: Number(serviceData?.data?.data?.[0]?.dropLocation?.longitude),
    },
  };
  // console.log("==>>>maps", mapLocation);

  const handleSendLink = () => {
    sendLinkMutate(
      {
        activityId: aspResultData?.activityId,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setVisible(false);
            navigate(`/cases/view/${aspResultData?.caseDetail?.id}`);
          } else {
            if (res?.data?.error) {
              toast.error(res?.data?.error);
            } else {
              res?.data?.errors.forEach((el) => toast.error(el));
            }
          }
        },
      }
    );
  };

  const handleApiLoaded = (map, maps) => {
    // console.log("map, maps", map, maps);

    const directionsService = new google.maps.DirectionsService();

    const origin = mapLocation?.aspLocation;
    const destination =
      mapLocation?.dropLocation?.lat && mapLocation?.dropLocation?.lng
        ? mapLocation?.dropLocation
        : mapLocation?.pickupLocation;

    const waypoints =
      mapLocation?.dropLocation?.lat && mapLocation?.dropLocation?.lng
        ? [{ location: mapLocation?.pickupLocation }]
        : [];

    // console.log("=====", origin, destination, waypoints);

    // Define your directions request
    const request = {
      origin,
      destination,
      waypoints,
      travelMode: "DRIVING",
    };

    // Request directions
    directionsService.route(request, (response, status) => {
      if (status === "OK") {
        // console.log("mapResponse=>", response);

        const PickupWindow = new google.maps.InfoWindow({
          content: `<div class="asp-location"><div class="location-title">Breakdown Location</div><div class="location-detail">${serviceDetails?.breakdownLocation?.details?.address}</div></div>`,
        });

        const ASPwindow = new google.maps.InfoWindow({
          content: `<div class="asp-location"><div class="location-title">ASP Location</div><div class="location-detail">${serviceDetails?.aspLocation?.details?.addressLineOne}${serviceDetails?.aspLocation?.details?.addressLineTwo}</div></div>`,
        });

        const startMarker = new google.maps.Marker({
          position: origin,
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
        });

        if (mapLocation?.dropLocation?.lat && mapLocation?.dropLocation?.lng) {
          const Dropwindow = new google.maps.InfoWindow({
            content: `<div class="asp-location"><div class="location-title">Drop Location</div><div class="location-detail">${serviceDetails?.dropLocation?.details?.address}</div></div>`,
          });

          const endMarker = new google.maps.Marker({
            position: destination,
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
          });
        }

        const pickupMarker = new google.maps.Marker({
          position:
            mapLocation?.dropLocation?.lat && mapLocation?.dropLocation?.lng
              ? mapLocation?.pickupLocation
              : destination,
          icon: VehicleLocationBlueMarker,
          map: map,
          title: "Breakdown Location",
        });

        pickupMarker.addListener("click", () => {
          PickupWindow.open({
            anchor: pickupMarker,
            map,
          });
          ASPwindow.close();
        });

        const directionsRenderer = new google.maps.DirectionsRenderer({
          map: map,
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: "#1A2E35",
            strokeOpacity: 0.8,
            strokeWeight: 3,
          },
        });

        directionsRenderer.setDirections(response);
      } else {
        console.error("Error fetching directions:", status, response);
      }
    });
  };
  const styleMap = { width: "100%", height: "100%", borderRadius: "8px" };

  return (
    <Dialog
      header={
        <div className="dialog-header">
          <div className="dialog-header-title">
            Travel History - {aspResultData?.asp?.code}
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
      <div className="km-details-container">
        <div className="km-info">
          <div className="info-title">Vehicle Number</div>
          <div className="km-info" disabled={viewMode == "view" ? true : false}>
            {/* {getData?.aspDetails?.aspVehicleRegistrationNumber
              ? getData?.aspDetails?.aspVehicleRegistrationNumber
              : " -- "} */}
            {aspResultData?.aspVehicleRegistrationNumber
              ? aspResultData?.aspVehicleRegistrationNumber
              : "--"}
          </div>
        </div>
        <div className="km-info">
          <div className="info-title">Total Travel KM</div>
          <div className="info-km grey-text">
            {aspResultData?.estimatedTotalKm
              ? aspResultData?.estimatedTotalKm
              : "--"}{" "}
            KM{" "}
            <img
              src={InfoDarkIcon}
              style={{ cursor: "pointer" }}
              onClick={(e) => TotalKMpanel.current.toggle(e)}
            />
          </div>
        </div>
        <div className="km-info">
          <div className="info-title">Service Cost </div>
          <div className="service-cost-info gap-1">
            {aspResultData?.customerNeedToPay == true ? (
              <>
                {aspResultData?.estimatedTotalAmount ? (
                  <CurrencyFormat
                    amount={aspResultData?.estimatedTotalAmount}
                  />
                ) : (
                  "--"
                )}{" "}
                <span className="content-success"> Incl GST</span>
              </>
            ) : (
              <span className="color-success">Free </span>
            )}
          </div>
        </div>
        {viewMode == "view" && (
          <div className="km-info">
            <div className="info-title">Excess KM</div>
            <div className="info-km grey-text">
              {aspResultData?.additionalChargeableKm
                ? `${aspResultData?.additionalChargeableKm} KM`
                : "--"}
            </div>
          </div>
        )}
        <div className="km-info">
          <div className="info-title">Additional Charges</div>
          <div className="km-info ">
            {aspResultData?.estimatedAdditionalCharge ||
            aspResultData?.actualAdditionalCharge ? (
              <CurrencyFormat
                amount={
                  aspResultData?.actualAdditionalCharge
                    ? aspResultData?.actualAdditionalCharge
                    : aspResultData?.estimatedAdditionalCharge
                }
              />
            ) : (
              "--"
            )}
          </div>
        </div>
        {aspResultData?.customerNeedToPay ?? (
          <Button
            className="btn btn-primary gap-3_4"
            onClick={handleSendLink}
            loading={sendLinkMutateLoading}
            disabled={
              (aspResultData?.aspVehicleRegistrationNumber &&
                aspResultData?.asp?.name) ||
              (aspResultData?.aspVehicleRegistrationNumber &&
                aspResultData?.asp?.hasMechanic == false)
                ? false
                : true
            }
          >
            Send Link
          </Button>
        )}

        <OverlayPanel ref={TotalKMpanel} className="form-overlay-panel">
          <div className="towing-charges-content">
            <div className="towing-charges-title">
              ASP To Breakdown Distance
            </div>
            <div className="towing-charges-amount">
              {aspResultData?.estimatedAspToBreakdownKm} KM
            </div>
          </div>
          {aspResultData?.estimatedBreakdownToDropKm ? (
            <>
              <div className="towing-charges-content">
                <div className="towing-charges-title">
                  Breakdown To Drop Distance
                </div>
                <div className="towing-charges-amount">
                  {aspResultData?.estimatedBreakdownToDropKm} KM
                </div>
              </div>
              <div className="towing-charges-content">
                <div className="towing-charges-title">Drop To ASP Distance</div>
                <div className="towing-charges-amount">
                  {aspResultData?.estimatedDropToAspKm} KM
                </div>
              </div>
            </>
          ) : (
            <div className="towing-charges-content">
              <div className="towing-charges-title">
                Breakdown To ASP Distance
              </div>
              <div className="towing-charges-amount">
                {aspResultData?.estimatedBreakdownToAspKm} KM
              </div>
            </div>
          )}
        </OverlayPanel>
      </div>
      <div className="map-container">
        <div className="travelldkm">
          <TravelledKM km={aspResultData?.estimatedTotalKm} />
        </div>
        <div id="map" style={styleMap}>
          <GoogleMapReact
            defaultCenter={{ lat: 20.5937, lng: 78.9629 }}
            defaultZoom={5}
            bootstrapURLKeys={{
              key: GoogleMapAPIKey,
            }}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
          ></GoogleMapReact>
        </div>
      </div>
    </Dialog>
  );
};

export default TravelHistoryDialog;
