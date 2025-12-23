import React from "react";
import CustomBreadCrumb from "../../components/common/CustomBreadCrumb";
import ViewGrid from "../../components/common/ViewGrid";
import { useQuery } from "react-query";
import { viewTds } from "../../../services/tdsService";
import { useNavigate, useParams } from "react-router";
import CurrencyFormat from "../../components/common/CurrencyFormat";
import { CloseIcon } from "../../utills/imgConstants";

const ViewTds = () => {
  const { id } = useParams();

  const { data } = useQuery(["viewtds"], () => viewTds({ id: id }));
  const navigate = useNavigate();

  console.log("view tds", data?.data?.data);
  const MenuItems = [
    { label: <div onClick={() => navigate("/tds")}>TDS</div> },
    { label: <div>View TDS</div> },
  ];

  const tdsDetails = [
    { label: "Dealer Name", value: data?.data?.data?.dealerName },
    { label: "Dealer Code", value: data?.data?.data?.dealerCode },
    { label: "Customer Code", value: data?.data?.data?.customerCode },
    { label: "From Date", value: data?.data?.data?.period?.split(" - ")[0] },
    { label: "To Date", value: data?.data?.data?.period?.split(" - ")[1] },
    { label: "Description", value: data?.data?.data?.description },
    {
      label: "Amount",
      value: <CurrencyFormat amount={data?.data?.data?.amount} />,
    },
    { label: "Status", value: data?.data?.data?.status },
  ];

  const handleClose = () => {
    navigate("/tds");
  };
  return (
    <div className="page-wrap">
      <CustomBreadCrumb items={MenuItems} milestone={false} />

      <div className="page-body">
        <div className="page-content-wrap">
          <div className="page-content-header">
            <div className="d-flex align-items-center justify-content-between">
              <div className="page-content-title-wrap">
                <div>
                  <h5 className="page-content-title">TDS</h5>
                </div>
              </div>
              <div className="page-content-header-right">
                <button className="btn btn-close" onClick={handleClose}>
                  <img className="img-fluid" src={CloseIcon} alt="Close" />
                </button>
              </div>
            </div>
          </div>
          <div className="page-content-body">
            <div className="border-box bg-white">
              <ViewGrid items={tdsDetails} className="grid-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTds;
