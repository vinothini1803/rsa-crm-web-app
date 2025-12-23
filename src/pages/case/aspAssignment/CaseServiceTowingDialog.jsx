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
} from "../../../utills/imgConstants";
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
import { Menu } from "primereact/menu";
import {
  activitySendForApproval,
  updateActivityVehicleNumber,
  updateActivityCharge,
  serviceDeatils,
  mapView,
  assignDriver,
} from "../../../../services/assignServiceProvider";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { Button } from "primereact/button";
import { useNavigate } from "react-router";
import TravelledKM from "../../../components/common/TravelledKM";
import {
  additionalCharges,
  aspMechanics,
  discountReasons,
  getConfigList,
} from "../../../../services/masterServices";
import {
  caseMapView,
  sendPaymentLinkToCustomer,
  caseSendApproval,
  cashPayment,
} from "../../../../services/caseService";
import CurrencyFormat from "../../../components/common/CurrencyFormat";
import Loader from "../../../components/common/Loader";
import { RadioButton } from "primereact/radiobutton";

const CaseServiceTowingDialog = ({
  visible,
  setVisible,
  aspId,
  companyName,
  caseId,
  serviceId,
  caseData,
  // details,
  activityId,
  mapLocation,
  viewMode,
  caseActivityId,
  isOwnPatrol,
  activityData,
  aspRequestRefetch,
  updateMode,
  aspActivityStatusId,
  activityViewRefetch,
}) => {
  const [selectedDiscountReason, setSelectedDiscountReason] = useState(null);
  const [netAmount, setNetAmount] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(
    activityData?.discountPercentage || 0
  );
  const [discountAmount, setDiscountAmount] = useState(
    activityData?.discountAmount || 0
  );
  const [savedAdditionalCharges, setSavedAdditionalCharges] = useState([]);
  // const [serviceCosts, setServiceCosts] = useState(
  //   (activityData?.estimatedTotalAmount - discountAmount) * 1.18
  // );
  const [serviceCosts, setServiceCosts] = useState(
    activityData?.estimatedTotalAmount
  );
  // console.log("serviceCost", serviceCosts);
  const AddChargePanel = useRef(null);
  const AddVehiclePanel = useRef(null);
  const AddtionChargesView = useRef(null);
  const TotalKMpanel = useRef(null);
  const DriverPanel = useRef(null);
  const AddChargeMenu = useRef(null);
  const [selectedOption, setSelectedOption] = useState([]);
  const [forceRerender, setForceRerender] = useState(false);
  // console.log("view mode", viewMode, activityId, caseActivityId);
  const [items, setItems] = useState();
  const [legalName, setLegalName] = useState(null);
  const [tradeName, setTradeName] = useState(null);
  const [gstin, setGstin] = useState(null);

  const {
    control: payControl,
    formState: { errors: payErrors },
    reset: payReset,
    setValue: setPayvalue,
    trigger,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      paymentMethod: 1,
      sendPaymentLinkTo: "", // Set default value here
      discountPercentage: null,
      discountReasonId: null,
      discountAmount: null,
    },
  });
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

  const { fields, update, remove, append } = useFieldArray({
    control,
    name: "chargesData",
  });

  const {
    control: driverFormControl,
    formState: driverFormState,
    handleSubmit: driverFormSubmit,
  } = useForm();

  const paymentMethod = useWatch({
    name: "paymentMethod",
    control: payControl,
  });

  const sendPaymentLinkTo = useWatch({
    name: "sendPaymentLinkTo",
    control: payControl,
  });

  const customerTypeId = useWatch({
    name: "customerTypeId",
    control: payControl,
  });

  // console.log("paymentMethod", paymentMethod);
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

  const { data: discountData } = useQuery(["discountReasons"], () =>
    discountReasons({ refetchOnWindowFocus: false })
  );
  // console.log("discountData", discountData);
  // Assign Driver API
  const { mutate: assignDriverMutate, isLoading: assignDriverLoading } =
    useMutation(assignDriver);
  // console.log("mapLocation", mapLocation);

  // Calling Map View API
  const { data: mapData, isLoading: mapIsLoading } = useQuery(
    ["caseMapView"],
    () =>
      caseMapView({
        caseDetailId: caseId,
        aspId: aspId,
        serviceId: serviceId,
        activityId: activityId != null ? activityId : caseActivityId,
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
    viewMode == "view" ? mapData?.data?.data : data?.data.data[0];
  const chargeDetails = serviceDetails?.chargesDetail?.filter(
    (charges) => charges.typeId == 150
  );
  const [totalAmount, setTotalAmount] = useState(
    activityData?.estimatedTotalAmount || 0
  );
  const estimatedServiceCost = Number(
    serviceDetails?.estimatedServiceCost || 0
  );
  const estimatedAdditionalCharge = Number(
    serviceDetails?.estimatedAdditionalCharge || 0
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
  const { mutate: approvalmutate, isLoading: approvalLoading } =
    useMutation(caseSendApproval);
  const { mutate: sendLinkMutate, isLoading: sendLinkMutateLoading } =
    useMutation(sendPaymentLinkToCustomer);
  const { mutate: cashMutate, isLoading: cashLoading } =
    useMutation(cashPayment);
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
  const handleAddChargeSubmit = async (values) => {
    // console.log("charge submit values", values);
    const isValid = await trigger(["discountReasonId"]); // Manually trigger validation

    if (!isValid) {
      // console.log("Validation failed!", payErrors); // Debugging
      //toast.error("Please fix validation errors before submitting.");
      return; // Stop submission if validation fails
    }
    if (values) {
      const estimatedServiceCost = Number(
        serviceDetails?.estimatedServiceCost || 0
      );
      const discountPercentage = parseFloat(discountPercent) || 0;

      // Convert additional charge amounts to numbers
      const newAdditionalCharges = (values?.chargesData || []).map(
        (charge) => ({
          ...charge,
          amount: Number(charge.amount) || 0, // Ensure amount is a number
        })
      );

      // Calculate total additional charges
      const totalAdditionalCharges = newAdditionalCharges.reduce(
        (total, charge) => total + charge.amount,
        0
      );

      // Calculate the total before discount (service + additional charges)
      const totalBeforeDiscount = estimatedServiceCost + totalAdditionalCharges;

      // Calculate total discount amount
      const totalDiscountAmount =
        (totalBeforeDiscount * discountPercentage) / 100;

      addChargeMutate(
        {
          ...values,
          discountReasonId: selectedDiscountReason?.id
            ? selectedDiscountReason?.id
            : null, // Pass ID
          discountReason: selectedDiscountReason?.name
            ? selectedDiscountReason?.name
            : null, // Pass Name
          discountPercentage: discountPercent ? discountPercent : null,
          discountAmount: totalDiscountAmount
            ? String(totalDiscountAmount)
            : null,
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
              activityViewRefetch();
              AddChargePanel.current.hide();
              //Store new additional charges
              const newAdditionalCharges = (values?.chargesData || []).map(
                (charge) => ({
                  ...charge,
                  amount: Number(charge.amount) || 0, // Convert string to number
                })
              );
              setSavedAdditionalCharges(newAdditionalCharges);
            } else {
              toast.error(res?.data?.error);
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
  //console.log("edit items", chargeDetails);
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
            toast.error("Kindly send request");
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
            navigate(`/cases/view/${caseId}`);
          }
        },
      }
    );
  };
  const handleUpdateCash = async () => {
    // Manually trigger validation
    const isValid = await trigger(["discountReasonId"]);
    if (!isValid) {
      return;
    }

    cashMutate(
      {
        activityId: activityId,
        discountReasonId: selectedDiscountReason?.id
          ? selectedDiscountReason?.id
          : null,
        discountReason: selectedDiscountReason?.name
          ? selectedDiscountReason?.name
          : null,
        discountPercentage: discountPercent ? discountPercent : null,
        discountAmount: discountAmount ? discountAmount : null,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setVisible(false);
            navigate(`/cases/view/${caseId}`);
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
  const proceedWithSendLink = () => {
    let customerTypeName = null;
    if (customerTypeId) {
      const selectedCustomerType = nonMemberCustomerTypes.data.data.find(
        (nonMemberCustomerType) => nonMemberCustomerType.id === customerTypeId
      );
      if (selectedCustomerType) {
        customerTypeName = selectedCustomerType.name;
      }
    }

    sendLinkMutate(
      {
        activityId: activityId,
        paymentLinkSentTo: sendPaymentLinkTo,
        discountReasonId: selectedDiscountReason?.id
          ? selectedDiscountReason?.id
          : null, // Pass ID
        discountReason: selectedDiscountReason?.name
          ? selectedDiscountReason?.name
          : null, // Pass Name
        discountPercentage: discountPercent ? discountPercent : null,
        discountAmount: discountAmount ? discountAmount : null,

        customerTypeId: customerTypeId,
        customerTypeName: customerTypeName,
        legalName: legalName ? legalName : null,
        tradeName: tradeName ? tradeName : null,
        gstin: gstin ? gstin : null,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setVisible(false);
            navigate(`/cases/view/${caseId}`);
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

  const handleSendLink = async () => {
    const isValid = await trigger([
      "discountReasonId",
      "sendPaymentLinkTo",
      "customerTypeId",
      "legalName",
      "tradeName",
      "gstin",
    ]); // Manually trigger validation

    if (!isValid) {
      console.log("Validation failed!", payErrors); // Debugging
      //toast.error("Please fix validation errors before submitting.");
      return; // Stop submission if validation fails
    }

    // Proceed with normal flow
    proceedWithSendLink();
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
    const destination = mapLocation?.dropLocation
      ? mapLocation?.dropLocation
      : mapLocation?.pickupLocation; // Replace with your destination
    const waypoints = mapLocation?.dropLocation
      ? [
          {
            location: mapLocation?.pickupLocation,
          },
        ]
      : []; // Add waypoints if needed

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
          content: `<div class="asp-location"><div class="location-title">Breakdown Location</div><div class="location-detail">${
            serviceDetails?.breakdownLocation?.details?.address || "--"
          } </div></div>`,
          ariaLabel: "Breakdown Location",
        });
        const Dropwindow = mapLocation?.dropLocation
          ? new google.maps.InfoWindow({
              content: `<div class="asp-location"><div class="location-title">Drop Location</div><div class="location-detail">${
                serviceDetails?.dropLocation?.details?.address || "--"
              }</div></div>`,
              ariaLabel: "Drop Location",
            })
          : null;
        const ASPwindow = new google.maps.InfoWindow({
          content: `<div class="asp-location"><div class="location-title">ASP Location</div><div class="location-detail">${
            serviceDetails?.aspLocation?.details?.addressLineOne || ""
          }${
            serviceDetails?.aspLocation?.details?.addressLineTwo || ""
          }</div></div>`,
          ariaLabel: "ASP Location",
        });

        // Store all InfoWindows in an array for easy management
        const infoWindows = [PickupWindow, ASPwindow];
        if (Dropwindow) {
          infoWindows.push(Dropwindow);
        }

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

        // ASP Marker
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
          if (mapLocation?.dropLocation) {
            Dropwindow.close();
          }
        });
        // Breakdown Marker
        const pickupMarker = new google.maps.Marker({
          position: mapLocation?.dropLocation
            ? response?.request?.waypoints[0]?.location?.location
            : response?.request?.destination?.location,
          icon: VehicleLocationBlueMarker,
          map: map,
          title: "Breakdown Location",
        });
        pickupMarker.addListener("click", () => {
          markerClickTime = Date.now();
          PickupWindow.open({
            anchor: pickupMarker,
            map,
          });
          ASPwindow.close();
          if (mapLocation?.dropLocation) {
            Dropwindow.close();
          }
        });
        // Drop Marker
        if (mapLocation?.dropLocation) {
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
        }
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
        // console.error("Error fetching directions:", status);
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
            // console.log("driver response", res);
            toast.success(res?.data?.error);
          }
        },
      }
    );
  };

  // console.log("fields", fields);
  // Function to calculate Net Amount (Service Cost + Additional Charges)
  const calculateNetAmount = (additionalCharges) => {
    const baseAmount = Number(serviceDetails?.estimatedServiceCost || 0);

    const additionalChargesTotal = Number(
      serviceDetails?.estimatedAdditionalCharge
    );

    const netAmount = baseAmount + additionalChargesTotal;

    return netAmount;
  };

  const calculateDiscountAmount = (percentage, netAmount) => {
    if (!percentage || !netAmount) return 0;

    const discount = parseFloat((netAmount * percentage) / 100);

    return discount.toFixed(2);
  };

  useEffect(() => {
    if (serviceDetails) {
      const updatedNetAmount = calculateNetAmount(savedAdditionalCharges);
      setNetAmount(updatedNetAmount);
      setDiscountAmount(
        calculateDiscountAmount(discountPercent, updatedNetAmount)
      );
    }
  }, [serviceDetails, savedAdditionalCharges, discountPercent]);

  useEffect(() => {
    const estimatedServiceCost = parseFloat(
      serviceDetails?.estimatedServiceCost || "0"
    );
    const estimatedAdditionalCharge = parseFloat(
      serviceDetails?.estimatedAdditionalCharge || "0"
    );
    const discount = parseFloat(discountAmount || "0");
    const taxPercentage =
      parseFloat(serviceDetails?.igstTaxPercentage || "18") / 100 + 1; //

    const totalBeforeDiscount =
      estimatedServiceCost + estimatedAdditionalCharge;

    const discountedAmount = Math.max(totalBeforeDiscount - discount, 0);

    // Apply 18% GST
    const finalAmountWithGST = discountedAmount * taxPercentage;

    // Update state
    setServiceCosts(finalAmountWithGST);
  }, [
    serviceDetails?.estimatedServiceCost,
    serviceDetails?.estimatedAdditionalCharge,
    discountAmount,
    serviceDetails?.igstTaxPercentage,
  ]);

  //On page load if existing discount values available then prefill it.
  useEffect(() => {
    if (
      viewMode &&
      viewMode == "form" &&
      activityData &&
      activityData.discountPercentage &&
      activityData.discountReasonId
    ) {
      const existingDiscountPercentage = String(
        parseInt(activityData.discountPercentage)
      );
      setDiscountPercent(existingDiscountPercentage);
      setPayvalue("discountPercentage", existingDiscountPercentage);

      setSelectedDiscountReason({
        id: activityData.discountReasonId,
        name: activityData.discountReason,
      });

      setPayvalue("discountReasonId", {
        id: activityData.discountReasonId,
        name: activityData.discountReason,
      });
    }
  }, [viewMode, activityData]);

  const { data: nonMemberCustomerTypes } = useQuery(
    ["nonMemberCustomerTypeList"],
    () =>
      getConfigList({
        typeId: 85, //Non Member Customer Types
      }),
    {
      enabled: viewMode == "form" ? true : false,
    }
  );

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
        onHide={() => {
          setVisible(false);
          aspRequestRefetch();
        }}
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
                // disabled={viewMode == "view" ? true : false}
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
            <div className="info-title">Total Travel KM</div>
            <div className="info-km grey-text">
              {serviceDetails?.estimatedTotalKm
                ? serviceDetails?.estimatedTotalKm
                : "--"}{" "}
              KM{" "}
              <img
                src={InfoDarkIcon}
                style={{ cursor: "pointer" }}
                onClick={(e) => TotalKMpanel.current.toggle(e)}
              />
            </div>
          </div>

          {viewMode == "form" && activityData?.customerNeedToPay == true && (
            <div className="towing-info">
              <div className="info-title">Excess KM</div>
              <div className="info-km grey-text">
                {activityData?.additionalChargeableKm
                  ? `${activityData?.additionalChargeableKm} KM`
                  : "--"}
              </div>
            </div>
          )}

          <div className="towing-info">
            <div className="info-title">Service Cost </div>
            <div className="info-km service-cost-info gap-1">
              {activityData?.customerNeedToPay == true ? (
                <>
                  {serviceDetails?.estimatedTotalAmount ? (
                    <CurrencyFormat
                      // amount={serviceDetails?.estimatedTotalAmount}
                      // amount={discountAmount ? serviceCosts : serviceDetails?.estimatedTotalAmount}
                      amount={
                        viewMode == "view"
                          ? serviceDetails?.estimatedTotalAmount
                          : serviceCosts
                      }
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
                    <label className="form-label filter-label required">
                      Driver{" "}
                    </label>
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
                          <div className="p-error">
                            {driverFormState.errors[field.name]?.message}
                          </div>
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
                        required: "Vehicle No is required.",
                        validate: {
                          matchPattern: (v) =>
                            /^[A-Z0-9]{2}[A-Z0-9]{0,2}[A-Z0-9]{0,3}[A-Z0-9]{0,4}$/.test(
                              v
                            ) || "Please enter a valid Vehicle Number",
                        },
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
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                setNetAmount(calculateNetAmount()); // Recalculate Net Amount
                              }}
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
            <div className="towing-charges-content">
              <div className="towing-charges-title">
                ASP To Breakdown Distance
              </div>
              <div className="towing-charges-amount">
                {serviceDetails?.estimatedAspToBreakdownKm} KM
              </div>
            </div>
            {mapLocation?.dropLocation ? (
              <>
                <div className="towing-charges-content">
                  <div className="towing-charges-title">
                    Breakdown To Drop Distance
                  </div>
                  <div className="towing-charges-amount">
                    {serviceDetails?.estimatedBreakdownToDropKm} KM
                  </div>
                </div>
                <div className="towing-charges-content">
                  <div className="towing-charges-title">
                    Drop To ASP Distance
                  </div>
                  <div className="towing-charges-amount">
                    {serviceDetails?.estimatedDropToAspKm} KM
                  </div>
                </div>
              </>
            ) : (
              <div className="towing-charges-content">
                <div className="towing-charges-title">
                  Breakdown To ASP Distance
                </div>
                <div className="towing-charges-amount">
                  {serviceDetails?.estimatedAspToBreakdownKm} KM
                </div>
              </div>
            )}
          </OverlayPanel>
        </div>
        {activityData?.customerNeedToPay && viewMode == "form" && (
          <div className="towing-details-container mt-2 gap-2">
            <div className="towing-info">
              <div className="form-group radio-form-group">
                <label className="form-label">Payment Method</label>
                <Controller
                  name="paymentMethod"
                  control={payControl}
                  render={({ field, fieldState }) => (
                    <div className="common-radio-group">
                      <div className="common-radio-item">
                        <RadioButton
                          inputId="radio_yes"
                          {...field}
                          value={1}
                          checked={field.value === 1}
                          onChange={(e) => {
                            field.onChange(e.value);
                            setDiscountPercent(null);
                            setPayvalue("discountPercentage", "");
                            setSelectedDiscountReason(null);
                            setPayvalue("discountReasonId", "");
                            setDiscountAmount(null);
                            setPayvalue("discountAmount", "");
                            setPayvalue("sendPaymentLinkTo", "");
                          }}
                        />
                        <label
                          htmlFor="radio_yes"
                          className="common-radio-label"
                        >
                          Online
                        </label>
                      </div>
                      <div className="common-radio-item">
                        <RadioButton
                          inputId="radio_no"
                          {...field}
                          value={0}
                          checked={field.value === 0}
                          onChange={(e) => {
                            field.onChange(e.value);
                            setDiscountPercent(null);
                            setPayvalue("discountPercentage", "");
                            setSelectedDiscountReason(null);
                            setPayvalue("discountReasonId", "");
                            setDiscountAmount(null);
                            setPayvalue("discountAmount", "");
                            setPayvalue("sendPaymentLinkTo", "");
                          }}
                        />
                        <label
                          htmlFor="radio_no"
                          className="common-radio-label"
                        >
                          Cash
                        </label>
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>
            {(paymentMethod == 1 || paymentMethod == 0) && (
              <>
                <div className="towing-info">
                  <div className="form-group">
                    <label className="form-label">Discount (%)</label>
                    <Controller
                      name="discountPercentage"
                      control={payControl}
                      // rules={{
                      //   validate: (value) => {
                      //     console.log("Entered Value:", value); // Debugging

                      //     // Ensure value is a valid number
                      //     const num = Number(value);

                      //     // Check if it's a valid number and within the range 1-100
                      //     if (isNaN(num) || num < 1 || num > 100) {
                      //       return "Enter a valid number between 1 and 100";
                      //     }

                      //     return true; // Validation passes
                      //   },
                      // }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            id="name"
                            {...field}
                            placeholder="Enter Discount Percent"
                            maxLength={2}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value); // Store ID in form state
                              setDiscountPercent(value);

                              setSelectedDiscountReason(null);
                              setPayvalue("discountReasonId", null);
                            }}
                            className={fieldState.error ? "p-invalid" : ""}
                          />
                          {fieldState.error && (
                            <p className="error">{fieldState.error.message}</p>
                          )}
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="towing-info">
                  <div className="form-group">
                    <label
                      className={
                        discountPercent ? "form-label required" : "form-label"
                      }
                    >
                      Discount Reason
                    </label>
                    <Controller
                      name="discountReasonId"
                      control={payControl}
                      rules={{
                        required: discountPercent
                          ? "Discount Reason is required when Discount Percentage is entered"
                          : false,
                        validate: (value) => {
                          if (discountPercent && value == null) {
                            return "Discount Reason is required when Discount Percentage is entered";
                          }
                          return true;
                        },
                      }}
                      render={({ field, fieldState }) => {
                        // console.log("Discount Reason Field State:", fieldState); // Debugging

                        return (
                          <>
                            <Dropdown
                              value={field.value}
                              filter
                              placeholder="Select Discount Reason"
                              options={discountData?.data?.data}
                              optionLabel="name"
                              onChange={(e) => {
                                field.onChange(e.value); // Store ID in form state
                                setSelectedDiscountReason(e.value);
                              }}
                              className={fieldState.error ? "p-invalid" : ""}
                              style={{ width: "200px" }}
                            />
                            {fieldState.error && (
                              <div className="p-error">
                                {fieldState.error.message}
                              </div>
                            )}
                          </>
                        );
                      }}
                    />
                  </div>
                </div>
                <div className="towing-info">
                  <div className="form-group">
                    <label className="form-label ">Discount Amount</label>
                    <Controller
                      name="discountAmount"
                      control={payControl}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            id="name"
                            {...field}
                            placeholder="Discount Amount"
                            keyfilter="pnum"
                            maxLength={10}
                            disabled
                            value={discountAmount}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              setDiscountAmount(e.target.value);
                            }}
                          />
                        </>
                      )}
                    />
                  </div>
                </div>
                {paymentMethod == 1 && (
                  <div className="towing-info">
                    <div className="form-group">
                      <label className="form-label required">
                        Send Payment Link to
                      </label>
                      <Controller
                        name="sendPaymentLinkTo"
                        control={payControl}
                        rules={{
                          required: "Mobile Number is required",
                          validate: {
                            matchPattern: (v) => {
                              if (v.length > 0) {
                                return (
                                  /^([+]\d{2})?\d{10}$/.test(v) ||
                                  "Mobile Number must be a valid number"
                                );
                              } else {
                                return Promise.resolve();
                              }
                            },
                          },
                        }}
                        render={({ field, fieldState }) => (
                          <>
                            <InputText
                              id="name"
                              {...field}
                              placeholder="Enter Mobile Number"
                              keyfilter="pnum"
                              maxLength={10}
                              className={fieldState.error ? "p-invalid" : ""}
                            />
                            {fieldState.error && (
                              <div className="p-error">
                                {fieldState.error.message}
                              </div>
                            )}
                          </>
                        )}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activityData?.customerNeedToPay &&
          viewMode == "form" &&
          paymentMethod == 1 && (
            <div className="towing-details-container mt-2 gap-2">
              <div className="towing-info">
                <div className="form-group">
                  <label className="form-label required">Customer Type</label>
                  <Controller
                    name="customerTypeId"
                    control={payControl}
                    rules={{ required: "Customer Type is required." }}
                    render={({ field, fieldState }) => {
                      return (
                        <>
                          <Dropdown
                            value={field.value}
                            filter
                            placeholder="Select Customer Type"
                            options={nonMemberCustomerTypes?.data?.data}
                            optionLabel="name"
                            optionValue={"id"}
                            onChange={(e) => {
                              field.onChange(e.value);
                              setPayvalue("legalName", "");
                              setPayvalue("tradeName", "");
                              setPayvalue("gstin", "");

                              setLegalName(null);
                              setTradeName(null);
                              setGstin(null);
                            }}
                            className={fieldState.error ? "p-invalid" : ""}
                            style={{ width: "200px" }}
                          />
                          {fieldState.error && (
                            <div className="p-error">
                              {fieldState.error.message}
                            </div>
                          )}
                        </>
                      );
                    }}
                  />
                </div>
              </div>
              {customerTypeId && customerTypeId == 1150 && (
                <>
                  <div className="towing-info">
                    <div className="form-group">
                      <label className="form-label required">Legal Name</label>
                      <Controller
                        name="legalName"
                        control={payControl}
                        rules={{
                          required: "Legal Name is required.",
                        }}
                        render={({ field, fieldState }) => (
                          <>
                            <InputText
                              id="legalName"
                              {...field}
                              placeholder="Enter Legal Name"
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                setLegalName(e.target.value);
                              }}
                              maxLength={250}
                            />
                            {fieldState.error && (
                              <div className="p-error">
                                {fieldState.error.message}
                              </div>
                            )}
                          </>
                        )}
                      />
                    </div>
                  </div>

                  <div className="towing-info">
                    <div className="form-group">
                      <label className="form-label required">Trade Name</label>
                      <Controller
                        name="tradeName"
                        control={payControl}
                        rules={{
                          required: "Trade Name is required.",
                        }}
                        render={({ field, fieldState }) => (
                          <>
                            <InputText
                              id="tradeName"
                              {...field}
                              placeholder="Enter Trade Name"
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                setTradeName(e.target.value);
                              }}
                              maxLength={250}
                            />
                            {fieldState.error && (
                              <div className="p-error">
                                {fieldState.error.message}
                              </div>
                            )}
                          </>
                        )}
                      />
                    </div>
                  </div>
                  <div className="towing-info">
                    <div className="form-group">
                      <label className="form-label required">GSTIN</label>
                      <Controller
                        name="gstin"
                        control={payControl}
                        rules={{
                          required: "GSTIN is required.",
                          minLength: {
                            value: 15,
                            message: "GSTIN must have at least 15 characters",
                          },
                          maxLength: {
                            value: 15,
                            message: "GSTIN must not exceed 15 characters",
                          },
                        }}
                        render={({ field, fieldState }) => (
                          <>
                            <InputText
                              id="gstin"
                              {...field}
                              placeholder="Enter GSTIN"
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                setGstin(e.target.value);
                              }}
                            />
                            {fieldState.error && (
                              <div className="p-error">
                                {fieldState.error.message}
                              </div>
                            )}
                          </>
                        )}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

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
            {/* <button
              className="btn btn-white  gap-3_4"
              onClick={() => setVisible(false)}
            >
              Cancel
            </button> */}
            {activityData?.customerNeedToPay ? (
              <>
                {paymentMethod == 1 ? (
                  <Button
                    className="btn btn-primary gap-3_4"
                    onClick={handleSendLink}
                    loading={sendLinkMutateLoading}
                    disabled={
                      (sendPaymentLinkTo != null &&
                        serviceDetails?.aspVehicleRegistrationNumber &&
                        serviceDetails?.aspMechanic?.name) ||
                      (serviceDetails?.aspVehicleRegistrationNumber &&
                        serviceDetails?.asp?.hasMechanic == false)
                        ? false
                        : true
                    }
                  >
                    Send Link
                  </Button>
                ) : (
                  <Button
                    className="btn btn-primary gap-3_4"
                    onClick={handleUpdateCash}
                    disabled={
                      (serviceDetails?.aspVehicleRegistrationNumber &&
                        serviceDetails?.aspMechanic?.name) ||
                      (serviceDetails?.aspVehicleRegistrationNumber &&
                        serviceDetails?.asp?.hasMechanic == false)
                        ? false
                        : true
                    }
                  >
                    Update
                  </Button>
                )}
              </>
            ) : !activityData?.customerNeedToPay &&
              aspActivityStatusId == 2 ? null : (
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
                Approve
              </Button>
            )}
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

export default CaseServiceTowingDialog;
