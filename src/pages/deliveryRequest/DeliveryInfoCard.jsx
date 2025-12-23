import React, { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Navigate, useLocation, useNavigate, useParams } from "react-router";
import { AutoComplete } from "primereact/autocomplete";
import {
  CalendarViewIcon,
  CloseIcon,
  DialogCloseSmallIcon,
  KMStoneIcon,
  SpannerImage,
  VehicleGreyIcon,
} from "../../utills/imgConstants";
import Filters from "../../components/common/Filters";
import { Checkbox } from "primereact/checkbox";
import Note from "../../components/common/Note";
import { Dialog } from "primereact/dialog";
import { toast } from "react-toastify";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useQueries, useQuery, useMutation } from "react-query";
import { useSelector } from "react-redux";
import { CurrentUser } from "../../../store/slices/userSlice";
import {
  configtypes,
  dealer,
  nspFilter,
  getConfigList,
  getState,
  cities,
  getCityId,
} from "../../../services/masterServices";
import { updateVdmLocation } from "../../../services/caseService";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
const DeliveryInfoCard = ({
  caseDetail,
  setFilterId,
  setSearchKey,
  nearASPRefetch,
  refetchCaseDetails,
}) => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(null);
  const [pickUpDealersList, setPickUpDealerList] = useState([]);
  const [DropDealersList, setDropDealerList] = useState([]);
  const [dropLocationForm, setDropLocationForm] = useState(false);
  const [pickupLocationForm, setPickupLocationForm] = useState(false);
  const [cityList, setCityList] = useState([]);
  const [dropCityList, setDropCityList] = useState([]);
  const [cityQuery, setCityQuery] = useState();
  const [pickupState, setPickupState] = useState();
  const [dropState, setDropState] = useState();
  const [pickupLatlng, setPickupLatlng] = useState();
  const [dropLatlng, setDropLatlng] = useState();
  const [checked, setChecked] = useState(false);
  const { pathname } = useLocation();
  const { id } = useParams();
  const [areaList, setAreaList] = useState([]);
  const [areaDropList, setAreaDropList] = useState([]);
  const [showAutoCompleteDrop, setShowAutoCompleteDrop] = useState(false);
  const [showAutoComplete, setShowAutoComplete] = useState(false);

  const user = useSelector(CurrentUser);
  const { data } = useQuery(["aspdistance"], () =>
    nspFilter({
      typeId: 32,
    })
  );

  // console.log(
  //   "asp distance data",
  //   data,
  //   data?.data?.data?.map((distance) => {
  //     return {
  //       code: distance?.id,
  //       label: distance?.name,
  //     };
  //   })
  // );
  const { mutate: pickupMutate, data: pickupDealerList } = useMutation(dealer);
  const { mutate: dropMutate, data: dropDealerList } = useMutation(dealer);
  const { mutate: stateMutate } = useMutation(getState);
  const { mutate: locationMutate, data: locationData } =
    useMutation(updateVdmLocation);
  const { data: locationTypeData } = useQuery(["locationtypeList"], () =>
    getConfigList({
      typeId: 42,
    })
  );
  const {
    suggestions,
    setValue: setSearchValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      // Restrict to places within India
      componentRestrictions: { country: "IN" },
      strictBounds: false,
    },
  });
  // console.log(pathname);
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  const {
    handleSubmit: handlePickSubmit,
    control: pickControl,
    getValues: getPickValues,
    setValue: setPickValue,
    formState: { errors: errorsPick },
    reset: resetPick,
  } = useForm();

  const dropLocation = useWatch({
    control,
    name: "dropLocation",
  });

  const pickupCityId = useWatch({
    control: pickControl,
    name: "pickupCityId",
  });

  const pickupLocation = useWatch({
    control: pickControl,
    name: "pickupLocation",
  });
  const pickupDealer = useWatch({
    control: pickControl,
    name: "dealerId",
  });

  const locationPickTypeId = useWatch({
    control: pickControl,
    name: "locationTypeId",
  });
  // console.log("locationPickTypeId", locationPickTypeId);

  const locationTypeId = useWatch({
    control,
    name: "locationTypeId",
  });

  const { data: cityData } = useQuery(
    ["citiesList", pickupState, cityQuery],
    () =>
      cities({
        apiType: "dropdown",
        stateId: pickupState,
        ...(cityQuery && { search: cityQuery }),
      }),
    {
      enabled: pickupState ? true : false,
      onSuccess: (res) => {
        if (res?.data?.success) {
          // console.log("city data List", res);
          setCityList(res?.data?.data);
        } else {
          setCityList([{ name: "No data found" }]);
        }
      },
    }
  );
  const { mutate: getCityIdMutate, isLoading: getCityIdLoading } = useMutation(
    getCityId,
    {
      onSuccess: (res) => {
        if (res?.data?.success == false) {
          if (res?.data?.error) {
            //toast.error(res?.data?.error);
          } else {
            res?.data?.errors.forEach((err) => toast.error(err));
          }
        }
      },
    }
  );
  const { data: dropCityData } = useQuery(
    ["dropCitiesList", dropState, cityQuery],
    () =>
      cities({
        apiType: "dropdown",
        stateId: dropState,
        ...(cityQuery && { search: cityQuery }),
      }),
    {
      enabled: dropState ? true : false,
      onSuccess: (res) => {
        if (res?.data?.success) {
          // console.log("city data List", res);
          setDropCityList(res?.data?.data);
        } else {
          setDropCityList([{ name: "No data found" }]);
        }
      },
    }
  );
  const handleFilter = (values) => {
    // console.log("values", values);

    setFilterId({
      distanceCode: values?.distance?.code,
      search: values?.asp_id?.value,
    });
  };
  const handleClearFilter = () => {
    setFilterId(null);
  };
  const handleClose = () => {
    navigate(`/delivery-request/view/${id}`);
  };
  const handleFormSubmit = (values) => {
    // console.log("Values", values);
    locationMutate(
      {
        caseDetailId: caseDetail?.caseDetailId,
        editType: 2, //1-Pickup,2-Drop
        dropLocationReason: values?.dropLocationReason,
        dropDealerId: values?.dropDealerId ? values?.dropDealerId?.id : null,
        ...(caseDetail?.locationTypeId == 451 && {
          dropLocation: values?.dropLocation?.description,
          dropLatitude: dropLatlng?.lat,
          dropLongitude: dropLatlng?.lng,
          dropStateId: dropState,
          dropCityId: values?.dropCityId?.id,
          dropLocationPinCode: values?.dropCityId?.pincode,
        }),
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setDropLocationForm(false);
            reset();
            refetchCaseDetails();
            nearASPRefetch();
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
  const handlepickDealerSearch = (event) => {
    // console.log("Event", event);
    pickupMutate(
      {
        limit: 10,
        offset: 0,
        schemeId: caseDetail?.deliveryRequestSchemeId,
        search: event.query,
        type: "pickup",
        clientId: caseDetail?.clientId,
        ...(caseDetail?.deliveryRequestSchemeId == 21 && {
          loginDealerId: user?.entityId,
        }),
        apiType: "dropdown",
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            // console.log("pickup Dealer list", res?.data?.data);
            setPickUpDealerList(
              res?.data?.data.map((item) => {
                return { ...item, name: `${item?.code}-${item?.name}` };
              })
            );
          } else {
            setPickUpDealerList([{ name: "No data found" }]);
          }
        },
      }
    );
    // console.log("pickDealer event", event);
  };
  const handleDropDealerSearch = (event) => {
    dropMutate(
      {
        limit: 10,
        offset: 0,
        schemeId: caseDetail?.deliveryRequestSchemeId,
        search: event.query,
        clientId: caseDetail?.clientId,
        type: "drop",
        pickupDealerId: pickupDealer?.id,
        ...(caseDetail?.deliveryRequestSchemeId == 21 && {
          loginDealerId: user?.entityId,
        }),
        apiType: "dropdown",
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            // console.log("Drop Dealer list", res?.data?.data);
            setDropDealerList(
              res?.data?.data.map((item) => {
                return { ...item, name: `${item?.code}-${item?.name}` };
              })
            );
          } else {
            setDropDealerList([{ name: "No data found" }]);
          }
        },
      }
    );
  };
  const handleSearch = (event) => {
    // console.log("handle search event", event);
    setSearchValue(event.query);
  };
  const handleCityChange = (event) => {
    setCityQuery(event.query);
  };

  const handleLocationSelect = (value, field) => {
    // console.log("handleLocationSelect", value?.value?.description);
    getGeocode({
      address: value?.value?.description,
    }).then((results) => {
      // console.log("geo details", results);
      handleStateCode(results[0], field);
      const addressComponents = results[0]?.address_components;
      const cityComponent = addressComponents.find(
        (component) =>
          component.types.includes("locality") ||
          component.types.includes("administrative_area_level_1")
      );
      const city = cityComponent ? cityComponent.long_name : null;
      const areaComponent = addressComponents.find((component) =>
        component.types.includes("postal_code")
      );
      const area = areaComponent ? areaComponent.long_name : "";
      const stateComponent = addressComponents.find((component) =>
        component.types.includes("administrative_area_level_1")
      );
      const state = stateComponent ? stateComponent?.short_name : "";
      const { lat, lng } = getLatLng(results[0]);
      // console.log("lat    lng ***", lat, lng, field);
      if (field == "pickupLocation") {
        setPickupLatlng({
          lat: lat,
          lng: lng,
        });
        getCityIdMutate(
          {
            pinCode: area ? area.toString() : "",
            district: area ? "" : city ? city.toString() : "",
            state: area ? "" : state ? state.toString() : "",
          },
          {
            onSuccess: (res) => {
              if (res?.data?.success) {
                setAreaList(res?.data?.data);
                setShowAutoComplete(false); // Show dropdown
              } else {
                setAreaDropList([]); // Just to be safe
                setShowAutoComplete(true); // Show autocomplete
              }
            },
          }
        );
      } else if (field == "dropLocation") {
        setDropLatlng({
          lat: lat,
          lng: lng,
        });
        getCityIdMutate(
          {
            pinCode: area ? area.toString() : "",
            district: area ? "" : city ? city.toString() : "",
            state: area ? "" : state ? state.toString() : "",
          },
          {
            onSuccess: (res) => {
              if (res?.data?.success) {
                setAreaDropList(res?.data?.data);
                setShowAutoCompleteDrop(false); // Show dropdown
              } else {
                setAreaDropList([]); // Just to be safe
                setShowAutoCompleteDrop(true); // Show autocomplete
              }
            },
          }
        );
      }
    });
  };

  const handleStateCode = (results, field) => {
    const addressComponents = results?.address_components;

    const stateComponent = addressComponents.find((component) =>
      component.types.includes("administrative_area_level_1")
    );

    // console.log("stateComponent", stateComponent);
    stateMutate(
      {
        code: stateComponent?.short_name,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            // console.log("state", res?.data);
            if (field == "pickupLocation") {
              setPickupState(res?.data?.data?.id);
            } else if (field == "dropLocation") {
              setDropState(res?.data?.data?.id);
            }
          }
        },
      }
    );
  };
  const handlePickForm = (values) => {
    // console.log("Values", values);

    locationMutate(
      {
        caseDetailId: caseDetail?.caseDetailId,
        editType: 1, //1-Pickup,2-Drop
        pickupLocationReason: values?.pickupLocationReason,
        pickupDealerId: values?.pickupDealerId
          ? values?.pickupDealerId?.id
          : null,
        ...(caseDetail?.locationTypeId == 451 && {
          pickupLocation: values?.pickupLocation
            ? values?.pickupLocation?.description
            : null,
          pickupLatitude: pickupLatlng?.lat,
          pickupLongitude: pickupLatlng?.lng,
          pickupStateId: pickupState,
          pickupCityId: values?.pickupCityId?.id,
          pickupLocationPinCode: values?.pickupCityId?.pincode,
        }),
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            nearASPRefetch();
            refetchCaseDetails();
            setPickupLocationForm(false);
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
    <>
      <div className="delivery-request-info-card">
        <div className="row row-gap-3_4 h-100 mb-2_3">
          <div className="col-md-6 border-right">
            <div className="delivery-request-info-header">
              <h4 className="delivery-request-title">Delivery Info</h4>
              <span className="delivery-request-sub">
                {" "}
                - {caseDetail?.caseNumber}
              </span>
            </div>
            <div className="delivery-request-detail">
              <div className="delivery-request-name">
                <img src={SpannerImage} alt="spanner_icon" />
                <span>
                  {caseDetail?.caseSubject} - {caseDetail?.subService}
                </span>
              </div>
              {/* <div className="delivery-request-name">
                <img src={KMStoneIcon} alt={"milestone-icon"} />
                <span>--</span>
              </div> */}

              <div className="delivery-request-name">
                <img src={CalendarViewIcon} alt={"milestone-icon"} />
                <span>
                  {caseDetail?.deliveryRequestPickupDate}{" "}
                  {caseDetail?.deliveryRequestPickupTime}
                </span>
              </div>
              <div className="delivery-request-name">
                <img src={VehicleGreyIcon} alt={"milestone-icon"} />
                <span>{caseDetail?.vehicleMake}</span>
                <span className="vehicle-detail">{caseDetail?.vin}</span>
                <span className="vehicle-detail">
                  {caseDetail?.vehicleModel}
                </span>
                <span className="vehicle-detail">
                  {caseDetail?.vehicleType}
                </span>
              </div>
            </div>
            <div className="delivery-request-filter">
              <div className="delivery-request-filter-left">
                <Filters
                  onFilterApply={handleFilter}
                  filters={filters}
                  filterFields={{
                    filterFields: ["Distance", "ASP"],
                    filterData: {
                      distance: data?.data?.data?.map((distance) => {
                        return {
                          code: distance?.id,
                          label: distance?.name,
                        };
                      }),
                    },
                  }}
                  remove={null}
                />
                {/* <div className="d-flex gap-2">
                  <Checkbox
                    onChange={(e) => setChecked(e.checked)}
                    checked={checked}
                  ></Checkbox>
                  <label>Include 3rd party ASP</label>
                </div>*/}
              </div>
              {/*<span
                className="delivery-request-filter-right"
                onClick={handleClearFilter}
              >
                Clear Filter
              </span> */}
            </div>
          </div>
          <div className="col-md-6">
            <div className="delivery-location-header">
              <h4 className="delivery-location-title">Location Details</h4>
              <button className="btn btn-close" onClick={handleClose}>
                <img className="img-fluid" src={CloseIcon} alt="Close" />
              </button>
            </div>
            <div className="delivery-location-content">
              <div className="location">
                <h4 className="delivery-location-content-title">
                  Pickup Location
                </h4>
                <div className="d-flex gap-3">
                  <p className="delivery-location-content-text">
                    {caseDetail?.deliveryRequestPickUpLocation},
                    {caseDetail?.deliveryRequestPickUpState},{" "}
                    {caseDetail?.deliveryRequestPickUpCity}
                  </p>
                  {/* Edit is not required - Said by Mr. Hyder from business team */}
                  {/* {!caseDetail?.positiveActivityExists &&
                    caseDetail?.caseStatusId == 2 && (
                      <div
                        className="request-blue_text"
                        onClick={() => {
                          setPickupLocationForm(true);
                          resetPick();
                        }}
                      >
                        Edit
                      </div>
                    )} */}
                </div>
              </div>

              <div className="location">
                <h4 className="delivery-location-content-title">
                  Drop Location
                </h4>
                <div className="d-flex gap-3">
                  <p className="delivery-location-content-text">
                    {caseDetail?.deliveryRequestDropLocation},
                    {caseDetail?.deliveryRequestDropState},{" "}
                    {caseDetail?.deliveryRequestDropCity}
                  </p>
                  {/* Edit is not required - Said by Mr. Hyder from business team */}
                  {/* {!caseDetail?.positiveActivityExists &&
                    caseDetail?.caseStatusId == 2 && (
                      <div
                        className="request-blue_text"
                        onClick={() => {
                          setDropLocationForm(true);
                          reset();
                        }}
                      >
                        Edit
                      </div>
                    )} */}
                </div>
              </div>
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
        className="w-560"
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
                  name="dropLocationReason"
                  control={control}
                  rules={{ required: "Reason is required." }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id="name"
                      {...field}
                      placeholder="Enter Reason"
                      className={`form-control`}
                    />
                  )}
                />
              </div>
            </div>
            {/* {caseDetail?.deliveryRequestSchemeId == 21 && (
              <>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label required">Drop Dealer</label>
                    <Controller
                      name="dropDealerId"
                      control={control}
                      rules={{ required: "Drop Dealer is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <AutoComplete
                            inputId={field.name}
                            value={field.value}
                            field="name"
                            onChange={field.onChange}
                            inputRef={field.ref}
                            suggestions={DropDealersList}
                            completeMethod={handleDropDealerSearch}
                            pt={{
                              list: {
                                className: `${
                                  dropDealerList?.data?.success
                                    ? ""
                                    : "empty-state"
                                }`,
                              },
                            }}
                            placeholder="Enter Drop Dealer"
                            // disabled={pickupDealer?.id ? false : true}
                          />

                          <div className="p-error">
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
              </>
            )} */}
            {/* {caseDetail?.deliveryRequestSchemeId == 22 && (
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label required">Location Type</label>
                  <Controller
                    name="locationTypeId"
                    control={control}
                    rules={{ required: "Location Type is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <Dropdown
                          value={field.value}
                          placeholder="Select Location Type"
                          className="form-control-select"
                          filter
                          options={locationTypeData?.data?.data}
                          optionLabel="name"
                          onChange={(e) => {
                            // console.log('Location type', e);
                            field.onChange(e.value);
                            setValue("dropDealerId", "");
                            setValue("dropCityId", "");
                            setValue("dropLocation", "");
                          
                          }}
                        />
                        <div className="p-error">
                         
                          {errors && errors[field.name]?.message}
                        </div>
                      </>
                    )}
                  />
                </div>
              </div>
            )} */}
            {caseDetail?.locationTypeId == 451 && (
              <>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label required">Drop Location</label>
                    <Controller
                      name="dropLocation"
                      control={control}
                      rules={{ required: "Drop Location is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <AutoComplete
                            value={field.value}
                            suggestions={suggestions?.data}
                            completeMethod={handleSearch}
                            field="description"
                            itemTemplate={(option) => {
                              return <div>{option.description}</div>;
                            }}
                            onChange={(e) => {
                              field.onChange(e.value);
                              setValue("dropCityId", "");
                            }}
                            placeholder="Search Drop Location"
                            onSelect={(e) =>
                              handleLocationSelect(e, "dropLocation")
                            }
                            // disabled={pickupCityId ? false : true}
                          />{" "}
                          <div className="p-error">
                            {/* {errors[field.name]?.message} */}
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label required">
                      Drop Location City
                    </label>
                    <Controller
                      name="dropCityId"
                      control={control}
                      rules={{
                        required: "Drop Location City is required.",
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          {showAutoCompleteDrop ? (
                            <AutoComplete
                              inputId={field.name}
                              value={field.value}
                              field="name"
                              onChange={field.onChange}
                              inputRef={field.ref}
                              suggestions={dropCityList}
                              completeMethod={handleCityChange}
                              disabled={dropLocation ? false : true}
                              className="form-control-select"
                              placeholder="Enter Drop Location City Name"
                              pt={{
                                list: {
                                  className: `${
                                    data?.data?.success ? "" : "empty-state"
                                  }`,
                                },
                              }}
                            />
                          ) : (
                            <Dropdown
                              value={field.value}
                              placeholder="Select Drop Location City Name "
                              filter
                              resetFilterOnHide={true}
                              className={`form-control-select ${
                                fieldState.error ? "p-invalid" : ""
                              }}`}
                              disabled={dropLocation ? false : true}
                              options={areaDropList}
                              optionLabel="name"
                              onChange={(e) => {
                                //handleAreaSearch(e, dropStateId)
                                field.onChange(e.value);
                              }}
                            />
                          )}
                          <div className="p-error">
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
              </>
            )}
            {(caseDetail?.locationTypeId == 452 ||
              caseDetail?.deliveryRequestSchemeId == 21) && (
              <>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label required">Drop Dealer</label>
                    <Controller
                      name="dropDealerId"
                      control={control}
                      rules={{ required: "Drop Dealer is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <AutoComplete
                            inputId={field.name}
                            value={field.value}
                            field="name"
                            onChange={field.onChange}
                            inputRef={field.ref}
                            suggestions={DropDealersList}
                            completeMethod={handleDropDealerSearch}
                            pt={{
                              list: {
                                className: `${
                                  dropDealerList?.data?.success
                                    ? ""
                                    : "empty-state"
                                }`,
                              },
                            }}
                            placeholder="Enter Drop Dealer"
                            // disabled={pickupDealer?.id ? false : true}
                          />

                          <div className="p-error">
                            {errors && errors[field.name]?.message}
                          </div>
                        </>
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

      <Dialog
        className="w-560"
        header={
          <div className="dialog-header">
            <div className="dialog-header-title"> Edit Pickup Location</div>
          </div>
        }
        visible={pickupLocationForm}
        position={"bottom"}
        onHide={() => setPickupLocationForm(false)}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
      >
        <form onSubmit={handlePickSubmit(handlePickForm)}>
          <div className="row row-gap-3_4">
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label required">Reason</label>
                <Controller
                  name="pickupLocationReason"
                  control={pickControl}
                  rules={{ required: "Reason is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText
                        id="name"
                        {...field}
                        placeholder="Enter Reason"
                        className={`form-control`}
                      />
                      <div className="p-error">
                        {/* {errors[field.name]?.message} */}
                        {errorsPick && errorsPick[field.name]?.message}
                      </div>
                    </>
                  )}
                />
              </div>
            </div>

            {/* {caseDetail?.deliveryRequestSchemeId == 22 && (
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label required">Location Type</label>
                  <Controller
                    name="locationTypeId"
                    control={pickControl}
                    rules={{ required: "Location Type is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <Dropdown
                          value={field.value}
                          placeholder="Select Location Type"
                          className="form-control-select"
                          filter
                          options={locationTypeData?.data?.data}
                          optionLabel="name"
                          onChange={(e) => {
                        
                            field.onChange(e.value);
                            setPickValue("dealerId", "");
                            setPickValue("pickupLocation", "");
                            setPickValue("pickupCityId", "");
                          }}
                        />
                        <div className="p-error">
                          
                          {errorsPick && errorsPick[field.name]?.message}
                        </div>
                      </>
                    )}
                  />
                </div>
              </div>
            )} */}
            {caseDetail?.locationTypeId == 451 && (
              <>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label required">
                      Pickup Location
                    </label>
                    <Controller
                      name="pickupLocation"
                      control={pickControl}
                      rules={{ required: "Pickup Location is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <AutoComplete
                            value={field.value}
                            suggestions={suggestions?.data}
                            completeMethod={handleSearch}
                            field="description"
                            itemTemplate={(option) => {
                              return <div>{option.description}</div>;
                            }}
                            onChange={(e) => {
                              // console.log('Pick up location changed',e);
                              field.onChange(e.value);
                              setPickValue("pickupCityId", "");
                              setValue("dropLocation", "");
                            }}
                            placeholder="Search Pickup Location"
                            onSelect={(e) =>
                              handleLocationSelect(e, "pickupLocation")
                            }
                          />

                          <div className="p-error">
                            {/* {errors[field.name]?.message} */}
                            {errorsPick && errorsPick[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label required">
                      Pickup Location City
                    </label>
                    <Controller
                      name="pickupCityId"
                      control={pickControl}
                      rules={{
                        required: "Pickup Location City is required.",
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          {showAutoComplete ? (
                            <AutoComplete
                              inputId={field.name}
                              value={field.value}
                              field="name"
                              onChange={field.onChange}
                              inputRef={field.ref}
                              suggestions={cityList}
                              completeMethod={handleCityChange}
                              disabled={pickupLocation ? false : true}
                              className="form-control-select"
                              placeholder="Enter Pickup Location City Name"
                              pt={{
                                list: {
                                  className: `${
                                    data?.data?.success ? "" : "empty-state"
                                  }`,
                                },
                              }}
                            />
                          ) : (
                            <Dropdown
                              value={field.value}
                              placeholder="Select Pickup Location City Name "
                              filter
                              resetFilterOnHide={true}
                              className={`form-control-select ${
                                fieldState.error ? "p-invalid" : ""
                              }}`}
                              disabled={pickupLocation ? false : true}
                              options={areaList}
                              optionLabel="name"
                              onChange={(e) => {
                                //handleAreaSearch(e, breakStateId)
                                field.onChange(e.value);
                              }}
                            />
                          )}
                          <div className="p-error">
                            {errorsPick && errorsPick[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
              </>
            )}

            {caseDetail?.deliveryRequestSchemeId == 21 ||
            caseDetail?.locationTypeId == 452 ? (
              <>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label required">Pickup Dealer</label>
                    <Controller
                      name="pickupDealerId"
                      control={pickControl}
                      rules={{ required: "PickUp Dealer is required." }}
                      render={({ field, fieldState }) => {
                        // console.log("pick up dealer field", field);
                        return (
                          <>
                            <AutoComplete
                              inputId={field.name}
                              value={field.value}
                              field="name"
                              onChange={(value) => {
                                field.onChange(value);
                                // setValue("deliveryRequestDropDealerId", "");
                              }}
                              inputRef={field.ref}
                              suggestions={pickUpDealersList}
                              completeMethod={handlepickDealerSearch}
                              className="form-control-select"
                              placeholder="Enter Pickup Dealer"
                              pt={{
                                list: {
                                  className: `${
                                    pickupDealerList?.data?.success
                                      ? ""
                                      : "empty-state"
                                  }`,
                                },
                              }}
                              disabled={
                                caseDetail?.deliveryRequestSchemeId == undefined
                                  ? true
                                  : false
                              }
                            />
                            <div className="p-error">
                              {errorsPick && errorsPick[field.name]?.message}
                            </div>
                          </>
                        );
                      }}
                    />
                  </div>
                </div>
              </>
            ) : null}
          </div>
          <button className="btn form-submit-btn" type="submit">
            Confirm
          </button>
        </form>
      </Dialog>
    </>
  );
};

export default DeliveryInfoCard;
