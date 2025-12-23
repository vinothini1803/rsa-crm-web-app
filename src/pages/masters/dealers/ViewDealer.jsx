import React, { useState } from "react";
import CustomBreadCrumb from "../../../components/common/CustomBreadCrumb";
import { CallCentreIcon, CloseIcon } from "../../../utills/imgConstants";
import { useNavigate, useParams } from "react-router";
import { TabMenu } from "primereact/tabmenu";
import { TabPanel, TabView } from "primereact/tabview";
import ViewGrid from "../../../components/common/ViewGrid";
import { useQuery } from "react-query";
import { dealerViewData } from "../../../../services/masterServices";
import Loader from "../../../components/common/Loader";
import { useSelector } from "react-redux";
import { CurrentUser } from "../../../../store/slices/userSlice";

const ViewDealer = () => {
  const navigate = useNavigate();
  const { dealer } = useParams();
  const [activeIndex, setActiveIndex] = useState(0);
  const loggedUser = useSelector(CurrentUser);

  const { data, isFetching } = useQuery(["dealerView"], () =>
    dealerViewData({ dealerId: dealer })
  );
  const Dealer = data?.data.data;
  const MenuItems = [
    {
      label: (
        <div
          onClick={() =>
            loggedUser?.role?.id != 31
              ? navigate("/admin/dealers")
              : navigate("/dealers")
          }
        >
          Dealer
        </div>
      ),
    },
    { label: <div>View Dealer</div> },
  ];
  const handleClose = () => {
    loggedUser?.role?.id != 31
      ? navigate("/admin/dealers")
      : navigate("/dealers");
  };

  const items = [{ label: "Basic Details" }, { label: "Address Details" }];

  const BasicDetailsData = [
    {
      label: "Group Code",
      value: Dealer?.groupCode ? Dealer?.groupCode : "--",
      vlaueClassName: Dealer?.groupCode ? "info-badge info-badge-purple" : "",
    },
    {
      label: "Dealer Code",
      value: Dealer?.code ?? "--",
      vlaueClassName: "info-badge info-badge-purple",
    },
    { label: "Type", value: Dealer?.type ?? "--" },
    { label: "Dealer Name", value: Dealer?.name ?? "--" },
    { label: "Legal Name", value: Dealer?.legalName ?? "--" },
    { label: "Trade Name", value: Dealer?.tradeName ?? "--" },
    {
      label: "Mobile Number",
      value: Dealer?.mobileNumber,
      vlaueClassName: "info-badge info-badge-yellow",
    },
    { label: "Email", value: Dealer?.email ?? "--" },
    { label: "GST IN", value: Dealer?.gstin ?? "--" },
    { label: "PAN", value: Dealer?.pan ?? "--" },
    { label: "CIN", value: Dealer?.cin ?? "--" },

    {
      label: "Mechanical Type",
      value: Dealer?.mechanicalType ?? "--",
      vlaueClassName: `info-badge ${
        Dealer?.mechanicalType == "Yes" ? `info-badge-green` : `info-badge-red`
      }`,
    },
    {
      label: "Is Exclusive",
      value: Dealer?.isExclusive ?? "--",
      vlaueClassName: `info-badge ${
        Dealer?.isExclusive == "Yes" ? `info-badge-green` : `info-badge-red`
      }`,
    },
    {
      label: "Body Part Type",
      value: Dealer?.bodyPartType ?? "--",
      vlaueClassName: `info-badge ${
        Dealer?.bodyPartType == "Yes" ? `info-badge-green` : `info-badge-red`
      }`,
    },

    { label: "Client", value: Dealer?.client ?? "--" },
    { label: "RSA Person Name", value: Dealer?.rsaPersonName ?? "--" },
    {
      label: "RSA Person Number",
      value: Dealer?.rsaPersonNumber ?? "--",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "RSA Person Alternate Number",
      value: Dealer?.rsaPersonAlternateNumber ?? "--",
      vlaueClassName: "info-badge info-badge-yellow",
    },

    {
      label: "SM Name",
      value: Dealer?.smName ?? "--",
    },
    {
      label: "SM Number",
      value: Dealer?.smNumber ?? "--",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "SM Alternate Number",
      value: Dealer?.smAlternateNumber ?? "--",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    { label: "OEM ASM Name", value: Dealer?.oemAsmName ?? "--" },
    {
      label: "OEM ASM Number",
      value: Dealer?.oemAsmNumber ?? "--",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "OEM ASM Alternate Number",
      value: Dealer?.oemAsmAlternateNumber ?? "--",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "Drop Dealers",
      value: Dealer?.dropDealers?.map((item) => item?.name).join(", "),
    },
    {
      label: "Auto Cancel For Delivery",
      value: Dealer?.autoCancelForDelivery ?? "--",
      vlaueClassName: `info-badge ${
        Dealer?.autoCancelForDelivery == "Yes"
          ? `info-badge-green`
          : `info-badge-red`
      }`,
    },
    {
      label: "Finance Admin",
      value: Dealer?.financeAdminUserName ?? "--",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "Status",
      value: Dealer?.status ?? "--",
      vlaueClassName: `info-badge ${
        Dealer?.status == "Active" ? `info-badge-green` : `info-badge-red`
      }`,
    },
  ];

  const AddressDetailsData = [
    { label: "Address Line 1", value: Dealer?.addressLineOne ?? "--" },
    { label: "Address Line 2", value: Dealer?.addressLineTwo ?? "--" },
    {
      label: "Correspondence Address",
      value: Dealer?.correspondenceAddress ?? "--",
    },
    { label: "State", value: Dealer?.state ?? "--" },
    { label: "City", value: Dealer?.city ?? "--" },
    { label: "Area", value: Dealer?.area ?? "--" },
    {
      label: "Pincode",
      value: Dealer?.pincode ?? "--",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "Latitude",
      value: Dealer?.lat ?? "--",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "Longitude",
      value: Dealer?.long ?? "--",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "Zone",
      value: Dealer?.zone ?? "--",
    },
  ];
  return (
    <div className="page-wrap">
      <CustomBreadCrumb items={MenuItems} milestone={false} />
      <div className="page-body">
        {isFetching ? (
          <Loader />
        ) : (
          <div className="page-content-wrap">
            <div className="page-content-header">
              <div className="d-flex align-items-center justify-content-between">
                <div className="page-content-title-wrap">
                  <div className="page-content-title-icon">
                    <img
                      className="img-fluid"
                      src={CallCentreIcon}
                      alt="Title Icon"
                    />
                  </div>
                  <div>
                    <h5 className="page-content-title">{Dealer?.name}</h5>
                  </div>
                </div>
                <div className="page-content-header-right">
                  {/* <div className="header-progressbar-wrap">
                <div className="header-progressbar-details  ">
                  <span className="header-progressbar-label">
                    Completetion Percentage
                  </span>
                  <span className="header-progressbar-value">50 %</span>
                </div>
                <ProgressBar value={50} showValue={false}></ProgressBar>
              </div> */}
                  <button className="btn btn-close" onClick={handleClose}>
                    <img className="img-fluid" src={CloseIcon} alt="Close" />
                  </button>
                </div>
              </div>
            </div>
            <div className="page-content-body">
              <TabMenu
                model={items}
                activeIndex={activeIndex}
                onTabChange={(e) => setActiveIndex(e.index)}
                className="spearate-tab-menu tab-bg-grey"
              />

              <TabView
                activeIndex={activeIndex}
                onTabChange={(e) => setActiveIndex(e.index)}
                className="tab-header-hidden dealer-tabview"
              >
                <TabPanel>
                  <div className="border-box bg-white">
                    <ViewGrid items={BasicDetailsData} className="grid-4" />
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="border-box bg-white">
                    <ViewGrid items={AddressDetailsData} className="grid-4" />
                  </div>
                </TabPanel>
              </TabView>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewDealer;
