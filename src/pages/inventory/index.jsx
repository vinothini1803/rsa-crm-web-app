import React, { useRef, useState } from "react";
import { useQuery, useMutation } from "react-query";
import {
  getCaseInfo,
  addRSAActivityInventory,
} from "../../../services/caseService";
import { aspData } from "../../../services/assignServiceProvider";
import CustomBreadCrumb from "../../components/common/CustomBreadCrumb";
import { useNavigate, useLocation, useParams } from "react-router";
import { CloseIcon, InventoryIcon } from "../../utills/imgConstants";
import { Steps } from "primereact/steps";
import InventoryForm from "./InventoryForm";
import { Button } from "primereact/button";
import { FormProvider, useForm } from "react-hook-form";
import TowingInventoryForm from "./TowingInventoryForm";
import VehicleInventoryForm from "./VehicleInventoryForm";
import { FileUpload } from "primereact/fileupload";
import moment from "moment";
import { toast } from "react-toastify";
import { attachments } from "../../../services/inventoryViewService";

const Inventory = () => {
  const navigate = useNavigate();
  const currentPathUrl = useLocation();
  const { activityId, typeOfId } = useParams();
  // console.log("currentPathUrl", currentPathUrl?.pathname?.split("/"));
  const [activeIndex, setActiveIndex] = useState(0);
  const [caseId, setCaseId] = useState(null);
  const towingInventory =
    currentPathUrl?.pathname?.split("/")[2] == "towing-inventory"
      ? true
      : false;
  const updateInventory =
    currentPathUrl?.pathname?.split("/")[3] == "update" ? true : false;

  const defaultValues = {
    datetime: "",
    aspCode: "",
    aspName: "",
    aspStartLocation: "",
    breakdownTicketNo: "",
    breakdownDateTime: "",
    customerName: "",
    vehicleNo: "",
    vehicleMake: "",
    vehicleModel: "",
    odoReading: "",
    breakdownLocation: "",
    customerComplaint: "",
    aspObservation: "",

    aspReachedToBreakdownAt: "",
    hubCaps: "",
    spareWheel: "",
    jackAndJackRoad: "",
    audioSystem: "",
    reverseParkingSystem: "",
    speakers: "",
    keyWithRemote: "",
    aerial: "",
    floorMat: "",
    fixedOrHangingIdol: "",
    vehicleArrivalStatusAtDealership: "",
    reachedDealershipStatus: "",
    aspReachedToDropAt: "",
    vehicleAcknowledgedBy: "",
    mobileNumberOfReceiver: "",
    signatureOfAsp: "",
    vehicleWithDealerBackground: "",
    signatureOfCustomer: "",
    signatureOfDealership: "",
    imageOfInnerCabin: "",
    // imageOfCarInTowingVehicle: "",
    imageOfCluster: "",
    termsAndConditions: "",
    requestDealershipSignature: "",
  };

  const methods = useForm({ defaultValues });
  const fileUploadRef = useRef();

  const { data: caseViewData, refetch: caseViewRefetch } = useQuery(
    ["getInventoryCaseActivity"],
    () => aspData({ activityId: activityId }),
    {
      enabled: activityId ? true : false,
      refetchOnWindowFocus: false,
      onSuccess: (res) => {
        // console.log("caseViewData => ", res);
        if (res?.data?.success) {
          setCaseId(res?.data?.data[0]?.caseDetail?.id);
          // DROP INVENTORY FORM
          if (typeOfId == 161) {
            if (res?.data?.data[0]?.aspReachedToDropAt) {
              methods.setValue(
                "aspReachedToDropAt",
                moment(
                  res?.data?.data[0]?.aspReachedToDropAt,
                  "DD/MM/YYYY hh:mm A"
                ).toDate()
              );
            }
          } else {
            // BREAKDOWN INVENTORY FORM
            if (res?.data?.data[0]?.aspReachedToBreakdownAt) {
              methods.setValue(
                "aspReachedToBreakdownAt",
                moment(
                  res?.data?.data[0]?.aspReachedToBreakdownAt,
                  "DD/MM/YYYY hh:mm A"
                ).toDate()
              );
            }
          }
          if (updateInventory && towingInventory) {
            const inventoryData =
              res?.data?.data[0]?.rsaActivityInventory?.find(
                (r) => r?.typeId == typeOfId
              );
            if (inventoryData) {
              methods.setValue("hubCaps", inventoryData?.hubCaps);
              methods.setValue(
                "spareWheel",
                inventoryData?.spareWheel == true ? "true" : "false"
              );
              methods.setValue(
                "jackAndJackRoad",
                inventoryData?.jackAndJackRoad == true ? "true" : "false"
              );
              methods.setValue(
                "audioSystem",
                inventoryData?.audioSystem == true ? "true" : "false"
              );
              methods.setValue(
                "reverseParkingSystem",
                inventoryData?.reverseParkingSystem == true ? "true" : "false"
              );
              methods.setValue("speakers", inventoryData?.speakers);
              methods.setValue(
                "keyWithRemote",
                inventoryData?.keyWithRemote == true ? "true" : "false"
              );
              methods.setValue(
                "aerial",
                inventoryData?.aerial == true ? "true" : "false"
              );
              methods.setValue("floorMat", inventoryData?.floorMat);
              methods.setValue(
                "fixedOrHangingIdol",
                inventoryData?.fixedOrHangingIdol == true ? "true" : "false"
              );
              methods.setValue(
                "termsAndConditions",
                inventoryData?.termsAndConditions == true ? "true" : "false"
              );
              if (
                typeOfId == 161 &&
                res?.data?.data[0]?.caseDetail?.caseInformation?.dropDealerId
              ) {
                methods.setValue(
                  "reachedDealershipStatus",
                  inventoryData?.reachedDealershipStatus == true
                    ? "true"
                    : "false"
                );
              }
              if (typeOfId == 161) {
                methods.setValue(
                  "vehicleAcknowledgedBy",
                  inventoryData?.vehicleAcknowledgedBy
                );
                methods.setValue(
                  "mobileNumberOfReceiver",
                  inventoryData?.mobileNumberOfReceiver
                );
              }
            }
          }
        }
      },
    }
  );

  // console.log("Case Activity Info", caseViewData?.data?.data[0]);

  const {
    mutate: activityInventoryMutate,
    isLoading: activityInventoryMutateLoading,
  } = useMutation(addRSAActivityInventory);

  const MenuItems = [
    { label: <div onClick={() => navigate("/cases")}>Cases</div> },
    {
      label: (
        <div onClick={() => navigate(`/cases/view/${caseId}`)}>
          View Case -{" "}
          {caseViewData?.data?.data[0]?.caseDetail?.caseNumber || "--"}
        </div>
      ),
    },
    {
      label: updateInventory ? "Update Inventory" : "Add Inventory",
    },
  ];

  const items = [
    {
      label: "Towing Inventory",
      content: (
        <TowingInventoryForm
          caseFullData={caseViewData?.data?.data[0]}
          typeOfId={typeOfId}
        />
      ),
      className: "not-complete",
    },
    {
      label: "Vehicle Inventory",
      content: (
        <VehicleInventoryForm
          caseFullData={caseViewData?.data?.data[0]}
          typeOfId={typeOfId}
        />
      ),
      className: "not-complete",
    },
  ];

  const handleNext = () => {
    setActiveIndex(activeIndex + 1);
  };

  const handleBack = () => {
    setActiveIndex(activeIndex - 1);
  };

  const handleClose = () => {
    navigate(`/cases/view/${caseId}`);
  };

  const handleInventoryForm = (values, rest) => {
    const inputDateString = moment(values?.repairTime);
    const startOfDayMoment = inputDateString.clone().startOf("day");
    // console.log(
    //   "Mechanical Inventory Form values",
    //   values,
    //   inputDateString.diff(startOfDayMoment, "seconds")
    // );
    /* const payload = {
      activityId: activityId,
      logTypeId: 240,
      typeId: 162,
      aspReachedToBreakdownAt: moment(values?.aspReachedToBreakdownAt).format("YYYY-MM-DD HH:mm:ss"),
      failedPartName: values?.failedPartName,
      repairStatus: values?.repairStatus == 'true' ? true : false,
      repairWork: values?.repairWork,
      repairTime: inputDateString.diff(startOfDayMoment, 'seconds'),
      termsAndConditions: values?.termsAndConditions == 'true' ? true : false,
      requestDealershipSignature: values?.requestDealershipSignature == 'true' ? true : false,
      photoOfFailedParts: values?.photoOfFailedParts,
      photoOfVehicles: values?.photoOfVehicles,
      signatureOfAsp: values?.signatureOfAsp,
      signatureOfCustomer: values?.signatureOfCustomer,
      photoOfFailedPartsNew: values?.photoOfFailedParts?.filter((file)=>file?.id == undefined),
      photoOfVehiclesNew: values?.photoOfVehicles?.filter((file)=>file?.id == undefined),
      signatureOfAspNew: values?.signatureOfAsp?.filter((file)=>file?.id == undefined),
      signatureOfCustomerNew: values?.signatureOfCustomer?.filter((file)=>file?.id == undefined),
      photoOfFailedPartsIds: values?.photoOfFailedParts?.filter((file)=>file?.id !== undefined)?.map((file) => {return file?.id}),
      photoOfVehiclesIds: values?.photoOfVehicles?.filter((file)=>file?.id!== undefined)?.map((file) => {return file?.id}),
      signatureOfAspIds: values?.signatureOfAsp?.filter((file)=>file?.id!== undefined)?.map((file) => {return file?.id}),
      signatureOfCustomerIds: values?.signatureOfCustomer?.filter((file)=>file?.id!== undefined)?.map((file) => {return file?.id}),
      attachmentIds: [
        ...values?.photoOfFailedParts?.filter((file)=>file?.id!== undefined)?.map((file) => {return file?.id}),
        ...values?.photoOfVehicles?.filter((file)=>file?.id!== undefined)?.map((file) => {return file?.id}),
        ...values?.signatureOfAsp?.filter((file)=>file?.id!== undefined)?.map((file) => {return file?.id}),
        ...values?.signatureOfCustomer?.filter((file)=>file?.id!== undefined)?.map((file) => {return file?.id}),
      ]
    }
    console.log('Inventory Payload => ', payload); */

    let inventoryFormData = new FormData();
    inventoryFormData.append("activityId", activityId);
    inventoryFormData.append("logTypeId", 240);
    inventoryFormData.append("typeId", 162);
    inventoryFormData.append(
      "aspReachedToBreakdownAt",
      moment(values?.aspReachedToBreakdownAt).format("YYYY-MM-DD HH:mm:ss")
    );
    inventoryFormData.append("failedPartName", values?.failedPartName);
    // inventoryFormData.append("repairStatus", values?.repairStatus == 'true' ? true : false);
    inventoryFormData.append("repairStatus", false);
    inventoryFormData.append("repairWork", values?.repairWork);
    inventoryFormData.append(
      "repairTime",
      inputDateString.diff(startOfDayMoment, "seconds")
    );
    inventoryFormData.append(
      "termsAndConditions",
      values?.termsAndConditions == "true" ? true : false
    );
    // inventoryFormData.append("requestDealershipSignature", values?.requestDealershipSignature == 'true' ? true : false);

    if (
      values?.photoOfFailedParts?.filter((file) => file?.id == undefined)
        ?.length > 0
    ) {
      values?.photoOfFailedParts
        ?.filter((file) => file?.id == undefined)
        ?.map((file) => {
          inventoryFormData.append("photoOfFailedParts", file);
        });
    }
    if (
      values?.photoOfVehicles?.filter((file) => file?.id == undefined)?.length >
      0
    ) {
      values?.photoOfVehicles
        ?.filter((file) => file?.id == undefined)
        ?.map((file) => {
          inventoryFormData.append("photoOfVehicles", file);
        });
    }
    if (
      values?.signatureOfAsp?.filter((file) => file?.id == undefined)?.length >
      0
    ) {
      values?.signatureOfAsp
        ?.filter((file) => file?.id == undefined)
        ?.map((file) => {
          inventoryFormData.append("signatureOfAsp", file);
        });
    }
    if (
      values?.signatureOfCustomer?.filter((file) => file?.id == undefined)
        ?.length > 0
    ) {
      values?.signatureOfCustomer
        ?.filter((file) => file?.id == undefined)
        ?.map((file) => {
          inventoryFormData.append("signatureOfCustomer", file);
        });
    }
    const attachmentIds = [
      ...values?.photoOfFailedParts
        ?.filter((file) => file?.id !== undefined)
        ?.map((file) => {
          return file?.id;
        }),
      ...values?.photoOfVehicles
        ?.filter((file) => file?.id !== undefined)
        ?.map((file) => {
          return file?.id;
        }),
      ...values?.signatureOfAsp
        ?.filter((file) => file?.id !== undefined)
        ?.map((file) => {
          return file?.id;
        }),
      ...values?.signatureOfCustomer
        ?.filter((file) => file?.id !== undefined)
        ?.map((file) => {
          return file?.id;
        }),
    ];
    attachmentIds?.map((attachmentId) => {
      inventoryFormData.append("attachmentIds", attachmentId);
    });

    activityInventoryMutate(inventoryFormData, {
      onSuccess: (res) => {
        // console.log("activityInventoryMutate Res", res);
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          // rest();
          navigate(`/cases/view/${caseId}`);
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
          } else {
            res?.data?.errors?.forEach((el) => toast.error(el));
          }
        }
      },
    });
  };

  const onFormSubmit = (values) => {
    // console.log("towing,vehicle inventory form values", values);

    let inventoryFormData = new FormData();
    inventoryFormData.append("activityId", activityId);
    inventoryFormData.append("logTypeId", 240);
    inventoryFormData.append("typeId", typeOfId);
    inventoryFormData.append("hubCaps", values?.hubCaps);
    inventoryFormData.append(
      "spareWheel",
      values?.spareWheel == "true" ? true : false
    );
    inventoryFormData.append(
      "jackAndJackRoad",
      values?.jackAndJackRoad == "true" ? true : false
    );
    inventoryFormData.append(
      "audioSystem",
      values?.audioSystem == "true" ? true : false
    );
    inventoryFormData.append(
      "reverseParkingSystem",
      values?.audioSystem == "true" ? true : false
    );
    // inventoryFormData.append("speakers", values?.speakers == 'true' ? true : false);
    inventoryFormData.append("speakers", values?.speakers);
    inventoryFormData.append(
      "keyWithRemote",
      values?.keyWithRemote == "true" ? true : false
    );
    inventoryFormData.append("aerial", values?.aerial == "true" ? true : false);
    inventoryFormData.append("floorMat", values?.floorMat);
    inventoryFormData.append(
      "fixedOrHangingIdol",
      values?.fixedOrHangingIdol == "true" ? true : false
    );
    inventoryFormData.append(
      "termsAndConditions",
      values?.termsAndConditions == "true" ? true : false
    );

    if (typeOfId == 162) {
      inventoryFormData.append(
        "aspReachedToBreakdownAt",
        moment(values?.aspReachedToBreakdownAt).format("YYYY-MM-DD HH:mm:ss")
      );
    }
    if (typeOfId == 161) {
      inventoryFormData.append(
        "aspReachedToDropAt",
        moment(values?.aspReachedToDropAt).format("YYYY-MM-DD HH:mm:ss")
      );
      inventoryFormData.append(
        "vehicleAcknowledgedBy",
        values?.vehicleAcknowledgedBy
      );
      inventoryFormData.append(
        "mobileNumberOfReceiver",
        values?.mobileNumberOfReceiver
      );
    }
    // if(values?.signatureOfAsp?.filter((file)=>file?.id == undefined)?.length > 0) {
    //   values?.signatureOfAsp?.filter((file)=>file?.id == undefined)?.map((file) => {
    //     inventoryFormData.append("signatureOfAsp", file)
    //   })
    // }

    if (
      values?.imageOfInnerCabin?.filter((file) => file?.id == undefined)
        ?.length > 0
    ) {
      values?.imageOfInnerCabin
        ?.filter((file) => file?.id == undefined)
        ?.map((file) => {
          inventoryFormData.append("imageOfInnerCabin", file);
        });
    }
    if (
      values?.imageOfCluster?.filter((file) => file?.id == undefined)?.length >
      0
    ) {
      values?.imageOfCluster
        ?.filter((file) => file?.id == undefined)
        ?.map((file) => {
          inventoryFormData.append("imageOfCluster", file);
        });
    }

    if (
      typeOfId == 161 &&
      caseViewData?.data?.data[0]?.caseDetail?.caseInformation?.dropDealerId
    ) {
      inventoryFormData.append(
        "reachedDealershipStatus",
        values?.reachedDealershipStatus == "true" ? true : false
      );

      // if(values?.signatureOfDealership?.filter((file)=>file?.id == undefined)?.length > 0) {
      //   values?.signatureOfDealership?.filter((file)=>file?.id == undefined)?.map((file) => {
      //     inventoryFormData.append("signatureOfDealership", file)
      //   })
      // }

      if (
        values?.vehicleWithDealerBackground?.filter(
          (file) => file?.id == undefined
        )?.length > 0
      ) {
        values?.vehicleWithDealerBackground
          ?.filter((file) => file?.id == undefined)
          ?.map((file) => {
            inventoryFormData.append("vehicleWithDealerBackground", file);
          });
      }
    } else {
      // if(values?.signatureOfCustomer?.filter((file)=>file?.id == undefined)?.length > 0) {
      //   values?.signatureOfCustomer?.filter((file)=>file?.id == undefined)?.map((file) => {
      //     inventoryFormData.append("signatureOfCustomer", file)
      //   })
      // }
    }
    // inventoryFormData.append("requestDealershipSignature", values?.requestDealershipSignature == 'true' ? true : false);
    const attachmentIds = [
      // ...values?.signatureOfAsp?.filter((file)=>file?.id!== undefined)?.map((file) => {return file?.id}),
      ...values?.imageOfInnerCabin
        ?.filter((file) => file?.id !== undefined)
        ?.map((file) => {
          return file?.id;
        }),
      ...values?.imageOfCluster
        ?.filter((file) => file?.id !== undefined)
        ?.map((file) => {
          return file?.id;
        }),
      ...(typeOfId == 161 &&
      caseViewData?.data?.data[0]?.caseDetail?.caseInformation?.dropDealerId
        ? [
            // ...values?.signatureOfDealership?.filter((file)=>file?.id!== undefined)?.map((file) => {return file?.id}),
            ...values?.vehicleWithDealerBackground
              ?.filter((file) => file?.id !== undefined)
              ?.map((file) => {
                return file?.id;
              }),
          ]
        : [
            // ...values?.signatureOfCustomer?.filter((file)=>file?.id!== undefined)?.map((file) => {return file?.id}),
          ]),
    ];
    // console.log("attachmentIds", attachmentIds);
    attachmentIds?.map((attachmentId) => {
      inventoryFormData.append("attachmentIds[]", attachmentId);
    });

    activityInventoryMutate(inventoryFormData, {
      onSuccess: (res) => {
        // console.log("activityInventoryMutate Res", res);
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          // rest();
          navigate(`/cases/view/${caseId}`);
        } else {
          if (res?.data?.error) {
            toast.error(res?.data?.error);
          } else {
            res?.data?.errors?.forEach((el) => toast.error(el));
          }
        }
      },
    });
  };

  const onTemplateSelect = (e) => {
    // console.log("event", e);
    let files = e.files;
    // console.log("files", e);
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
                    src={InventoryIcon}
                    alt="Title Icon"
                  />
                </div>
                <div>
                  <h5 className="page-content-title">
                    {updateInventory ? "Update" : "Add"}{" "}
                    {towingInventory
                      ? typeOfId == 162
                        ? "Breakdown Inventory"
                        : "Drop Inventory"
                      : "Inventory"}
                  </h5>
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
            {towingInventory && (
              <div>
                <Steps
                  model={items}
                  activeIndex={activeIndex}
                  onSelect={(e) => {
                    if (e.index !== activeIndex) {
                      //To avoid State update on same Index Click
                      setActiveIndex(e.index);
                    }
                  }}
                  readOnly={false}
                />
              </div>
            )}
          </div>

          <div className="page-content-body">
            {!towingInventory ? (
              <InventoryForm
                caseFullData={caseViewData?.data?.data[0]}
                onFormSubmit={handleInventoryForm}
                updateInventory={updateInventory}
              />
            ) : (
              <FormProvider {...methods}>
                <form
                  id="inventoryStepsForm"
                  onSubmit={methods.handleSubmit(onFormSubmit)}
                >
                  {items[activeIndex]["content"]}
                </form>
              </FormProvider>
            )}
          </div>

          <div className="page-content-footer">
            {/*  */}
            {!towingInventory ? (
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex gap-2 ms-auto">
                  <Button
                    type="submit"
                    form="inventoryForm"
                    className="btn btn-primary"
                    loading={activityInventoryMutateLoading}
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
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
                      type="submit"
                      className="btn btn-primary"
                      form="inventoryStepsForm"
                      loading={activityInventoryMutateLoading}
                    >
                      Submit
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
