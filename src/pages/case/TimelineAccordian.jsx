import { Timeline } from "primereact/timeline";
import React from "react";
import { CollapseIcon, ExpandIcon } from "../../utills/imgConstants";
import { Accordion, AccordionTab } from "primereact/accordion";

const TimelineAccordian = ({
  events,
  activeAccordians,
  setActiveAccordians,
}) => {
  // console.log('Timeline Eve => ', events, activeAccordians)

  const AccordianHeader = ({ title, date }) => {
    return (
      <div className="custom-accordian-header">
        <div className="custom-accordian-title">
          {title}
          <div className="timeline-date">{date}</div>
        </div>
        {/* <div className="custom-accordian-date">{date}</div> */}
      </div>
    );
  };
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
            header={
              <AccordianHeader
                title={eventData?.title}
                date={eventData?.date}
              />
            }
            disabled={true}
          >
            {eventData?.content}
          </AccordionTab>
        </Accordion>
      ),
    };
  });
  // console.log("Timeline Items => ", Items);
  return (
    <Timeline
      value={Items}
      marker={(item) => <img src={item.icon} />}
      content={(item, timelineindex) => item.content(timelineindex)}
      className="case-view-activity"
    />
  );
};

export default TimelineAccordian;
