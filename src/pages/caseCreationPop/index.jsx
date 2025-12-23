import React, { useState, useEffect } from "react";
import CustomBreadCrumb from "../../components/common/CustomBreadCrumb";
import {
  CloseIcon,
  DropDownBlueIcon,
  DropdownIcon,
  FolderIcon,
} from "../../utills/imgConstants";
import { useNavigate, useParams } from "react-router";
import { useQuery, useMutation } from "react-query";
import { Steps } from "primereact/steps";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import NewInteraction from "./NewInteraction";
import BasicInfo from "./BasicInfo";
import BreakDownLocations from "./BreakDownLocations";
import { Chip } from "primereact/chip";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import Note from "../../components/common/Note";
import RateCardSidebar from "./RateCardSidebar";
import FullEntitlementSidebar from "../../components/common/FullEntitlementSidebar";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
  CreateCaseData,
  setCaseData,
  CaseSMSId,
} from "../../../store/slices/caseSlice";
import { CurrentUser } from "../../../store/slices/userSlice";
import {
  getFormDataCreateCase,
  getCaseVehicleModel,
  getMembershipTypes,
  getEntitlementDetails,
  createCaseInfo,
  getFullServiceEntitlements,
} from "../../../services/caseService";
import moment from "moment";
import { memberShipCaseCreation } from "../../../services/masterServices";
// import { SearchCall } from "../../../store/slices/searchSlice";

const CaseCreation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [activeIndex, setActiveIndex] = useState(0);
  const [formStateTab, setFormStateTab] = useState(null);
  const [formFields, setFormFields] = useState({
    NewInteraction: {},
    BasicInfo: {},
    BreakdownLocation: {},
  });
  const [selectedAccount, setSelectedAccount] = useState();
  const [visible, setVisible] = useState(false);
  const [fullEntitlementVisible, setFullEntitlementVisible] = useState(false);
  const initialCaseData = useSelector(CreateCaseData);
  const user = useSelector(CurrentUser);
  const receivedSMSId = useSelector(CaseSMSId);
  const [initialFormData, setInitialFormData] = useState(null);
  const [clients, setClients] = useState([]);
  // const searchData = useSelector(SearchCall)

  const subServiceForm = useForm({
    defaultValues: {
      aspAutoAllocation: true,
    },
  });
  const additionalServiceForm = useForm({
    defaultValues: {
      additionalServiceAspAutoAllocation: true,
    },
  });

  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      // newinteraction form name
      contactName: "",
      mobileNumber: "",
      currentContactName: "",
      isSameasContact: "",
      currentMobileNumber: "",
      alternateMobileNumber: "",
      voiceCustomer: "",
      disposition: "",
      vehicleNo: "",
      contactLanguage: "",
      currentContactLanguage: "",
      channel: "",
      caseType: "",
      caseSubject: "",
      accidentType: "",
      specialCrane: "No",
      service: "",
      subService: "",
      condtionOfVehicle: "",
      vehicleOthers: "",
      additionalSubServiceId: null,
      irateCustomer: "No",
      womenAssist: "No",
      hasAspAssignment: "Yes",
      agentAutoAllocation: true,

      // Basic Info form
      vehicleNumber: "",
      policyNumber: "",
      basicVinNumber: "",
      vehicleType: "",
      vehicleManufacturer: "",
      vehicleModel: "",
      fuelType: "",
      saleDate: "",
      runningKm: "",
      policyType: "",
      policyEndDate: "",
      policyStartDate: "",
      serviceEligibility: "",
      policyPremium: "",

      //Break Down Location
      locationvia: "",
      sentToMobile: "",
      breakdown_location: "",
      nearestCity: "",
      lattiude_longtitude: "",
      area_id: "",
      location_customer: "",
      vehicle_location: "",
      drop_location_type: "",
      customerPreferredLocation: "",
      dealers: "",
      dealer_location: "",
      dealerToBreakdownDistance: "",
      dropToBreakdownDistance: "",
      one_time_service: false,
      dropdownlocation: "",
      dropnearest_city: "",
      droplatlng: "",
      droparea: "",
      customerStateId: "",
      customerLocation: "",
      sendPaymentLinkTo: "",
    },
  });

  const subjectValue = useWatch({ control: methods.control, name: "subject" });
  const sameAsContact = useWatch({
    control: methods.control,
    name: "isSameasContact",
  });

  const selectedContactName = useWatch({
    control: methods.control,
    name: "contactName",
  });
  const selectedMobileNumber = useWatch({
    control: methods.control,
    name: "mobileNumber",
  });
  const selectedVinNumber = useWatch({
    control: methods.control,
    name: "basicVinNumber",
  });
  const selectedVehicleRegistraion = useWatch({
    control: methods.control,
    name: "vehicleNumber",
  });
  const selectedCaseType = useWatch({
    control: methods.control,
    name: "caseType",
  });
  const selectedCaseService = useWatch({
    control: methods.control,
    name: "service",
  });
  const selectedCaseSubService = useWatch({
    control: methods.control,
    name: "subService",
  });
  const selectedPolicyNumber = useWatch({
    control: methods.control,
    name: "policyNumber",
  });
  const selectedPolicyType = useWatch({
    control: methods.control,
    name: "policyType",
  });
  const selectedPolicyStart = useWatch({
    control: methods.control,
    name: "policyStartDate",
  });
  const selectedPolicyEnd = useWatch({
    control: methods.control,
    name: "policyEndDate",
  });
  const selectedMembershipType = useWatch({
    control: methods.control,
    name: "serviceEligibility",
  });
  const selectedBreakdownLatLong = useWatch({
    control: methods.control,
    name: "lattiude_longtitude",
  });
  const selectedDealerToBreakdownDistance = useWatch({
    control: methods.control,
    name: "dealerToBreakdownDistance",
  });
  const selectedDropToBreakdownDistance = useWatch({
    control: methods.control,
    name: "dropToBreakdownDistance",
  });
  const agentAutoAllocation = useWatch({
    control: methods.control,
    name: "agentAutoAllocation",
  });
  const selectedAdditionalSubService = useWatch({
    control: methods.control,
    name: "additionalSubServiceId",
  });
  //console.log('selectedBreakdownLatLong => ', selectedBreakdownLatLong);

  //console.log("subjectValue", subjectValue);
  const errors = methods.formState.errors;
  const selectedVehicleManufacturer = useWatch({
    control: methods.control,
    name: "vehicleManufacturer",
  });

  const { data: caseVehicleModelData } = useQuery(
    ["getCaseVehicleModel", selectedVehicleManufacturer],
    () =>
      getCaseVehicleModel({
        search: memberGetData?.data?.vehicle_detail?.vehicle_model,
        apiType: "dropdown",
        vehicleMakeId: selectedVehicleManufacturer?.id,
      }),
    {
      enabled: selectedVehicleManufacturer ? true : false,
      refetchOnWindowFocus: false,
      onSuccess: (res) => {
        console.log("response", res);
        if (res?.data?.success) {
          const selectedModel = res?.data?.data?.find(
            (el) =>
              el.name.toLowerCase() ==
              memberGetData?.data?.vehicle_details?.vehicle_model?.toLowerCase()
          );

          if (selectedModel) {
            methods.setValue("vehicleModel", selectedModel);
          }
        }
      },
    }
  );
  console.log("selectedPolicyNumber", selectedPolicyNumber);
  const {
    data: fullEntitlementServiceData,
    mutate: fullEntitlementServiceMutate,
  } = useMutation(getFullServiceEntitlements);

  const {
    data: caseCreateMutateData,
    mutate: createCaseMutate,
    isLoading: caseCreateLoading,
  } = useMutation(createCaseInfo);

  const {
    data: caseMembershipListData,
    mutate: caseMembershipListMutate,
    isLoading: caseMembershipListLoading,
  } = useMutation(getMembershipTypes);

  const {
    data: memberGetData,
    mutate: memberMutate,
    isLoading: memberLoading,
  } = useMutation(memberShipCaseCreation);

  const { data: caseGetFormData, isLoading: caseFormDataMutateLoading } =
    useQuery(
      ["getFormDataCreateCase", id],
      () =>
        getFormDataCreateCase({
          id: id,
        }),
      {
        enabled: id ? true : false,
        refetchOnWindowFocus: false,
        onSuccess: (response) => {
          console.log("Get Form Data Response => ", response?.data);
          if (response?.data?.success) {
            setInitialFormData(response?.data?.data);
            setClients([
              {
                id: response?.data?.data?.clientId,
                name: response?.data?.data?.clientName,
              },
            ]);

            //case creation membership details used to get fuel type,policies,vehicle details
            memberMutate(
              {
                clientName: response?.data?.data?.clientName,
                vin: response?.data?.data?.vin || "",
                vehicleRegistrationNumber:
                  response?.data?.data?.vehicleRegistrationNumber || null,
                mobileNumber: response?.data?.data?.mobileNumber || null,
                policyNumber: response?.data?.data?.policyNumber || null,
              },
              {
                onSuccess: (res) => {
                  //  console.log('Get Membership List Response => ', res?.data);

                  if (res?.data?.success) {
                    methods.setValue(
                      "fuelType",
                      res?.data?.fuelTypes?.find(
                        (item) =>
                          item?.name?.toLowerCase() ===
                          res?.data?.vehicle_details?.fuel_type?.toLowerCase()
                      )?.id || null
                    );
                    if (res?.data?.vehicle_details?.registration_number) {
                      methods.setValue(
                        "vehicleNumber",
                        res?.data?.vehicle_details?.registration_number
                      );
                    }
                    if (res?.data?.vehicle_details?.vi_number) {
                      methods.setValue(
                        "basicVinNumber",
                        res?.data?.vehicle_details?.vi_number
                      );
                    }

                    if (res?.data?.vehicle_details) {
                      methods.setValue(
                        "vehicleType",
                        response?.data?.data?.extras?.vehicleTypes?.find(
                          (item) =>
                            item?.name?.toLowerCase() ==
                            res?.data?.vehicle_details?.vehicle_type?.toLowerCase()
                        )
                      );
                    }
                    if (res?.data?.vehicle_details) {
                      methods.setValue(
                        "vehicleManufacturer",
                        response?.data?.data?.extras?.vehicleMakes?.find(
                          (item) =>
                            item?.name?.toLowerCase() ==
                            res?.data?.vehicle_details?.vehicle_make?.toLowerCase()
                        )
                      );
                    }

                    if (res?.data?.policy_detail) {
                      methods.setValue(
                        "saleDate",
                        moment(res?.data?.policy_detail?.sale_date).toDate()
                      );
                    }

                    if (res?.data?.policy_detail) {
                      methods.setValue(
                        "policyType",
                        response?.data?.data?.extras?.policyTypes?.find(
                          (item) =>
                            item?.name?.toLowerCase() ==
                            res?.data?.policy_detail?.policy_type?.toLowerCase()
                        )
                      );
                    } else {
                      methods.setValue(
                        "policyType",
                        response?.data?.data?.extras?.policyTypes?.find(
                          (item) => item?.id == 434
                        )
                      );
                    }
                    if (res?.data?.policy_detail) {
                      methods.setValue(
                        "policyNumber",
                        res?.data?.policy_detail?.policy_number
                          ?.toString()
                          ?.toUpperCase()
                      );
                    }
                    if (res?.data?.policy_detail?.start_date) {
                      methods.setValue(
                        "policyStartDate",
                        moment(res?.data?.policy_detail?.start_date).toDate()
                      );
                    }

                    if (res?.data?.policy_detail?.end_date) {
                      methods.setValue(
                        "policyEndDate",
                        moment(res?.data?.policy_detail?.end_date).toDate()
                      );
                    }

                    if (res?.data?.policy_detail) {
                      fullEntitlementServiceMutate({
                        clientId: response?.data?.data?.clientId,
                        vin:
                          response?.data?.data?.vin ||
                          res?.data?.vehicle_details?.vi_number ||
                          null,
                        vehicleRegistrationNumber:
                          response?.data?.data?.vehicleRegistrationNumber ||
                          res?.data?.vehicle_details?.registration_number ||
                          null,
                        // policyTypeId: response?.data?.data?.extras?.policyDetails?.policy_type ?
                        // response?.data?.data?.extras?.policyTypes?.find((item) => item?.name?.toLowerCase() == response?.data?.data?.extras?.policyDetails?.policy_type?.toLowerCase())?.id : 434,
                        policyTypeId: res?.data?.policy_detail
                          ? response?.data?.data?.extras?.policyTypes?.find(
                              (item) =>
                                item?.name?.toLowerCase() ==
                                res?.data?.policy_detail?.policy_type?.toLowerCase()
                            )?.id
                          : 434,
                        // policyNumber: response?.data?.data?.extras?.policyDetails?.policy_number || null, //nullable
                        policyNumber:
                          res?.data?.policy_detail?.policy_number || null, //nullable
                        // membershipTypeId: response?.data?.data?.extras?.policyDetails?.membership_type_id || null, // policyTypeId rsa means required.
                        membershipTypeId:
                          res?.data?.policy_detail?.membership_type_id || null,
                        typeId: 1,
                        policyStartDate:
                          res?.data?.policy_detail?.start_date || null,
                        policyEndDate:
                          res?.data?.policy_detail?.end_date || null,
                      });
                    }
                    caseMembershipListMutate(
                      { clientName: response?.data?.data?.clientName },
                      {
                        onSuccess: (resp) => {
                          //  console.log('Get Membership List Response => ', res?.data);
                          if (resp?.data?.success) {
                            methods.setValue(
                              "serviceEligibility",
                              resp?.data?.membership_types?.find(
                                (item) =>
                                  item?.id ==
                                  res?.data?.policy_detail?.membership_type_id
                              )
                            );
                          } else {
                            if (resp?.data?.error) {
                              toast.error(resp?.data?.error);
                            } else if (
                              resp?.data?.errors &&
                              resp?.data?.errors.constructor === Array
                            ) {
                              resp?.data?.errors?.forEach((el) =>
                                toast.error(el)
                              );
                            } else {
                              toast.error(resp?.data?.errors);
                            }
                          }
                        },
                      }
                    );
                  } else {
                    if (res?.data?.error) {
                      toast.error(res?.data?.error);
                    } else if (
                      res?.data?.errors &&
                      res?.data?.errors.constructor === Array
                    ) {
                      res?.data?.errors?.forEach((el) => toast.error(el));
                    } else {
                      toast.error(res?.data?.errors);
                    }
                  }
                },
              }
            );

            //Set Default Values in Basic Info

            if (response?.data?.data?.vin) {
              console.log("entered", "response");
              methods.setValue(
                "basicVinNumber",
                response?.data?.data?.vin?.toString()?.toUpperCase()
              );
            }

            if (response?.data?.data?.vehicleRegistrationNumber) {
              console.log("entered", "response");
              methods.setValue(
                "vehicleNumber",
                response?.data?.data?.vehicleRegistrationNumber
                  ?.toString()
                  ?.toUpperCase()
              );
            }
            // Set Default Values in New Interaction Form
            if (response?.data?.data?.contactName) {
              methods.setValue(
                "contactName",
                response?.data?.data?.contactName?.toString()?.toUpperCase()
              );
              methods.setValue("isSameasContact", true);
            }
            if (response?.data?.data?.mobileNumber) {
              methods.setValue(
                "mobileNumber",
                response?.data?.data?.mobileNumber
              );
            }
            if (response?.data?.data?.mobileNumber) {
              methods.setValue(
                "alternateMobileNumber",
                response?.data?.data?.mobileNumber
              );
            }
            /* if(response?.data?.data?.vehicleRegistrationNumber) {
          methods.setValue("vehicleNo", response?.data?.data?.vehicleRegistrationNumber);
        } */
            if (response?.data?.data?.dispositionId) {
              methods.setValue(
                "disposition",
                response?.data?.data?.extras?.dispositions?.find(
                  (item) => item?.id == response?.data?.data?.dispositionId
                )
              );
            }
            if (response?.data?.data?.contactLanguageId) {
              methods.setValue(
                "contactLanguage",
                response?.data?.data?.extras?.contactLanguages?.find(
                  (item) => item?.id == response?.data?.data?.contactLanguageId
                )
              );
            }
            // if (response?.data?.data?.currentContactLanguageId) {
            //   methods.setValue(
            //     "currentContactLanguage",
            //     response?.data?.data?.extras?.currentContactLanguages?.find(
            //       (item) =>
            //         item?.id == response?.data?.data?.currentContactLanguageId
            //     )
            //   );
            // }
            if (response?.data?.data?.channelId) {
              methods.setValue(
                "channel",
                response?.data?.data?.extras?.caseChannels?.find(
                  (item) => item?.id == response?.data?.data?.channelId
                )
              );
            }

            /* if (response?.data?.data?.extras?.policyDetails?.vehicle_model) {
          methods.setValue(
            "vehicleModel",
            caseVehicleModelData?.data?.data?.find(
              (item) =>
                item?.name?.toLowerCase() ==
                response?.data?.data?.extras?.policyDetails?.vehicle_model?.toLowerCase()
            )
          );
        } */
          } else {
            if (response?.data?.error) {
              toast.error(response?.data?.error);
            } else if (
              response?.data?.errors &&
              response?.data?.errors.constructor === Array
            ) {
              response?.data?.errors?.forEach((el) => toast.error(el));
            } else {
              toast.error(response?.data?.errors);
            }
          }
        },
      }
    );

  useEffect(() => {
    console.log("Same as Contact", sameAsContact);
    if (sameAsContact) {
      methods.setValue("currentContactName", selectedContactName);
      methods.setValue("currentMobileNumber", selectedMobileNumber);
    } else {
      methods.setValue("currentContactName", "");
      methods.setValue("currentMobileNumber", "");
    }
  }, [sameAsContact]);

  const { data: entitlementDetailsData, mutate: entitlementDetailsMutate } =
    useMutation(getEntitlementDetails);

  useEffect(() => {
    if (
      selectedAccount &&
      selectedContactName &&
      selectedMobileNumber &&
      selectedVinNumber &&
      selectedCaseType &&
      selectedCaseService &&
      // selectedCaseSubService &&
      // selectedPolicyStart &&
      // selectedPolicyEnd &&
      // selectedMembershipType &&
      // selectedPolicyType
      caseGetFormData?.data?.data?.extras
    ) {
      entitlementDetailsMutate(
        {
          clientId: selectedAccount?.id,
          customerName: selectedContactName,
          customerContactNumber: selectedMobileNumber,
          vin: selectedVinNumber,
          vehicleRegistrationNumber: selectedVehicleRegistraion
            ? selectedVehicleRegistraion
            : null, // nullable
          caseTypeId: selectedCaseType?.id,
          serviceId: selectedCaseService?.id,
          subServiceId: selectedCaseSubService?.id || null,
          // policyTypeId: selectedPolicyType?.id,

          policyTypeId: memberGetData?.data?.policy_detail?.policy_type
            ? caseGetFormData?.data?.data?.extras?.policyTypes?.find(
                (item) =>
                  item?.name?.toLowerCase() ==
                  memberGetData?.data?.policy_detail?.policy_type?.toLowerCase()
              )?.id
            : 434,

          policyNumber: memberGetData?.data?.policy_detail?.policy_number
            ? memberGetData?.data?.policy_detail?.policy_number
            : null, //nullable
          policyStartDate: memberGetData?.data?.policy_detail
            ? moment(memberGetData?.data?.policy_detail?.start_date).format(
                "YYYY-MM-DD"
              )
            : null,
          policyEndDate: memberGetData?.data?.policy_detail
            ? moment(memberGetData?.data?.policy_detail?.end_date).format(
                "YYYY-MM-DD"
              )
            : null,
          membershipTypeId: selectedMembershipType
            ? selectedMembershipType?.id
            : null, // policyTypeId RSA means required.
          breakdownToDropDistance: selectedDealerToBreakdownDistance
            ? selectedDealerToBreakdownDistance
            : selectedDropToBreakdownDistance
            ? selectedDropToBreakdownDistance
            : null, // service is towing means required (Field: Dealer to Breakdown Distance)
          bdLat: selectedBreakdownLatLong
            ? selectedBreakdownLatLong?.lat.toString()
            : null,
          bdLong: selectedBreakdownLatLong
            ? selectedBreakdownLatLong?.lng.toString()
            : null,
        },
        {
          onSuccess: (res) => {
            console.log("Service Entitlement Res =>", res);
            if (res?.data?.success && res?.data?.data?.notes?.isNonMember) {
              // if (memberGetData?.data?.policy_detail?.policy_type) {
              //   methods.setValue(
              //     "policyType",
              //     caseGetFormData?.data?.data?.extras?.policyTypes?.find(
              //       (item) => item?.id == 434
              //     )
              //   );
              // }
              // if (memberGetData?.data?.policy_detail?.policy_number) {
              //   methods.resetField("policyNumber");
              // }
              // if (memberGetData?.data?.policy_detail?.start_date) {
              //   methods.resetField("policyStartDate");
              // }
              // if (memberGetData?.data?.policy_detail?.end_date) {
              //   methods.resetField("policyEndDate");
              // }
            } else {
              if (memberGetData?.data?.policy_detail?.policy_type) {
                methods.setValue(
                  "policyType",
                  caseGetFormData?.data?.data?.extras?.policyTypes?.find(
                    (item) =>
                      item?.name?.toLowerCase() ==
                      memberGetData?.data?.policy_detail?.policy_type?.toLowerCase()
                  )
                );
              }
              if (memberGetData?.data?.policy_detail?.policy_number) {
                methods.setValue(
                  "policyNumber",
                  memberGetData?.data?.policy_detail?.policy_number
                );
              }
              if (memberGetData?.data?.policy_detail?.start_date) {
                methods.setValue(
                  "policyStartDate",
                  moment(
                    memberGetData?.data?.policy_detail?.start_date
                  ).toDate()
                );
              }
              if (memberGetData?.data?.policy_detail?.end_date) {
                methods.setValue(
                  "policyEndDate",
                  moment(memberGetData?.data?.policy_detail?.end_date).toDate()
                );
              }
            }
            if (
              res?.data?.success &&
              !res?.data?.data?.notes?.customerNeedToPay
            ) {
              methods.resetField("customerStateId");
              methods.resetField("customerLocation");
              methods.resetField("sendPaymentLinkTo");
            }
          },
        }
      );
    }
  }, [
    selectedAccount,
    selectedContactName,
    selectedMobileNumber,
    selectedVinNumber,
    selectedVehicleRegistraion,
    selectedCaseType,
    selectedCaseService,
    selectedCaseSubService,
    /* selectedPolicyNumber,
    selectedPolicyType,
    selectedPolicyStart,
    selectedPolicyEnd, */
    caseGetFormData?.data?.data?.extras,
    selectedMembershipType,
    selectedBreakdownLatLong,
    selectedDealerToBreakdownDistance,
    selectedDropToBreakdownDistance,
  ]);

  const items = [
    {
      label: "New Interaction",
      content: (
        <NewInteraction
          formOptions={{
            dispositions: caseGetFormData?.data?.data?.extras?.dispositions,
            contactLanguages:
              caseGetFormData?.data?.data?.extras?.contactLanguages,
            currentContactLanguages:
              caseGetFormData?.data?.data?.extras?.currentContactLanguages,
            channels: caseGetFormData?.data?.data?.extras?.caseChannels,
            caseTypes: caseGetFormData?.data?.data?.extras?.caseTypes,
            accidentTypes:
              caseGetFormData?.data?.data?.extras?.caseAccidentTypes,
            caseSubjects: caseGetFormData?.data?.data?.extras?.caseSubjects,
            conditionOfVehicles:
              caseGetFormData?.data?.data?.extras?.conditionOfVehicles,
            towingAdditionalSubServices:
              caseGetFormData?.data?.data?.extras?.towingAdditionalSubServices,
            mobileNumber: caseGetFormData?.data?.data?.mobileNumber,
            contactName: caseGetFormData?.data?.data?.contactName,
          }}
          setFullEntitlementVisible={setFullEntitlementVisible}
          formErrors={formFields?.NewInteraction?.errors}
          entitlementData={
            selectedCaseType && selectedCaseService
              ? entitlementDetailsData?.data?.data
              : { result: fullEntitlementServiceData?.data?.data }
          }
          client={selectedAccount}
          existCustomer={caseGetFormData?.data?.data?.existCustomer}
          subServiceForm={subServiceForm}
          additionalServiceForm={additionalServiceForm}
        />
      ),
      className:
        formFields?.NewInteraction.errors &&
        Object.keys(formFields?.NewInteraction.errors).length == 0
          ? "step-complete"
          : "not-complete",
    },
    {
      label: "Basic Info",
      content: (
        <BasicInfo
          formOptions={{
            vehicleTypes: caseGetFormData?.data?.data?.extras?.vehicleTypes,
            vehicleManufacturers:
              caseGetFormData?.data?.data?.extras?.vehicleMakes,
            vehicleModels: caseVehicleModelData?.data?.data,
            // fuelTypes: caseGetFormData?.data?.data?.extras?.fuelTypes,
            fuelTypes: memberGetData?.data?.fuelTypes,
            // saleDates: caseGetFormData?.data?.data?.extras?.saleDates,
            // runningKm: caseGetFormData?.data?.data?.extras?.runningKm,
            policyTypes: caseGetFormData?.data?.data?.extras?.policyTypes,
            eligbilityServices: caseMembershipListData?.data?.membership_types,
            policyPremiums: caseGetFormData?.data?.data?.extras?.policyPremiums,
            policyDetails: memberGetData?.data?.policy_detail,
          }}
          setFullEntitlementVisible={setFullEntitlementVisible}
          formErrors={formFields?.BasicInfo?.errors}
          entitlementData={
            selectedCaseType && selectedCaseService
              ? entitlementDetailsData?.data?.data
              : { result: fullEntitlementServiceData?.data?.data }
          }
          client={selectedAccount}
          existCustomer={caseGetFormData?.data?.data?.existCustomer}
          methods={methods}
          // vehicleRegistrationNumber={caseGetFormData?.data?.data?.vehicleRegistrationNumber}
          // vin={caseGetFormData?.data?.data?.vin }
          vehicleRegistrationNumber={
            caseGetFormData?.data?.data?.vehicleRegistrationNumber != null ||
            memberGetData?.data?.vehicle_details?.registration_number
              ? true
              : false
          }
          vin={
            caseGetFormData?.data?.data?.vin != null ||
            memberGetData?.data?.vehicle_details?.vi_number != null
              ? true
              : false
          }
        />
      ),
      className:
        formFields?.BasicInfo.errors &&
        Object.keys(formFields?.BasicInfo.errors).length == 0
          ? "step-complete"
          : "not-complete",
    },
    {
      label: "Get Breakdown Location",
      content: (
        <BreakDownLocations
          formErrors={formFields?.BreakdownLocation?.errors}
          formOptions={{
            locationVia: caseGetFormData?.data?.data?.extras?.locationViaTypes,
            customerVehicleLocations:
              caseGetFormData?.data?.data?.extras?.customerVehicleLocations,
            manualLocationReasons:
              caseGetFormData?.data?.data?.extras?.manualLocationReasons,
            dropLocationTypes:
              caseGetFormData?.data?.data?.extras?.dropLocationTypes,
            customerPreferredLocations:
              caseGetFormData?.data?.data?.extras?.customerPreferredLocations,
          }}
          client={selectedAccount}
          setFullEntitlementVisible={setFullEntitlementVisible}
          entitlementData={
            selectedCaseType && selectedCaseService
              ? entitlementDetailsData?.data?.data
              : { result: fullEntitlementServiceData?.data?.data }
          }
          existCustomer={caseGetFormData?.data?.data?.existCustomer}
        />
      ),
      className:
        formFields?.BreakdownLocation.errors &&
        Object.keys(formFields?.BreakdownLocation.errors).length == 0
          ? "step-complete"
          : "not-complete",
    },
  ];
  // console.log("items", items);

  // Breadcrumbs Menu
  const MenuItems = [
    {
      label: <div onClick={() => navigate("/")}>Home</div>,
    },
    { label: <div>New Case</div> },
  ];

  const handleClose = () => {
    navigate("/");
  };
  const handleNext = () => {
    formValidate();
    setActiveIndex(activeIndex + 1);
  };
  const formValidate = () => {
    methods.trigger(Object.keys(methods.getValues()));
    setFormStateTab(activeIndex);
  };
  const handleBack = () => {
    setActiveIndex(activeIndex - 1);
  };

  useEffect(() => {
    //To get and set Tab errors
    if (
      (formStateTab && Object.keys(errors).length > 0) ||
      formStateTab !== null
    ) {
      //console.log("error completed");
      const Tabname = Object.keys(formFields)[formStateTab];

      const TabErrors = {
        [Tabname]: { errors: { ...errors }, tabkey: formStateTab },
      };
      //console.log("tab name", Tabname, TabErrors);

      setFormFields({
        ...formFields,
        ...TabErrors,
      });
    }
  }, [JSON.stringify(errors), formStateTab, caseGetFormData?.data?.data]);

  useEffect(() => {
    if (clients?.length > 0) {
      setSelectedAccount(clients[0]);
    }
  }, [clients]);

  // console.log("formFields", formFields);
  console.log("memberGetData", caseGetFormData);
  const onErrorTab = (formData) => {
    let errorTabs = Object.values(formFields);
    console.log("onErrorTab =>", errorTabs);
    errorTabs.splice(-1); // For Ignore Last Tab errors
    console.log("errorTabs", errorTabs);
    console.log("Create Payload data => ", formData);
    const Errortabkey = errorTabs?.find(
      (el) => el?.errors && Object.values(el?.errors)?.length > 0
    )?.tabkey;
    console.log("errortabkey", Errortabkey);
    if (Errortabkey !== undefined && activeIndex == items.length - 1) {
      setActiveIndex(Errortabkey);
      toast.error("Please fill the required fields to create a Case");
    } else {
      if (formData?.area_id?.id == undefined) {
        // toast.error("Please Select a Valid Breakdown Area");
        toast.error("Please fill the required fields to create a Case");
      } else if (
        formData?.dropdownlocation?.description &&
        formData?.droparea?.id == undefined
      ) {
        toast.error("Please Select a Valid Drop Area");
      } else {
        console.log(
          "entitlementDetailsData?.data?.data?.notes?.customerNeedToPa",
          entitlementDetailsData?.data
        );
        //API Mutation
        createCaseMutate(
          {
            tempCaseFormDetailId: id,
            registrationNumber: formData?.vehicleNumber,
            subjectId: formData?.caseSubject?.id,
            typeId: 31,
            vin: formData?.basicVinNumber,
            vehicleTypeId: formData?.vehicleType?.id,
            vehicleMakeId: formData?.vehicleManufacturer?.id,
            vehicleModelId: formData?.vehicleModel?.id,
            clientId: selectedAccount?.id,
            customerContactName: formData?.contactName,
            customerMobileNumber: formData?.mobileNumber,
            customerCurrentContactName: formData?.currentContactName,
            customerCurrentMobileNumber: formData?.currentMobileNumber,
            customerAlternateMobileNumber:
              formData?.alternateMobileNumber || null,
            voiceOfCustomer: formData?.voiceCustomer,
            dispositionId: formData?.disposition?.id,
            contactLanguageId: formData?.contactLanguage?.id,
            customerCurrentContactLanguageId:
              formData?.currentContactLanguage?.id || null,
            channelId: formData?.channel?.id,
            caseTypeId: formData?.caseType?.id,
            accidentTypeId: formData?.accidentType?.id,
            specialCraneNeeded: formData?.specialCrane == "Yes" ? true : false,
            serviceId: formData?.service?.id,
            subServiceId: formData?.subService?.id,
            conditionOfVehicleId: formData?.condtionOfVehicle?.id,
            conditionOfVehicleOthers: formData?.vehicleOthers || null,
            ...(formData?.service?.id == 1
              ? {
                  additionalServiceId:
                    caseGetFormData?.data?.data?.extras
                      ?.towingAdditionalServiceId,
                  additionalSubServiceId:
                    formData?.additionalSubServiceId?.id || null,
                  ...(formData?.additionalSubServiceId?.id !== null &&
                  formData?.additionalSubServiceId?.id !== undefined
                    ? {
                        // hasAspAssignment: formData?.hasAspAssignment == "Yes" ? true : false,
                        hasAspAssignment:
                          formData?.additionalSubServiceId?.hasAspAssignment,
                      }
                    : {}),
                }
              : {}),
            irateCustomer: formData?.irateCustomer == "Yes" ? true : false,
            womenAssist: formData?.womenAssist == "Yes" ? true : false,
            policyNumber: formData?.policyNumber || null,
            fuelTypeId: formData?.fuelType?.id,
            saleDate: moment(formData?.saleDate).format("YYYY-MM-DD"),
            runningKm: formData?.runningKm || null,
            policyTypeId: formData?.policyType?.id,
            policyStartDate: formData?.policyStartDate
              ? moment(formData?.policyStartDate).format("YYYY-MM-DD")
              : null,
            policyEndDate: formData?.policyEndDate
              ? moment(formData?.policyEndDate).format("YYYY-MM-DD")
              : null,
            hasActivePolicy: memberGetData?.data?.policy_detail?.policy_type
              ? true
              : false,
            serviceEligibilityId: formData?.serviceEligibility?.id || null,
            serviceEligibility: formData?.serviceEligibility?.name || null,
            policyPremiumId: formData?.policyPremium?.id,
            getLocationViaId: formData?.locationvia?.id,
            reasonForManualLocationId: formData?.locationreason?.id,
            sentToMobile: formData?.sentToMobile || null,
            locationLogId: formData?.sentToMobile ? receivedSMSId : null,
            breakdownLocation: formData?.breakdownlocation?.description,
            nearestCity: formData?.nearestCity,
            breakdownLat: formData?.lattiude_longtitude?.lat?.toString(),
            breakdownLong: formData?.lattiude_longtitude?.lng?.toString(),
            breakdownAreaId: formData?.area_id?.id || null,
            // customerLocation: formData?.location_customer,
            vehicleLocationId: formData?.vehicle_location?.id,
            dropLocationTypeId: formData?.drop_location_type?.id || null,
            customerPreferredLocationId:
              formData?.customerPreferredLocation?.id || null,
            dropDealerId: formData?.dealers?.id || null,
            dropLocationLat:
              formData?.dealers?.latitude ||
              formData?.droplatlng?.lat?.toString() ||
              null,
            dropLocationLong:
              formData?.dealers?.longitude ||
              formData?.droplatlng?.lng?.toString() ||
              null,
            dropLocation:
              formData?.dealer_location ||
              formData?.dropdownlocation?.description ||
              null,
            dropAreaId: formData?.droparea?.id || null,
            breakdownToDropLocationDistance:
              formData?.dealerToBreakdownDistance ||
              formData?.dropToBreakdownDistance ||
              null,
            customerCityId: formData?.city || null,
            customerStateId: formData?.customerStateId?.id || null,
            customerLocation: formData?.customerLocation?.description || null,
            sendPaymentLinkTo: formData?.sendPaymentLinkTo || null,
            customerNeedToPay:
              entitlementDetailsData?.data?.data?.notes?.customerNeedToPay,
            nonMembershipType:
              entitlementDetailsData?.data?.data?.notes?.nonMembershipType ||
              null,
            additionalChargeableKm:
              entitlementDetailsData?.data?.data?.notes?.additionalChargeableKm.toString(),
            // "sendPaymentLinkTo": "1234567890",
            notes: entitlementDetailsData?.data?.data?.notes?.message || null,
            //subService auto allocation
            serviceIsImmediate:
              subServiceForm?.getValues("serviceIsImmediate")?.[0] ==
              "Immediate"
                ? true
                : false,
            serviceInitiatingAt:
              subServiceForm?.getValues("serviceIsImmediate")?.[0] == "Later"
                ? moment(
                    subServiceForm?.getValues("serviceInitiatingAt"),
                    "ddd MMM DD YYYY HH:mm:ss [GMT]Z"
                  ).format("YYYY-MM-DD HH:mm:ss")
                : "",
            serviceExpectedAt:
              subServiceForm?.getValues("serviceIsImmediate")?.[0] == "Later"
                ? moment(
                    subServiceForm?.getValues("serviceExpectedAt"),
                    "ddd MMM DD YYYY HH:mm:ss [GMT]Z"
                  ).format("YYYY-MM-DD HH:mm:ss")
                : "",
            aspAutoAllocation: selectedCaseSubService?.hasAspAssignment
              ? subServiceForm?.getValues("aspAutoAllocation")
              : null,
            //Additional service auto allocation
            additionalServiceIsImmediate: formData?.additionalSubServiceId?.id
              ? formData?.additionalSubServiceId?.id != undefined &&
                additionalServiceForm?.getValues(
                  "additionalServiceIsImmediate"
                )?.[0] == "Immediate"
                ? true
                : false
              : null,
            additionalServiceInitiatingAt:
              formData?.additionalSubServiceId?.id != undefined &&
              additionalServiceForm?.getValues(
                "additionalServiceIsImmediate"
              )?.[0] == "Later"
                ? moment(
                    additionalServiceForm?.getValues(
                      "additionalServiceInitiatingAt"
                    ),
                    "ddd MMM DD YYYY HH:mm:ss [GMT]Z"
                  ).format("YYYY-MM-DD HH:mm:ss")
                : "",
            additionalServiceExpectedAt:
              formData?.additionalSubServiceId?.id != undefined &&
              additionalServiceForm?.getValues(
                "additionalServiceIsImmediate"
              )?.[0] == "Later"
                ? moment(
                    additionalServiceForm?.getValues(
                      "additionalServiceExpectedAt"
                    ),
                    "ddd MMM DD YYYY HH:mm:ss [GMT]Z"
                  ).format("YYYY-MM-DD HH:mm:ss")
                : "",
            additionalServiceAspAutoAllocation:
              formData?.additionalSubServiceId?.id != undefined
                ? selectedAdditionalSubService?.hasAspAssignment
                  ? additionalServiceForm?.getValues(
                      "additionalServiceAspAutoAllocation"
                    )
                  : null
                : false,
            agentAutoAllocation:
              user?.levelId == 1045 || user?.levelId == 1046
                ? true
                : subServiceForm?.getValues("serviceIsImmediate")?.[0] ==
                    "Immediate" ||
                  additionalServiceForm?.getValues(
                    "additionalServiceIsImmediate"
                  )?.[0] == "Immediate"
                ? agentAutoAllocation == true
                  ? false
                  : true
                : false,
            // monitorUcid:searchData?.monitorUcid ? searchData?.monitorUcid : "",
          },
          {
            onSuccess: (response) => {
              if (response?.data?.success) {
                setActiveIndex(0);
                dispatch(
                  setCaseData({
                    createCase: null,
                    caseSMSId: null,
                    existingCaseSMSId: null,
                  })
                );
                navigate("/cases");
                toast.success("Case created successfully!", {
                  autoClose: 1000,
                });
                methods.reset();
              } else {
                if (response?.data?.error) {
                  toast.error(response?.data?.error);
                } else {
                  response?.data?.errors?.forEach((el) => toast.error(el));
                }
              }
            },
          }
        );
      }
    }
  };

  const onSubmit = (data) => {
    //console.log("Create Payload data => ", data);

    setFormStateTab(activeIndex);
    onErrorTab(data); //To Move error Tab
    console.log("formData", data);
  };

  const onError = (errors) => {
    console.log("errors", errors);
    console.log("item =>", items);
    if (items?.length == 1) {
      const TabErrors = {
        NewInteraction: { errors: { ...errors }, tabkey: formStateTab },
      };
      setFormFields({
        ...formFields,
        ...TabErrors,
      });
    } else {
      setFormStateTab(activeIndex);
      onErrorTab(errors); //To Move error Tab
    }
  };
  // console.log("activeIndex", activeIndex);
  return (
    <div className="page-wrap">
      <CustomBreadCrumb items={MenuItems} milestone={false} />
      <div className="page-body">
        <div className="page-content-wrap steps-form-page">
          <div className="page-content-header">
            <div className="d-flex align-items-center justify-content-between">
              <div className="page-content-title-wrap">
                <div className="page-content-title-icon">
                  <img
                    className="img-fluid"
                    src={FolderIcon}
                    alt="Title Icon"
                  />
                </div>
                <div className="d-flex gap-1_2 align-items-center">
                  <h5 className="page-content-title">New Case</h5>
                  <Dropdown
                    className="account-select"
                    value={selectedAccount}
                    placeholder="Select Account"
                    options={clients}
                    dropdownIcon={(options) => (
                      <DropDownBlueIcon {...options.iconProps} />
                    )}
                    disabled
                    optionLabel="name"
                    onChange={(e) => setSelectedAccount(e.value)}
                  />
                  {!selectedAccount && (
                    <Note
                      type={"danger"}
                      icon={true}
                      purpose={"note"}
                      style={{ padding: "6px 16px 6px 10px" }}
                    >
                      <div className="account-note">
                        Select Account to create a case.
                      </div>
                    </Note>
                  )}
                  {/* <Chip
                    label="Royal Sundaram Diversion"
                    className="info-chip blue reminder-chip"
                  /> */}
                </div>
              </div>
              <div className="page-content-header-right">
                {/* <div className="header-progressbar-wrap">
              <div className="header-progressbar-details  ">
                <span className="header-progressbar-label">
                  Completetion Percentage
                </span>
                <span className="header-progressbar-value">50 %</span>
              </div>
              <ProgressBar value={50} showValue={false}></ProgressBar>
            </div> */}
                <button className="btn btn-close" onClick={handleClose}>
                  <img className="img-fluid" src={CloseIcon} alt="Close" />
                </button>
              </div>
            </div>
            <div>
              <Steps
                model={items}
                activeIndex={activeIndex}
                onSelect={(e) => {
                  if (e.index !== activeIndex) {
                    //To avoid State update on same Index Click
                    setActiveIndex(e.index);
                    formValidate();
                  }
                }}
                readOnly={false}
              />
            </div>
          </div>
          <div className="page-content-body">
            <FormProvider {...methods}>
              <form
                id="hook-form"
                onSubmit={methods.handleSubmit(onSubmit, onError)}
              >
                {items[activeIndex]["content"]}
              </form>
            </FormProvider>
          </div>
          <div className="page-content-footer">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex gap-2 ms-auto">
                {activeIndex !== 0 && (
                  <button
                    type="button"
                    className="btn btn-white"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                )}
                {items.length - 1 !== activeIndex && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                )}
                {items.length - 1 == activeIndex && (
                  <Button
                    className="btn btn-primary"
                    type="submit"
                    form="hook-form"
                    loading={caseCreateLoading}
                  >
                    Submit
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {entitlementDetailsData?.data?.data?.notes?.customerNeedToPay == true && (
        <div className="rate-card-container" onClick={() => setVisible(true)}>
          Rate Card
        </div>
      )}
      <RateCardSidebar
        visible={visible}
        setVisible={setVisible}
        client={selectedAccount}
        service={selectedCaseService}
      />
      <FullEntitlementSidebar
        visible={fullEntitlementVisible}
        setVisible={setFullEntitlementVisible}
        caseData={{
          ...caseGetFormData?.data?.data,
          policyTypeId: memberGetData?.data?.policy_detail?.policy_type
            ? caseGetFormData?.data?.data?.extras?.policyTypes?.find(
                (item) =>
                  item?.name?.toLowerCase() ==
                  memberGetData?.data?.policy_detail?.policy_type?.toLowerCase()
              )?.id
            : 434,
        }}
        memberGetData={memberGetData}
        selectedCaseService={selectedCaseService}
        selectedCaseSubService={selectedCaseSubService}
      />
    </div>
  );
};

export default CaseCreation;
