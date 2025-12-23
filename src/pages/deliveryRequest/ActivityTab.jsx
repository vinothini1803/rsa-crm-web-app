import { Accordion, AccordionTab } from "primereact/accordion";
import { Timeline } from "primereact/timeline";
import React, { memo, useState } from "react";
import {
  CollapseIcon,
  ExpandIcon,
  InteractionImage,
} from "../../utills/imgConstants";
import InterActionSidebar from "../../components/common/InterActionSidebar";
import { useMutation, useQuery } from "react-query";
import {
  addInteraction,
  getInteractiondata,
} from "../../../services/deliveryRequestViewService";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { CurrentUser } from "../../../store/slices/userSlice";

const ActivityTab = ({
  events,
  activeAccordians,
  setActiveAccordians,
  disabled,
  activityId,
  aspRefetch,
  caseStatusId,
}) => {
  const [visible, setVisible] = useState(false);
  const { role } = useSelector(CurrentUser);

  const { data } = useQuery(
    ["interactionFormData"],
    () => getInteractiondata(),
    {
      enabled: visible,
    }
  );

  const { mutate, isLoading } = useMutation(addInteraction);

  const AccordianHeader = ({ title, date }) => {
    return (
      <div className="custom-accordian-header">
        <div className="custom-accordian-title">{title}</div>
      </div>
    );
  };

  console.log("events", events);
  const Items = events?.map((eventData, index) => {
    return {
      icon: eventData.icon,
      content: (index) => (
        <Accordion
          className="timeline-accordian accordian-custom-header"
          activeIndex={activeAccordians?.includes(index) ? 0 : null}
          expandIcon={(options) => (
            <ExpandIcon {...options.iconProps} color={"#1A2E35"} />
          )}
          collapseIcon={(options) => (
            <CollapseIcon {...options.iconProps} color={"#1A2E35"} />
          )}
          onTabChange={(e) =>
            setActiveAccordians((prev) =>
              prev?.includes(index)
                ? prev.filter((item) => item !== index)
                : [...new Set([...prev, index])]
            )
          }
        >
          <AccordionTab
            header={<AccordianHeader title={eventData?.title} />}
            disabled={disabled}
          >
            {eventData?.content}
          </AccordionTab>
        </Accordion>
      ),
    };
  });
  const handleSaveInteraction = (values, reset) => {
    mutate(
      {
        activityId: activityId,
        typeId: 242,
        ...values,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setVisible(false);
            reset();
            aspRefetch?.refetch();
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
  console.log("interaction data", data);
  return (
    <>
      {![3, 4].includes(caseStatusId) && role.id == 3 && (
        <button
          className="btn-white  btn-with-icon activity-btn mb"
          onClick={() => setVisible(true)}
        >
          <img src={InteractionImage} />
          Add Interaction
        </button>
      )}
      <Timeline
        value={Items}
        marker={(item) => <img src={item.icon} />}
        content={(item, timelineindex) => item.content(timelineindex)}
        className="case-view-activity"
      />

      <InterActionSidebar
        visible={visible}
        setVisible={setVisible}
        data={data?.data?.data?.extras}
        onSave={handleSaveInteraction}
        isLoading={isLoading}
      />
    </>
  );
};

export default ActivityTab;
