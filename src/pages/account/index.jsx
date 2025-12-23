import React, { useState } from "react";
import {
  CloseIcon,
  EditGreyIcon,
  EditIcon,
  UserImage,
} from "../../utills/imgConstants";
import { Button } from "primereact/button";
import StatusBadge from "../../components/common/StatusBadge";
import TabMenuItem from "../../components/common/TabMenuItem";
import { TabMenu } from "primereact/tabmenu";
import { TabPanel, TabView } from "primereact/tabview";
import ViewGrid from "../../components/common/ViewGrid";
import CurrencyFormat from "../../components/common/CurrencyFormat";
import { useNavigate } from "react-router";

const AccountProfile = () => {
  const navigate = useNavigate();
  const handleClose = () => {
    navigate("/delivery-request");
  };
  const [activeIndex, setActiveIndex] = useState(0);

  const TabMenus = [
    {
      label: <TabMenuItem label="Basic Info" />,
      details: [
        {
          label: "Email Id",
          value: "ramkeyagencies@gmail.com",
          vlaueClassName: "",
        },
        {
          label: "Contact Number",
          value: "9876543211",
          vlaueClassName: "info-badge info-badge-yellow",
        },
        {
          label: "GSTIN",
          value: "33ABCFR6490G1Z4",
          vlaueClassName: "info-badge info-badge-purple",
        },
        {
          label: "PAN Number",
          value: "ABCFR6490G",
          vlaueClassName: "info-badge info-badge-purple",
        },
        {
          label: "Client",
          value: "Toyota",
        },
        {
          label: "Mechanical Type",
          value: "Yes",
          vlaueClassName: "info-badge info-badge-green",
        },
        {
          label: "Body Part Type",
          value: "No",
          vlaueClassName: "info-badge info-badge-red",
        },
        {
          label: "RSA Person Name",
          value: "R Prakash Karthikeyan",
        },
        {
          label: "RSA Person Contact Number",
          value: "9876543211",
          vlaueClassName: "info-badge info-badge-yellow",
        },
        {
          label: "RSA Person Alternative Contact Number",
          value: "9876543211",
          vlaueClassName: "info-badge info-badge-yellow",
        },
        {
          label: "Sales / Service Manager Name",
          value: "Loganathan",
        },
        {
          label: "Sales / Service Manager Contact Number",
          value: "9876543211",
          vlaueClassName: "info-badge info-badge-yellow",
        },
        {
          label: "OEM ASM Name",
          value: "Loganathan",
        },
        {
          label: "OEM ASM Contact Number",
          value: "9876543211",
          vlaueClassName: "info-badge info-badge-yellow",
        },
        {
          label: "OEM ASM Alternate Contact Number",
          value: "9876543211",
          vlaueClassName: "info-badge info-badge-yellow",
        },
        {
          label: "Zone",
          value: "South",
        },
        {
          label: "Service Regional Manager",
          value: "Prabakaran",
        },
        {
          label: "Sales Regional Manager",
          value: "Ram",
        },
      ],
    },
    {
      label: <TabMenuItem label="Address Info" />,
      details: [
        {
          label: "Address Line 1",
          value: "12/12, Block 9, Titan Township,Mathigiri.",
        },
        {
          label: "Address Line 2",
          value: "12/12, Block 9, Titan Township,Mathigiri.",
        },
        { label: "Area", value: "Adayar" },
        { label: "City", value: "Chennai" },
        { label: "Taluk", value: "Chennai" },
        { label: "State", value: "Tamil nadu" },
        {
          label: "Pin code",
          value: "635110",
          vlaueClassName: "info-badge info-badge-yellow",
        },
        {
          label: "Latitude",
          value: "85.80390167236334",
          vlaueClassName: "info-badge info-badge-yellow",
        },
        {
          label: "Longitude",
          value: "20.80390167236334",
          vlaueClassName: "info-badge info-badge-yellow",
        },
      ],
    },
    {
      label: <TabMenuItem label="Payment Info" />,
      details: [
        {
          label: "Payment Mode",
          value: "TVS Auto Assist Wallet",
        },
        {
          label: "Wallet Balance",
          value: (
            <CurrencyFormat
              amount={"430043"}
              color={"#4DB86B"}
              fontWeight={"700"}
            />
          ),
          action: "Topup",
        },
      ],
    },
  ];
  return (
    <div className="page-wrap">
      <div className="page-body">
        <div className="profile-header-container">
          <div className="profile-header">
            <div>
              <div className="profile-title">Profile</div>
              <div className="manage-profile-title">Manage your profile</div>
            </div>
            <div className="profile-header-right">
              <button className="btn btn-close" onClick={handleClose}>
                <img className="img-fluid" src={CloseIcon} alt="Close" />
              </button>
            </div>
          </div>
          <div className="profile-header-main-content">
            <div className="profile-content">
              <div className="profile-user">
                <img src={UserImage} alt="user" />
                <div className="profile-user-details">
                  <div className="d-flex gap-1_2">
                    <div className="profile-name">RAMKAY AGENCIES LLP</div>
                    <div>
                      <StatusBadge
                        statusId={4}
                        className={"rounded brdr-transparent profile-badge"}
                        text={"Active"}
                      />
                    </div>
                  </div>
                  <StatusBadge
                    statusId={10}
                    className={"rounded brdr-transparent profile-badge"}
                    text={"123456"}
                  />
                </div>
              </div>
              <Button
                className="btn btn-white btn-with-icon ms-auto"
                //onClick={handleCancel}
                type="button"
              >
                <img src={EditGreyIcon} />
                <span>Edit</span>
              </Button>
            </div>
            <div>
              <TabMenu
                model={TabMenus}
                activeIndex={activeIndex}
                onTabChange={(e) => setActiveIndex(e.index)}
                className="spearate-tab-menu"
              />
            </div>
          </div>
        </div>

        <div className="profile-body-container">
          <TabView
            className={`tab-header-hidden case-view-tab ${"border-box bg-white border-transparent"} `}
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
          >
            {TabMenus?.map((tab) => (
              <TabPanel>
                <ViewGrid items={tab?.details} className="grid-5" />
              </TabPanel>
            ))}
          </TabView>
        </div>
      </div>
    </div>
  );
};

export default AccountProfile;
