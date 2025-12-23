import React, { useEffect, useState } from "react";
import CustomBreadCrumb from "../../../components/common/CustomBreadCrumb";
import Favourites from "../Favourites";
import ReportConfiguration from "./ReportConfiguration";
import { Button } from "primereact/button";
import { DialogCloseSmallIcon } from "../../../utills/imgConstants";
import { useNavigate } from "react-router";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { getReportList } from "../../../../services/reportService";

const ReminderReport = () => {
  const navigate = useNavigate();
  let pathname = useLocation();
  const { id } = useParams();
  const [reportName, setReportName] = useState(null);

  const MenuItems = [
    {
      label: <div onClick={() => navigate("/reports")}>Reports</div>,
    },
    { label: <div>{reportName}</div> },
  ];
  const { data: reportListData } = useQuery(
    ["getReportList"],
    () => getReportList(),
    {
      refetchOnWindowFocus: false,
    }
  );
  useEffect(() => {
    if (id) {
      let reportLabel = reportListData?.data?.data?.find(
        (item) => id == item.id
      )?.name;
      setReportName(reportLabel);
    }
  }, [reportListData]);
  return (
    <div className="page-wrap">
      <CustomBreadCrumb items={MenuItems} milestone={false} />
      <div className="page-body">
        <div className="row row-gap-3_4">
          {/* <div className="col-md-12 col-lg-4">
            <Favourites
              // favourites={[
              //   { name: "Report 1" },
              //   { name: "Report 2" },
              //   { name: "Report 3" },
              // ]}
              initialFavourites={[{ name: "Report 1" }, { name: "Report 2" }]}
              OnReportClick={() => console.log("Report clicked")}
            />
          </div> */}
          <div className="col-md-12 ">
            <ReportConfiguration id={id} reportName={reportName} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderReport;
