import React, { useState } from "react";
import TableWrapper from "../../components/common/TableWrapper/TableWrapper";
import ServiceCard from "./ServiceCard";
import "./style.less";
import { useNavigate } from "react-router";

const OwnPatrolDashboard = () => {
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const navigate = useNavigate();
  const columns = [
    { title: "ASP Code", field: "asp_code" },
    {
      title: "Case ID",
      field: "case_id",
      body: (record, field) => (
        <div className="text-blue" onClick={() => navigate("/cases")}>
          {record.case_id}
        </div>
      ),
    },
    { title: "Service Org", field: "service_org" },
    { title: "Last GPS Captured", field: "gps_captured" },
    { title: "Last APP Usage", field: "last_app_usage" },
    { title: "Current Activity Status", field: "current_activity_status" },
  ];
  const data = Array.from({ length: 10 }, (e, i) => {
    return {
      id: i,
      asp_code: "KAW011",
      case_id: "1ubuhef-24uhfgfjd-24874gbh-58fhdbhf",
      service_org: "Karnataka",
      gps_captured: "19-01-2023 9:00AM",
      last_app_usage: "19-01-2023 9:00AM",
      current_activity_status: "Trip Started",
    };
  });
  const handlepageChange = (offset, limit) => {
    console.log("offset", offset, limit);
    setPagination({
      offset: offset,
      limit: limit,
    });
  }
  return (
    <div className="page-wrap">
      <div className="service-static-container gap-3">
        <div className="service-static-left">
          <h4 className="service-static-header">Today's Service</h4>
          <div className="service-static-list">
            <ServiceCard
              title={"Service"}
              Count={12}
              className="card-border-yellow"
            />
          </div>
        </div>
        <div className="service-static-right">
          <h4 className="service-static-header">Overall Service Statistics</h4>
          <div className="service-static-list">
            <ServiceCard
              title={"Service MTD"}
              Count={12}
              className="card-border-blue"
            />

            <ServiceCard
              title={"Success"}
              Count={12}
              className="card-border-green"
            />
            <ServiceCard
              title={"Failure"}
              Count={12}
              className="card-border-orange"
            />
            <ServiceCard
              title={"Empty Return"}
              Count={12}
              className="card-border-gray"
            />
            <ServiceCard
              title={"Cancelled"}
              Count={12}
              className="card-border-red"
            />
            <ServiceCard
              title={"Rejected"}
              Count={12}
              className="card-border-purple"
            />
          </div>
        </div>
      </div>
      <div className="page-body">
        <TableWrapper
          title={"Own Portal"}
          columns={columns}
          data={data}
          expand={true}
          action={false}
          totalRecords={data.length}
          onPaginationChange={handlepageChange}
          tableScroll={"table-scroll"}
          selectionMode={null}
        />
      </div>
    </div>
  );
};

export default OwnPatrolDashboard;
