import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import GoogleMapReact from "google-map-react";
import { mappls, mappls_plugin } from "mappls-web-maps";
import {
  DialogCloseSmallIcon,
  EndLocation,
  GoogleMapAPIKey,
  InfoDarkIcon,
  StartLocation,
  VehicleLocationBlueMarker,
} from "../../utills/imgConstants";
import { OverlayPanel } from "primereact/overlaypanel";
import {
  Controller,
  set,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Menu } from "primereact/menu";
import {
  activitySendForApproval,
  updateActivityVehicleNumber,
  updateActivityCharge,
  serviceDeatils,
  mapView,
  assignDriver,
  deviationKMSave,
} from "../../../services/assignServiceProvider";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { Button } from "primereact/button";
import { useNavigate } from "react-router";
import TravelledKM from "../../components/common/TravelledKM";
import {
  additionalCharges,
  aspMechanics,
} from "../../../services/masterServices";
import CurrencyFormat from "../../components/common/CurrencyFormat";
import Loader from "../../components/common/Loader";

const ServiceTowingDialog = ({
  visible,
  setVisible,
  aspId,
  companyName,
  caseId,
  // details,
  activityId,
  mapLocation,
  viewMode,
  isOwnPatrol,
}) => {
  const AddChargePanel = useRef(null);
  const AddVehiclePanel = useRef(null);
  const AddtionChargesView = useRef(null);
  const TotalKMpanel = useRef(null);
  const DriverPanel = useRef(null);
  const AddChargeMenu = useRef(null);
  const DeviationDistance = useRef(null);
  const [selectedOption, setSelectedOption] = useState([]);
  const [forceRerender, setForceRerender] = useState(false);
  // console.log("view mode", viewMode);
  // console.log("ActivityId", activityId);
  const [items, setItems] = useState();

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset: addChargeReset,
    resetField,
    setValue,
  } = useForm();
  const {
    control: vehicleControl,
    handleSubmit: vehicleHandleSubmit,
    reset: vehicleReset,
    resetField: vehicleResetField,
    formState: vehicleformState,
    trigger: vehicleTrigger,
    setValue: vechicleNoSetValue,
  } = useForm({
    defaultValues: {
      vehicleNumber: "",
    },
  });
  const {
    control: deviationControl,
    handleSubmit: deviationHandleSubmit,
    reset: deviationReset,
    resetField: deviationResetField,
    formState: deviationformState,
    trigger: deviationTrigger,
    setValue: deviationSetValue,
  } = useForm({
    defaultValues: {
      routeDeviationKm: "",
    },
  });
  const { fields, update, remove, append } = useFieldArray({
    control,
    name: "chargesData",
  });

  const { control: driverFormControl, handleSubmit: driverFormSubmit } =
    useForm();
  const {
    data,
    refetch,
    isLoading: serviceDetailIsLoading,
  } = useQuery(
    ["serviceDetail"],
    () =>
      serviceDeatils({
        activityId: activityId,
      }),
    {
      enabled: viewMode == "form" ? true : false,
    }
  );

  const { data: aspMechanicsData } = useQuery(["aspMechanics"], () =>
    aspMechanics({
      aspId: aspId,
    })
  );

  const { mutate: assignDriverMutate, isLoading: assignDriverLoading } =
    useMutation(assignDriver);
  // console.log("mapLocation", mapLocation);
  const { data: mapData, isLoading: mapIsLoading } = useQuery(
    ["mapview"],
    () =>
      mapView({
        caseDetailId: caseId,
        aspId: aspId,
      }),
    {
      enabled: viewMode == "view" ? true : false,
    }
  );
  const { data: additinalChargeList } = useQuery(
    ["addtinalCharge"],
    () =>
      additionalCharges({
        limit: 10,
        offset: 0,
      }),
    {
      onSuccess: (res) => {
        // console.log("addtinal charge res", res, res?.data?.data);
        setItems(
          res?.data?.data?.map((item) => {
            return {
              key: Number(item.id),
              label: item.name,
              name: item.name,
              command: handleSelectedOptions,
            };
          })
        );
      },
      refetchOnWindowFocus: false,
    }
  );
  const serviceDetails =
    viewMode == "view" ? mapData?.data?.data : data?.data?.data?.[0];
  const chargeDetails = serviceDetails?.chargesDetail?.filter(
    (charges) => charges.typeId == 150
  );

  // console.log("chargeDetails Data", chargeDetails);

  const {
    mutate: addChargeMutate,
    isLoading: addChargeLoading,
    data: chargesData,
  } = useMutation(updateActivityCharge);

  const {
    mutate,
    isLoading,
    data: updateActivityVehicleData,
  } = useMutation(updateActivityVehicleNumber);
  const { mutate: approvalmutate, isLoading: approvalLoading } = useMutation(
    activitySendForApproval
  );
  const { mutate: deviationmutate, isLoading: deviationLoading } =
    useMutation(deviationKMSave);

  const navigate = useNavigate();
  const handleSelectedOptions = ({ originalEvent, item }) => {
    // console.log("handleSelectedOptions", item);
    setSelectedOption((prev) => [
      ...prev,
      { key: item.key, label: item.label, name: item.name },
    ]);
    // console.log("selected item", item);
    append({ amount: "" });
    // console.log(
    //   "handleSelectedOptions items",
    //   items?.filter((menu) => menu.key !== item.key)
    // );
    // console.log("items", items);

    setItems((prev) => prev?.filter((el) => item.key !== el.key));
  };

  // Add charges function
  const handleAddChargeSubmit = (values) => {
    // console.log("charge submit values", values.chargesData);
    if (values) {
      addChargeMutate(
        {
          ...values,
          chargesData: values?.chargesData?.map((data, i) => {
            return {
              ...data,
              chargeId: selectedOption[i].key,
            };
          }),
          totalAdditionalCharges: String(
            values?.chargesData?.reduce((a, item) => {
              return Number(item.amount) + a;
            }, 0)
          ),
          activityId: activityId,
          aspId: aspId,
          typeId: 150, //Its static ---Type Id for web to differentiate from mobile charges
          logTypeId: 240,
        },
        {
          onSuccess: (res) => {
            // console.log("response", res?.data.chargesData);

            if (res?.data?.success) {
              toast.success(res?.data?.message);
              refetch();
              AddChargePanel.current.hide();
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
    }
  };

  /* Cancel charge function*/
  const handleCancleCharge = () => {
    AddChargePanel.current.hide();
    setSelectedOption([]);
    setItems(
      additinalChargeList?.data?.data?.map((item) => {
        return {
          key: Number(item.id),
          label: item.name,
          name: item.name,
          command: handleSelectedOptions,
        };
      })
    );
    addChargeReset({
      chargesData: [],
    });
  };

  /* Edit Charge function */
  const handleEditCharges = (e) => {
    AddChargePanel.current.toggle(e);

    //To Add Dynamic Field on Edit
    setSelectedOption(
      chargeDetails?.map((chargeData) => {
        return {
          key: Number(chargeData.chargeId),
          label: chargeData.chargeName,
          name: chargeData.chargeName,
        };
      })
    );
    //To Fill Field on Edit Charges

    setValue(
      "chargesData",
      chargeDetails?.map((element, i) => {
        return { amount: element?.amount };
      })
    );

    // console.log("filterd item", chargeDetails, additinalChargeList);
    //To set for chargees Menu on Edit
    setItems(
      additinalChargeList?.data?.data
        ?.filter(
          (el) => !chargeDetails?.some((charge) => el.id == charge?.chargeId)
        )
        ?.map((charge) => {
          return {
            key: Number(charge.id),
            label: charge.name,
            name: charge.name,
            command: handleSelectedOptions,
          };
        })
    );
    AddtionChargesView.current.hide();
  };
  // console.log("edit items", items);
  /* Add Vehicle Form Submit */
  const onVehicleSubmit = (values) => {
    // console.log("vehicle number", values);
    mutate(
      {
        activityId: activityId,
        aspId: aspId,
        ...values,
        logTypeId: 240,
      },
      {
        onSuccess: (res) => {
          // console.log("res", res);
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            refetch();
            vehicleReset();
            AddVehiclePanel.current.hide();
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

  // Define Towing view data
  const TowingData = {
    vechicle_number: updateActivityVehicleData?.data?.vehicleNumber,
    // service_cost: "300 km",
    // total_travel_km: "3430",
    ...(chargesData?.data?.success && {
      additional_charge:
        Number(chargesData?.data?.ccTollCharges) +
        Number(chargesData?.data?.ccBorderCharges) +
        Number(chargesData?.data?.ccGreenTaxCharges),
    }),
  };

  const handleSendApproval = () => {
    approvalmutate(
      {
        activityId: activityId,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setVisible(false);
            navigate(`/delivery-request/view/${caseId}`);
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

  // console.log("items after removed", items);
  const handleRemove = (e, item, i) => {
    // console.log("item index", i);
    remove(i);
    const removeoption = selectedOption.filter(
      (option) => option?.key !== item.key
    );
    // console.log("removeoption", removeoption);
    setSelectedOption(removeoption);
    setItems([
      {
        key: item.key,
        label: item.label,
        name: item.name,
        command: handleSelectedOptions,
      },
      ...items,
    ]); //To remove from Field array
  };

  const handleVehicleNoUpdation = (e) => {
    AddVehiclePanel.current.show(e);
    if (serviceDetails?.aspVehicleRegistrationNumber) {
      vechicleNoSetValue(
        "vehicleNumber",
        serviceDetails?.aspVehicleRegistrationNumber
      );
    }
  };
  // console.log("map view service detail", serviceDetails);
  //Map styling
  const handleApiLoaded = (map, maps) => {
    // console.log("map, maps", map, maps);

    // Create a new DirectionsService

    const directionsService = new google.maps.DirectionsService();

    const origin = mapLocation?.aspLocation; // Replace with your starting location
    const destination = mapLocation?.dropLocation; // Replace with your destination
    const waypoints = [
      {
        location: mapLocation?.pickupLocation,
      },
    ]; // Add waypoints if needed

    // Define your directions request
    const request = {
      origin,
      destination,
      waypoints,
      travelMode: "DRIVING", // You can change the mode to WALKING, BICYCLING, or TRANSIT
    };

    // Request directions
    directionsService?.route(request, (response, status) => {
      // console.log("mapResponse=>", response);
      if (status == "OK") {
        const PickupWindow = new google.maps.InfoWindow({
          content: `<div class="asp-location"><div class="location-title">PickUp Location</div><div class="location-detail">${
            serviceDetails?.pickupLocation?.details?.address || "--"
          } </div></div>`,
          ariaLabel: "PickUp Location",
        });
        const Dropwindow = new google.maps.InfoWindow({
          content: `<div class="asp-location"><div class="location-title">Drop Location</div><div class="location-detail">${
            serviceDetails?.dropLocation?.details?.address || "--"
          }</div></div>`,
          ariaLabel: "Drop Location",
        });
        const ASPwindow = new google.maps.InfoWindow({
          content: `<div class="asp-location"><div class="location-title">ASP Location</div><div class="location-detail">${
            serviceDetails?.aspLocation?.details?.addressLineOne || ""
          }${
            serviceDetails?.aspLocation?.details?.addressLineTwo || ""
          }</div></div>`,
          ariaLabel: "ASP Location",
        });

        // Store all InfoWindows in an array for easy management
        const infoWindows = [PickupWindow, Dropwindow, ASPwindow];

        // Track when a marker was clicked to prevent map click from closing immediately
        let markerClickTime = 0;

        // Function to close all InfoWindows
        const closeAllInfoWindows = () => {
          // Don't close if a marker was just clicked (within 100ms)
          const timeSinceMarkerClick = Date.now() - markerClickTime;
          if (timeSinceMarkerClick < 100) {
            return;
          }
          infoWindows.forEach((window) => {
            if (window) {
              window.close();
            }
          });
        };

        // Add click listener to map to close InfoWindows when clicking outside
        map.addListener("click", () => {
          closeAllInfoWindows();
        });

        //Create Marker
        const startMarker = new google.maps.Marker({
          position: response?.request?.origin?.location,
          icon: StartLocation,
          map: map,
          title: "ASP Location",
        });
        startMarker.addListener("click", () => {
          markerClickTime = Date.now();
          ASPwindow.open({
            anchor: startMarker,
            map,
          });
          PickupWindow.close();
          Dropwindow.close();
        });
        const endMarker = new google.maps.Marker({
          position: response?.request?.destination?.location,
          icon: EndLocation,
          map: map,
          title: "Drop Location",
        });
        endMarker.addListener("click", () => {
          markerClickTime = Date.now();
          Dropwindow.open({
            anchor: endMarker,
            map,
          });
          PickupWindow.close();
          ASPwindow.close();
        });
        const pickupMarker = new google.maps.Marker({
          position: response?.request?.waypoints[0]?.location?.location,
          icon: VehicleLocationBlueMarker,
          map: map,
          title: "Pickup Location",
        });
        pickupMarker.addListener("click", () => {
          markerClickTime = Date.now();
          PickupWindow.open({
            anchor: pickupMarker,
            map,
          });
          Dropwindow.close();
          ASPwindow.close();
        });

        // console.log("Direction request", request, response, status);
        const directionsRenderer = new google.maps.DirectionsRenderer({
          directions: response,

          suppressMarkers: true, // Customize as needed
          polylineOptions: {
            strokeColor: "#1A2E35", // Customize the color of your direction line
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

    //Search Service
    // var service = new google.maps.places.PlacesService(map);
    // service.findPlaceFromQuery(request, (results, status) => {
    //   if (status === google.maps.places.PlacesServiceStatus.OK) {
    //     console.log("search result", results);
    //   }
    // });
  };

  const handleAssignDriver = (e) => {
    DriverPanel.current.toggle(e);
  };

  const handleDriverFormSubmit = (values) => {
    // console.log("driver form values", values);
    assignDriverMutate(
      {
        activityId: serviceDetails?.activityId,
        aspId: serviceDetails?.asp?.id,
        ...values,
        logTypeId: 240,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            DriverPanel.current.hide();
            refetch();
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

  //Add Route Deviation KM
  const deviationKMSubmit = (values) => {
    // console.log("Deviation", values);
    deviationmutate(
      {
        activityId: activityId,

        ...values,
      },
      {
        onSuccess: (res) => {
          // console.log("res", res);
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            refetch();
            deviationReset();
            DeviationDistance.current.hide();
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
  const openTotalKMpanel = (e) => {
    TotalKMpanel.current.toggle(e);
    if (serviceDetails?.estimatedRouteDeviationKm) {
      deviationSetValue(
        "routeDeviationKm",
        Number(serviceDetails?.estimatedRouteDeviationKm)
      );
    }
  };
  // console.log("fields++", fields,serviceDetails);
  return (
    <div>
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title">{companyName}</div>
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
        //closable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
      >
        <div className="towing-details-container">
          <div className="towing-info">
            <div className="info-title">Vehicle Number</div>
            <div
              className="info-km"
              disabled={viewMode == "view" ? true : false}
            >
              <button
                className="btn-link"
                onClick={handleVehicleNoUpdation}
                disabled={
                  viewMode == "view" ||
                  (isOwnPatrol && serviceDetails?.aspVehicleRegistrationNumber)
                    ? true
                    : false
                }
              >
                {serviceDetails?.aspVehicleRegistrationNumber
                  ? serviceDetails?.aspVehicleRegistrationNumber
                  : " Add Vehicle Number"}
              </button>
            </div>
          </div>
          {serviceDetails?.asp?.hasMechanic && (
            <div className="towing-info">
              <div className="info-title">Driver Info</div>
              <div
                className="info-km"
                disabled={viewMode == "view" ? true : false}
              >
                {serviceDetails?.aspMechanic?.name ? (
                  serviceDetails?.aspMechanic?.name
                ) : (
                  <button
                    className="btn-link"
                    onClick={handleAssignDriver}
                    disabled={viewMode == "view" ? true : false}
                  >
                    Assign Driver
                  </button>
                )}
              </div>
            </div>
          )}
          <div className="towing-info">
            <div className="info-title">Total Travel Km</div>
            <div className="info-km grey-text d-flex align-items-center gap-1">
              {serviceDetails?.estimatedTotalKm
                ? serviceDetails?.estimatedTotalKm
                : "--"}{" "}
              KM{" "}
              {viewMode == "view" ? (
                <img
                  src={InfoDarkIcon}
                  style={{ cursor: "pointer" }}
                  onClick={(e) => TotalKMpanel.current.toggle(e)}
                />
              ) : (
                <button
                  className="btn-link"
                  onClick={(e) => openTotalKMpanel(e)}
                >
                  View
                </button>
              )}
            </div>
          </div>

          <div className="towing-info">
            <div className="info-title">Service Cost</div>
            <div className="info-km service-cost-info gap-1">
              {serviceDetails?.estimatedTotalAmount ? (
                <CurrencyFormat amount={serviceDetails?.estimatedTotalAmount} />
              ) : (
                "--"
              )}{" "}
              <span className="content-success"> Incl GST</span>
            </div>
          </div>
          <div className="towing-info">
            <div className="info-title">Additional Charges</div>
            <div className="info-km ">
              {chargeDetails?.length > 0 ? (
                <div className="d-flex gap-1">
                  <div>
                    <CurrencyFormat
                      amount={chargeDetails?.reduce(
                        (i, a) => i + Number(a.amount),
                        0
                      )}
                    />
                  </div>
                  <button
                    className="btn-link"
                    onClick={(e) => AddtionChargesView.current.toggle(e)}
                  >
                    View
                  </button>
                </div>
              ) : (
                <button
                  className="btn-link"
                  onClick={(e) => {
                    AddChargePanel.current.toggle(e);
                  }}
                  disabled={viewMode == "view" ? true : false}
                >
                  Add Charges
                </button>
              )}
            </div>
          </div>
          <OverlayPanel ref={DriverPanel} className="form-overlay-panel">
            <div className="filter-header">
              <div className="filter-title">Assign Driver</div>
            </div>
            <div className="filter-body">
              <form onSubmit={driverFormSubmit(handleDriverFormSubmit)}>
                <div className="d-flex flex-column gap-3_4">
                  <div className="form-group">
                    <label className="form-label filter-label">Driver </label>
                    <Controller
                      name="aspMechanicId"
                      control={driverFormControl}
                      rules={{
                        required: "Driver is required.",
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          <Dropdown
                            value={field.value}
                            placeholder="Select"
                            filter
                            options={aspMechanicsData?.data?.data?.map(
                              ({ name, id, code }) => {
                                return {
                                  label: `${name}-${code}`,
                                  value: id,
                                };
                              }
                            )}
                            optionLabel="label"
                            onChange={(e) => field.onChange(e.value)}
                          />
                        </>
                      )}
                    />
                  </div>
                  <div className="d-flex gap-2 ms-auto">
                    <Button
                      className="btn btn-primary gap-3_4"
                      loading={assignDriverLoading}
                      type="submit"
                    >
                      Assign
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </OverlayPanel>
          <OverlayPanel ref={AddVehiclePanel} className="form-overlay-panel">
            <div className="filter-header">
              <div className="filter-title">Vehicle Registration Number</div>
            </div>
            <div className="filter-body">
              <form onSubmit={vehicleHandleSubmit(onVehicleSubmit)}>
                <div className="d-flex flex-column gap-3_4">
                  <div className="form-group">
                    <label className="form-label filter-label">
                      Vehicle Number
                    </label>
                    <Controller
                      name="vehicleNumber"
                      control={vehicleControl}
                      rules={{
                        required: "Vehicle Number is Required.",
                        /*   validate: {
                          matchPattern: (v) =>
                            /^[A-Z0-9]{2}[A-Z0-9]{0,2}[A-Z0-9]{0,3}[A-Z0-9]{0,4}$/.test(
                              v
                            ) || "Please enter a valid Vehicle Number",
                        }, */
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            {...field}
                            value={field.value.toUpperCase()}
                            placeholder="Enter Vehicle Number"
                            keyfilter={"alphanum"}
                            maxLength={10}
                          />
                          <div className="p-error">
                            {vehicleformState.errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                  <div className="d-flex gap-2 ms-auto">
                    <Button
                      className="btn btn-primary gap-3_4"
                      type="submit"
                      loading={isLoading}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </OverlayPanel>
          <OverlayPanel ref={AddChargePanel} className="form-overlay-panel">
            <div className="filter-header">
              <div className="filter-title">Additional Charges</div>
            </div>
            <div className="filter-body">
              <form onSubmit={handleSubmit(handleAddChargeSubmit)}>
                <div className="d-flex flex-column gap-3_4">
                  {fields?.map((field, i) => (
                    <div className="form-group" key={field.id}>
                      {/* key prop value should be dynamic field id */}
                      <div className="d-flex gap-2">
                        <label className="form-label filter-label">
                          {selectedOption[i]?.label}
                        </label>
                        <div
                          className="remove-text ms-auto"
                          onClick={(e) => handleRemove(e, selectedOption[i], i)}
                        >
                          Remove
                        </div>
                      </div>
                      <Controller
                        name={`chargesData.${i}.amount`} //Tp update as array of Charges using useFieldArray hook
                        control={control}
                        defaultValue={field.value}
                        rules={{
                          required: `${selectedOption[i]?.label} Required`,
                        }}
                        render={({ field, fieldState }) => (
                          <>
                            <InputText
                              {...field}
                              placeholder="Enter"
                              keyfilter="pnum"
                              key={field?.id}
                            />
                            {/* {console.log("charge errors", errors)} */}
                            <div className="p-error">
                              {errors &&
                                errors?.chargesData &&
                                errors?.chargesData[i]?.amount?.message}
                            </div>
                          </>
                        )}
                      />
                    </div>
                  ))}
                  {items?.length > 0 && (
                    <button
                      className="btn btn-blue btn-brder-blue"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        AddChargeMenu.current.show(e);
                      }}
                    >
                      Add new charges
                    </button>
                  )}

                  <div className="d-flex gap-2 ms-auto">
                    <Button
                      className="btn btn-white  gap-3_4"
                      onClick={handleCancleCharge}
                      type="button"
                    >
                      Cancel
                    </Button>
                    <Button
                      className="btn btn-primary gap-3_4"
                      type="submit"
                      loading={addChargeLoading}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </form>
              <Menu
                model={items}
                popup
                ref={AddChargeMenu}
                popupAlignment={"top"}
              ></Menu>
            </div>
          </OverlayPanel>
          <OverlayPanel ref={TotalKMpanel} className="form-overlay-panel">
            <div className="towing-charges-content px-2_3">
              <div className="towing-charges-title">ASP To Pickup Distance</div>
              <div className="towing-charges-amount">
                {serviceDetails?.estimatedAspToPickupKm} KM
              </div>
            </div>
            <div className="towing-charges-content px-2_3">
              <div className="towing-charges-title">
                Pickup To Drop Distance
              </div>
              <div className="towing-charges-amount">
                {serviceDetails?.estimatedPickupToDropKm} KM
              </div>
            </div>
            <div className="towing-charges-content px-2_3">
              <div className="towing-charges-title">Drop To ASP Distance</div>
              <div className="towing-charges-amount">
                {serviceDetails?.estimatedDropToAspKm} KM
              </div>
            </div>
            {serviceDetails?.estimatedRouteDeviationKm && (
              <div className="towing-charges-content px-2_3">
                <div className="towing-charges-title">
                  Route Deviation Distance
                </div>
                <div className="towing-charges-amount">
                  {serviceDetails?.estimatedRouteDeviationKm} KM
                </div>
              </div>
            )}
            {viewMode == "view" ? null : (
              <div className=" px-2_3 text-center">
                <button
                  className="btn-link "
                  onClick={(e) => {
                    TotalKMpanel.current.hide();
                    DeviationDistance.current.show(e);
                  }}
                >
                  {serviceDetails?.estimatedRouteDeviationKm ? "Edit" : "Add"}{" "}
                  Deviation Distance
                </button>
              </div>
            )}
          </OverlayPanel>
          <OverlayPanel ref={DeviationDistance} className="form-overlay-panel">
            <div className="towing-charges-content">
              <div className="cost-overlay-header">
                Route Deviation Distance
              </div>
            </div>
            <div className="form-group">
              <form onSubmit={deviationHandleSubmit(deviationKMSubmit)}>
                <div className="d-flex flex-column gap-3_4">
                  <div className="form-group">
                    <label className="form-label required">Deviation KM</label>
                    <Controller
                      name="routeDeviationKm"
                      control={deviationControl}
                      rules={{
                        required: "Deviation KM is Required.",
                      }}
                      render={({ field, fieldState }) => {
                        return (
                          <>
                            <InputText
                              {...field}
                              placeholder="Enter"
                              keyfilter="pnum"
                              value={field.value}
                            />

                            {/* <InputNumber
                              {...field}
                              value={field.value}
                              placeholder="Enter Deviation KM"
                              onChange={(e) =>
                                field.onChange(e.value)
                              }
                              mode="decimal" 
                               maxFractionDigits={2} 
                               useGrouping={false}
                            /> */}
                            <div className="p-error">
                              {deviationformState.errors[field.name]?.message}
                            </div>
                          </>
                        );
                      }}
                    />
                  </div>
                  <div className="d-flex gap-2 ms-auto">
                    <Button
                      className="btn btn-white  gap-3_4"
                      onClick={() => {
                        DeviationDistance.current.hide();
                        deviationResetField();
                      }}
                      type="button"
                    >
                      Cancel
                    </Button>
                    <Button
                      className="btn btn-primary gap-3_4"
                      type="submit"
                      loading={deviationLoading}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </OverlayPanel>
        </div>

        <div className="map-container mt-3_4">
          <div className="travelldkm">
            <TravelledKM
              km={
                serviceDetails?.estimatedTotalKm
                  ? serviceDetails?.estimatedTotalKm
                  : "--"
              }
            />
          </div>

          {(viewMode == "view" ? mapIsLoading : serviceDetailIsLoading) ? (
            <Loader />
          ) : (
            <GoogleMapReact
              defaultCenter={{ lat: 20.5937, lng: 78.9629 }}
              defaultZoom={5}
              bootstrapURLKeys={{
                key: GoogleMapAPIKey,
              }}
              yesIWantToUseGoogleMapApiInternals
              onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
            ></GoogleMapReact>
          )}
        </div>
        {viewMode == "form" && (
          <div className="add-charge-overloy-btn">
            <button
              className="btn btn-white  gap-3_4"
              onClick={() => setVisible(false)}
            >
              Cancel
            </button>
            <Button
              className="btn btn-primary gap-3_4"
              onClick={handleSendApproval}
              loading={approvalLoading}
              disabled={
                (serviceDetails?.aspVehicleRegistrationNumber &&
                  serviceDetails?.aspMechanic?.name) ||
                (serviceDetails?.aspVehicleRegistrationNumber &&
                  serviceDetails?.asp?.hasMechanic == false)
                  ? false
                  : true
              }
            >
              Send Approval
            </Button>
          </div>
        )}
      </Dialog>

      <OverlayPanel ref={AddtionChargesView} className="overlay-panel-card">
        <div className="towing-charges-card">
          <div className="towing-charges-card-body">
            {chargeDetails?.length > 0 &&
              chargeDetails?.map((chargeData, i) => (
                <div className="towing-charges-content px-2_3" key={i}>
                  <div className="towing-charges-title">
                    {chargeData.chargeName}
                  </div>
                  <div className="towing-charges-amount">
                    <CurrencyFormat amount={chargeData.amount} />
                  </div>
                </div>
              ))}

            <div className="d-flex px-2_3 mt-2_3 justify-content-center">
              <button className="btn-link" onClick={handleEditCharges}>
                Edit Additional Charges
              </button>
            </div>
          </div>
        </div>
      </OverlayPanel>
    </div>
  );
};

export default ServiceTowingDialog;
