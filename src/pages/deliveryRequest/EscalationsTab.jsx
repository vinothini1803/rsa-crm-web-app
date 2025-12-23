import React, { useState } from "react";
import TableWrapper from "../../components/common/TableWrapper/TableWrapper";
import StatusBadge from "../../components/common/StatusBadge";
import TimerChip from "../../components/common/TimerChip";
import CaseAction from "../case/CaseAction";
import { useNavigate } from "react-router";
import ReminderSidebar from "../../components/common/ReminderSidebar";
import SendNotificationSidebar from "../../components/common/SendNotificationSidebar";

const EscalationsTab = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [reminderVisible, setReminderVisible] = useState(false);
  // Add Notification Modal
  const handleNotification = () => {
    setVisible(true);
  };
  // Reminder Modal function
  const handleReminder = () => {
    setReminderVisible(true);
  };
  const items = [
    {
      label: "Send Notification",
      command: () => handleNotification(),
    },
    {
      label: "Update activity",
    },
    {
      label: "Add Reminder",
      command:()=>handleReminder()
    },
  
  ];
  const columns = [
    {
      title: "Actions",
      field: "actions",
      body: (record, field) => (
        <CaseAction
        items={items}
          
        />
      ),
    },
    {
      title: "SLA Timer",
      field: "slatimer",
      body: (record, field) => <TimerChip label="SLA Violated" type="danger" />,
    },
    {
      title: "Request ID",
      field: "request_id",
    },
    { title: "Subject", field: "subject", sorter: true },
    { title: "Sub Service", field: "sub_service" },
    { title: "Request Date", field: "request_date" },
    {
      title: "Tracking Link",
      field: "tracking_link",
      body: (record, field) => (
        <a className="text-blue text-decoration-underline">
          {record.tracking_link}
        </a>
      ),
    },
    { title: "Estimated Date & TIME", field: "estimated_date_time" },
    {
      title: "Activity Status",
      field: "status",
      body: (record, field) => {
        console.log("record", record, field);
        return <StatusBadge text={record.status} statusId={record.statusId} />;
      },
    },
  ];
  const data = Array.from({ length: 22 }, (e, i) => {
    return {
      actions: "",
      request_id: "RTVSKA3",
      subject: "Vehicle Transfer",
      sub_service: "Flat Bed",
      request_date: "20/08/2023.",
      tracking_link: "trackingidkjhd7038.in",
      estimated_date_time: "20/08/2023, 9:30AM",
      status: i % 2 == 0 ? "Open" : "UnAssigned",
      statusId: i % 2 == 0 ? 1 : 2,
    };
  });
  return (
    <>
      <TableWrapper
        title={"Escalations"}
        columns={columns}
        data={data}
        className="tab-page"
        filterFields={{
          filterFields: ["date"],
        }}
        action={false}
      />
      <SendNotificationSidebar visible={visible} setVisible={setVisible} />
      <ReminderSidebar
        visible={reminderVisible}
        setVisible={setReminderVisible}
      />
    </>
  );
};

export default EscalationsTab;
