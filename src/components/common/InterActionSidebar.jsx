import React, { useEffect, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import {
  DialogCloseIcon,
  InteractionSidebarIcon,
} from "../../utills/imgConstants";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { AutoComplete } from "primereact/autocomplete";
import SelectableButtons from "../../pages/case/serviceTab/SelectableButtons";
import { Button } from "primereact/button";
import { useMutation } from "react-query";
import { searchCasesForInteraction } from "../../../services/caseService";

const InterActionSidebar = ({
  visible,
  setVisible,
  data,
  onSave,
  isLoading,
  isFromHeader = false,
  levelId,
  caseDetail,selectedAsp
}) => {
  // console.log("selectedAsp", selectedAsp);
  const DEFAULT_CHANNEL_ID = 291; // Phone
  const DEFAULT_TO_ID = 303; // ASP Mechanic
  const DEFAULT_CALL_TYPE_ID = 311; // Out Bound
  const defaultValues = {
    caseDetailId: "",
    channelId: DEFAULT_CHANNEL_ID,
    toId: DEFAULT_TO_ID,
    callTypeId: DEFAULT_CALL_TYPE_ID,
    title: "",
    description: "",
  };

  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
    reset,setValue
  } = useForm({
    defaultValues,
  });
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const channels = data?.channels?.map((channel) => {
    return { id: channel.id, label: channel.name };
  }) ?? [
    { id: 1, label: "Email" },
    { id: 2, label: "Phone" },
    { id: 3, label: "SMS" },
    { id: 4, label: "Web" },
    { id: 5, label: "Push Notification" },
  ];
  // useEffect(() => {
  //   if (caseDetail && caseDetail.caseDetailId) {
  //     setFilteredCases((prev) => {
  //       const exists = prev.some(
  //         (c) => c.caseDetailId === caseDetail.caseDetailId
  //       );
  //       if (!exists) return [caseDetail, ...prev];
  //       return prev;
  //     });
  //     reset((formValues) => ({
  //       ...formValues,
  //       caseDetailId: caseDetail, // 👈 set the full object here
  //     }));
  //   } else {
  //     // No case exists (like on home page) => clear AutoComplete
  //     setFilteredCases([]);
  //     reset(defaultValues);
  //   }
  // }, [visible, caseDetail, reset]);

  // console.log(filteredCases,"filtereddd casesss");

  // Search Cases for Autocomplete
 
useEffect(() => {
  if (!visible) return;

  // ✅ store ID, not object
  setSelectedChannels([DEFAULT_CHANNEL_ID]);

  if (caseDetail && caseDetail.caseDetailId) {
    setFilteredCases((prev) => {
      const exists = prev.some(
        (c) => c.caseDetailId === caseDetail.caseDetailId
      );
      if (!exists) return [caseDetail, ...prev];
      return prev;
    });

    reset((formValues) => ({
      ...formValues,
      caseDetailId: caseDetail,
      channelId: DEFAULT_CHANNEL_ID,
      toId: DEFAULT_TO_ID,
      callTypeId: DEFAULT_CALL_TYPE_ID,
    }));
  } else {
    setFilteredCases([]);
    reset({
      ...defaultValues,
      channelId: DEFAULT_CHANNEL_ID,
      toId: DEFAULT_TO_ID,
      callTypeId: DEFAULT_CALL_TYPE_ID,
    });
  }
}, [visible, caseDetail]);
useEffect(() => {
  if (!visible) return;

  if (selectedAsp?.aspTitle) {
    setValue("title", selectedAsp.aspTitle);
  } else {
    setValue("title", "");
  }
}, [selectedAsp, visible, setValue]);


  const { mutate: searchCasesMutate } = useMutation(
    ({ searchKey, levelId }) => searchCasesForInteraction(searchKey, levelId),
    {
      onSuccess: (res) => {
        if (res?.data?.success) {
          setFilteredCases(res?.data?.data || []);
        } else {
          setFilteredCases([]);
        }
      },
    }
  );

  const searchCases = (event) => {
    const query = event.query;
    if (query && query.length >= 2) {
      searchCasesMutate({ searchKey: query, levelId });
    } else {
      setFilteredCases([]);
    }
  };

  const handleChannelSelect = (Selecteditems, field) => {
    // console.log("first");
    setSelectedChannels(Selecteditems);
    field.onChange(Selecteditems[0]);
  };

  // console.log("selectd channel list", selectedChannels);

  const onInteractionSubmit = (values) => {
    // Extract caseDetailId from case object if it's an object
    // console.log("onInteractionSubmit", values.caseDetailId?.caseDetailId);

    const formValues = {
      ...values,
      caseDetailId:
        values.caseDetailId?.caseDetailId ||
        values.caseDetailId?.id ||
        values.caseDetailId ||
        null,
    };
    console.log(formValues, "formvaluessss");

    onSave(formValues, reset);
  };

  return (
    <Sidebar
      visible={visible}
      position="right"
      closeIcon={<DialogCloseIcon />}
      onHide={() => {
        setVisible(false);
        reset(defaultValues);
        setSelectedChannels([]);
        setFilteredCases([]);
      }}
      pt={{
        root: { className: "w-520 custom-sidebar" },
        header: { className: "brdr-bottom" },
      }}
      icons={
        <>
          <img src={InteractionSidebarIcon} />
          <div className="sidebar-title">Add Interaction</div>
        </>
      }
    >
      <div className="sidebar-content-wrap">
        <div className="sidebar-content-body">
          <form
            id="interaction-form"
            onSubmit={handleSubmit(onInteractionSubmit)}
          >
            <div className="row row-gap-3_4">
              {isFromHeader && (
                <div className="col-md-12">
                  <div className="form-group">
                    <label className="form-label required">Case Number</label>
                    <Controller
                      name="caseDetailId"
                      control={control}
                      rules={{ required: "Case Number is required." }}
                      render={({ field, fieldState }) => (
                        <>
                          <AutoComplete
                            placeholder="Search Case Number"
                            inputId={field.name}
                            value={field.value}
                            inputRef={field.ref}
                            field="caseNumber"
                            suggestions={filteredCases}
                            completeMethod={searchCases}
                            showEmptyMessage={true}
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                            itemTemplate={(item) => (
                              <div>{item.caseNumber}</div>
                            )}
                          />
                          <div className="p-error">
                            {errors[field.name]?.message}
                          </div>
                        </>
                      )}
                    />
                    {/* <Controller
  name="caseDetailId"
  control={control}
  rules={{ required: "Case Number is required." }}
  render={({ field, fieldState }) => (
    <>
      <AutoComplete
        placeholder="Search Case Number"
        inputId={field.name}
        value={field.value} // full object
        field="caseNumber" // display this property
        suggestions={filteredCases}
        completeMethod={searchCases}
        onChange={(e) => field.onChange(e.value)} // 👈 use e.value
        itemTemplate={(item) => <div>{item.caseNumber}</div>}
      />
      <div className="p-error">
        {errors[field.name]?.message}
      </div>
    </>
  )}
/> */}
                  </div>
                </div>
              )}
              <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label required">Channel</label>

                  <Controller
                    name="channelId"
                    control={control}
                    rules={{ required: "Channel is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <div className="channels-container">
                          <SelectableButtons
                            items={channels}
                            onSelect={(items) =>
                              handleChannelSelect(items, field)
                            }
                            // selectedChannels={selectedChannels}
                            defaultItems={selectedChannels}
                          />
                        </div>

                        <div className="p-error">
                          {errors[field.name]?.message}
                        </div>
                      </>
                    )}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label required">To</label>
                  <Controller
                    name="toId"
                    control={control}
                    rules={{ required: "To is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <Dropdown
                          filter
                          value={field.value}
                          options={data?.toTypes}
                          optionLabel="name"
                          optionValue="id"
                          placeholder="Select To"
                          className={`form-control-select ${
                            fieldState.error ? "p-invalid" : ""
                          }`}
                          {...field}
                        />
                        <div className="p-error">
                          {errors[field.name]?.message}
                        </div>
                      </>
                    )}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label required">Call Type</label>
                  <Controller
                    name="callTypeId"
                    control={control}
                    rules={{ required: "Call Type is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <Dropdown
                          filter
                          value={field.value}
                          options={data?.callTypes}
                          optionLabel="name"
                          optionValue="id"
                          placeholder="Select Call Type"
                          className={`form-control-select ${
                            fieldState.error ? "p-invalid" : ""
                          }`}
                          {...field}
                        />
                        <div className="p-error">
                          {errors[field.name]?.message}
                        </div>
                      </>
                    )}
                  />
                </div>
              </div>
              {/*  <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label">Disposition</label>
                  <Controller
                    name=""
                    control={control}
                    render={({ field, fieldState }) => (
                      <>
                        <Dropdown
                          filter
                          value={[]}
                          //onChange={(e) => setSelectedCity(e.value)}
                          //options={cities}
                          optionLabel="name"
                          placeholder="Select"
                          className={`form-control-select ${
                            fieldState.error ? "p-invalid" : ""
                          }`}
                          {...field}
                        />
                      </>
                    )}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label">Contact</label>
                  <Controller
                    name=""
                    control={control}
                    render={({ field, fieldState }) => (
                      <>
                        <Dropdown
                          filter
                          value={[]}
                          //onChange={(e) => setSelectedCity(e.value)}
                          //options={cities}
                          optionLabel="name"
                          placeholder="Select"
                          className={`form-control-select ${
                            fieldState.error ? "p-invalid" : ""
                          }`}
                          {...field}
                        />
                      </>
                    )}
                  />
                </div>
              </div> */}
              <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label required">Subject</label>
                  <Controller
                    name="title"
                    control={control}
                    rules={{ required: "Subject is required" }}
                    render={({ field, fieldState }) => (
                      <>
                        <InputText
                          type="text"
                          className={`form-control ${
                            fieldState.error ? "p-invalid" : ""
                          }`}
                          placeholder="Enter Subject"
                          {...field}
                        />
                        <div className="p-error">
                          {errors[field.name]?.message}
                        </div>
                      </>
                    )}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label required">Description</label>
                  <Controller
                    name="description"
                    control={control}
                    className="form-control"
                    rules={{ required: "Description is required" }}
                    render={({ field, fieldState }) => (
                      <>
                        <InputTextarea
                          {...field}
                          placeholder="Enter Description"
                          rows={3}
                          className="form-control"
                        />
                        <div className="p-error">
                          {errors[field.name]?.message}
                        </div>
                      </>
                    )}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="sidebar-content-footer">
          <div className="d-flex align-items-center justify-content-end">
            <Button
              className="btn save-btn"
              form="interaction-form"
              loading={isLoading}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default InterActionSidebar;
