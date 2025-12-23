import React, { useMemo, useState } from "react";
import {
  CollapseIcon,
  ContactImage,
  ExpandIcon,
  FilterImage,
  InteractionImage,
  MobileTimeLineIcon,
  NoActivityImage,
  ReminderImage,
  SystemTimeLineIcon,
  InteractionTimeLineIcon,
  ActivityRemainder,
  NotificationTimelineIcon,
  CallIntegrationIcon,
} from "../../../utills/imgConstants";
import CaseDetail from "../../../components/common/CaseDetail";
import { Timeline } from "primereact/timeline";
import { Accordion, AccordionTab } from "primereact/accordion";
import Filters from "../../../components/common/Filters";
import TimelineAccordian from "../TimelineAccordian";

const TimeLineIcons = {
  240: SystemTimeLineIcon,
  241: MobileTimeLineIcon,
  242: InteractionTimeLineIcon,
  243: ActivityRemainder,
  244: NotificationTimelineIcon,
  245: CallIntegrationIcon,
};

const ActivityTab = ({
  caseData,
  setInteractionDialogeVisible,
  setReminderDialogeVisible,
}) => {
  const [activeAccordians, setActiveAccordians] = useState([]);
  const Noactivity = true;

  const events = [
    {
      icon: SystemTimeLineIcon,
      title: "Call Customer",
      date: "Jan 19 2023 1:35 PM",
      content: (
        <>
          <p className="accordian-short-content">
            Inform customer about ASP reach time to breakdown.
          </p>
          <div className="customer-call-content">
            <div className="call-details-container">
              <div className="call-detail-title">Priority</div>
              <div className="call-detail-info danger">High</div>
            </div>
            <div className="call-details-container">
              <div className="call-detail-title">Reminder</div>
              <div className="call-detail-info">10 min</div>
            </div>
            <div className="call-details-container">
              <div className="call-detail-title">Customer</div>
              <button className="btn-link btn-text btn-with-icon expand-timeline-btn">
                <img src={ContactImage} />
                Call Customer
              </button>
            </div>
          </div>
        </>
      ),
    },
    {
      icon: MobileTimeLineIcon,
      title: "Start to BD Location",
      date: "Jan 19 2023 1:35 PM",
      content: (
        <p className="accordian-short-content">
          ASP Started to Drop Location, Will be reaching breakdown in 30 mins.
        </p>
      ),
    },
    {
      icon: SystemTimeLineIcon,
      title: "SMS to Customer",
      date: "Jan 19 2023 1:35 PM",
      content: (
        <p className="accordian-short-content">
          Dear Customer, For ticket no: TN70AM2694 , Case has been registered
          and ASP will be assigned soon. Please call toll free : 9000 0009 for
          support. Team TVS Auto Assist
        </p>
      ),
    },
  ];

  const activityEvents = caseData?.activityLogs?.map((log) => {
    return {
      icon: TimeLineIcons[log?.typeId],
      title: (
        <>
          {log?.title}
          {log?.description && (
            <div
              className="timeline-content"
              dangerouslySetInnerHTML={{ __html: log?.description }}
            />
          )}
        </>
      ),
      date: log?.createdAt,
      content: (
        <>
          {/* <div className="accordian-short-content">
            {log?.description}
          </div> */}
          {log?.typeId == 242 && (
            <div className="interaction-content">
              <div className="interaction-details-container">
                <div className="interaction-detail-title">Channel</div>
                <div className="interaction-detail-info">{log?.channel}</div>
              </div>
              <div className="interaction-details-container">
                <div className="interaction-detail-title">Call Type</div>
                <div className="interaction-detail-info">{log?.callType}</div>
              </div>
              <div className="interaction-details-container">
                <div className="interaction-detail-title">InteractionTo</div>
                <div className="interaction-detail-info">
                  {log?.interactionTo}
                </div>
              </div>
            </div>
          )}
          {log?.typeId == 243 && (
            <div className="customer-call-content">
              <div className="call-details-container">
                <div className="call-detail-title">Priority</div>
                <div className="call-detail-info danger">High</div>
              </div>
              <div className="call-details-container">
                <div className="call-detail-title">Reminder</div>
                <div className="call-detail-info">02:30:00</div>
              </div>
              <div className="call-details-container">
                <div className="call-detail-title">Customer</div>
                <button className="btn-link btn-text btn-with-icon expand-timeline-btn">
                  <img src={ContactImage} />
                  Call Asp
                </button>
              </div>
            </div>
          )}
        </>
      ),
    };
  });

  return (
    <div className="activity-tab">
      {/* <div className="upcoming-activity">
        <div className="tab-content-header">
          <div className="info-title">Upcoming Activity</div>
          <div className="activity-action-container">
            <button className="btn-white  btn-with-icon activity-btn" onClick={() => setInteractionDialogeVisible(true)}>
              <img src={InteractionImage} />
              Add Interaction
            </button>
            <button className="btn-white btn-with-icon activity-btn" onClick={() => setReminderDialogeVisible(true)}>
              <img src={ReminderImage} />
              Add Reminder
            </button>
            <Filters filterIcon={FilterImage} btnClassName={"activity-btn"} />
          </div>
        </div>
        <div className="tab-content-body">
          <div className="activity-card">
            {!Noactivity ? (
              <CaseDetail
                caseTitle={"Call Customer"}
                caseContent={
                  "Call customer on 25-03-2023 10:30 AM to remind his payment is pending."
                }
                CaseActions={false}
                btn1text={"Snooze"}
                btn2text={"Dismiss"}
              />
            ) : (
              <div className="no-upcoming-activity-container">
                <img src={NoActivityImage} />
                <div className="no-upcoming-activity-text">
                  No Upcoming Activity
                </div>
              </div>
            )}
          </div>
        </div>
      </div> */}
      <div className="timeline">
        <div className="tab-content-header">
          <div className="info-title">Timeline</div>
          {/* <button
            className="btn-link btn-text btn-with-icon expand-timeline-btn"
            onClick={() => {
              setActiveAccordians((prev) =>
                prev.length == events.length
                  ? []
                  : events.map((item, index) => index)
              );
            }}
          >
            {activeAccordians.length == events.length ? (
              <CollapseIcon />
            ) : (
              <ExpandIcon />
            )}
            {activeAccordians.length == events.length ? "Collapse" : "Expand"}{" "}
            Time line
          </button> */}
        </div>
        <div className="tab-content-body scroll-hidden">
          <TimelineAccordian
            events={activityEvents}
            activeAccordians={activeAccordians}
            setActiveAccordians={setActiveAccordians}
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityTab;
