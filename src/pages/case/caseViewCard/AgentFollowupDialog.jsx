import React from "react";
import { DialogCloseSmallIcon } from "../../../utills/imgConstants";
import { Dialog } from "primereact/dialog";
import { Controller, useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { agentFollowup } from "../../../../services/caseService";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { agent } from "../../../../services/deliveryRequestViewService";

const AgentFollowupDialog = ({
  visible,
  setVisible,
  caseDetailId,
  caseViewRefetch,
  caseData,
}) => {
  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
    reset,
  } = useForm();
  const { mutate, isLoading } = useMutation(agentFollowup);
  const { data: agentList } = useQuery(
    "rsaCaseagent",
    () =>
      agent({
        userTypeId: 141,
        limit: 1000,
        offset: 0,
        l2AgentOnly: true,
        ...(caseData?.callCenterId && {
          callCenterId: caseData?.callCenterId,
        }),
      }),
    {
      enabled: visible,
    }
  );
  const handleFormSubmit = (values) => {
    mutate(
      {
        caseDetailId: caseDetailId,
        agentId: values?.agentId,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setVisible(false);
            reset();
            caseViewRefetch();
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

  return (
    <Dialog
      header={
        <div className="dialog-header">
          <div className="dialog-header-title">Agent Followup</div>
        </div>
      }
      pt={{
        header: { className: "agent-followup-dialog-header" },
        content: { className: "agent-followup-dialog-content" },
      }}
      visible={visible}
      position={"bottom"}
      className="w-460"
      onHide={() => setVisible(false)}
      draggable={false}
      resizable={false}
      closeIcon={<img src={DialogCloseSmallIcon} />}
    >
      <form
        className="agent-follwup-form"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <div className="row row-gap-3_4">
          {/* <div className="col-md-12">
            <div className="form-group">
              <label className="form-label">Select Date And Time</label>
              <Controller
                name="date"
                control={control}
                rules={{ required: "Date And Time is required." }}
                render={({ field, fieldState }) => (
                  <Calendar
                    dateFormat="dd-mm-yy"
                    className={`${fieldState.error ? "p-invalid" : ""}`}
                    onChange={field.onChange}
                    showTime 
                    hourFormat="12"
                    placeholder="Select Date And Time"
                    showIcon
                    iconPos={"left"}
                  />
                )}
              />
            </div>
          </div> */}
          {/* <div className="col-md-12">
            <div className="form-group">
              <label className="form-label">
                Select Call Centre <span className="optional">(Optional) </span>
              </label>
              <Controller
                name="callcenter"
                control={control}
                render={({ field, fieldState }) => (
                  <Dropdown
                    value={field.value}
                    placeholder="Select Call Centre"
                    options={[
                      { label: "Center 1", value: "center1" },
                      { label: "Center 2", value: "center2" },
                    ]}
                    optionLabel="label"
                    onChange={(e) => field.onChange(e.value)}
                  />
                )}
              />
            </div>
          </div> */}
          <div className="col-md-12">
            <div className="form-group">
              <label className="form-label">Select Agent</label>
              <Controller
                name="agentId"
                control={control}
                rules={{ required: "Agent is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <Dropdown
                      value={field.value}
                      placeholder="Select Agent"
                      options={agentList?.data?.data
                        ?.filter(
                          (filterAgent) => filterAgent.id !== caseData?.agentId
                        )
                        ?.map((agent) => {
                          return {
                            name: agent.name,
                            id: agent.id,
                          };
                        })}
                      optionLabel="name"
                      optionValue="id"
                      onChange={(e) => field.onChange(e.value)}
                      filter
                      filterBy="name"
                    />
                    <div className="p-error">
                      {errors && errors[field.name]?.message}
                    </div>
                  </>
                )}
              />
            </div>
          </div>
        </div>
        <Button className="confirm-btn mt-2" type="submit" loading={isLoading}>
          Confirm
        </Button>
      </form>
    </Dialog>
  );
};

export default AgentFollowupDialog;
