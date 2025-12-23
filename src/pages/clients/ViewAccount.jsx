import { TabMenu } from "primereact/tabmenu";
import { TabPanel, TabView } from "primereact/tabview";
import React, { useState } from "react";
import {
  BuildingIcon,
  CloseIcon,
  MailIcon,
  PhoneCallIcon,
  TwitterIcon,
} from "../../utills/imgConstants";
import { useNavigate, useParams } from "react-router";
import ViewGrid from "../../components/common/ViewGrid";
import CustomBreadCrumb from "../../components/common/CustomBreadCrumb";
import ViewTable from "../../components/common/ViewTable";
import { Controller, useFormContext } from "react-hook-form";
import { InputSwitch } from "primereact/inputswitch";
import { useQuery } from "react-query";
import { viewClient } from "../../../services/masterServices";
import { Accordion, AccordionTab } from "primereact/accordion";
import { CollapseMinusIcon, CollapsePlusIcon } from "../../utills/imgConstants";

const ViewAccount = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const { clientId } = useParams();
  const [rows, setRows] = useState(10);
  const [first, setFirst] = useState(0);
  const [checked, setChecked] = useState(false);
  const MenuItems = [
    {
      label: <div onClick={() => navigate("/clients")}>Accounts</div>,
    },
    { label: <div>View Account</div> },
  ];
  const handleClose = () => {
    navigate("/clients");
  };
  const { data } = useQuery(["clientView"], () =>
    viewClient({
      clientId: clientId,
    })
  );
  const clientDetails = data?.data?.data;
  // console.log("client data", clientDetails);
  const AccountDetailData = [
    {
      label: "Account Code ",
      value: "EVTATA",
      vlaueClassName: "info-badge info-badge-purple",
    },
    {
      label: "Display Name",
      value: "Display Name",
    },
    {
      label: "Account Type",
      value: "--",
    },
    { label: "Dealer Option", value: "Generic" },
    {
      label: "Customer Toll Free Number",
      value: "43243 34562",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "ASP Toll Free Number",
      value: "43243 34562",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "ASM Toll Free Number",
      value: "43243 34562",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "RM Toll Free",
      value: "43243 34562",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "NM Toll Free",
      value: "43243 34562",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "DID Number",
      value: "4545",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "Service Contact",
      value: "Location Type",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "FH Toll Free",
      value: "43243 34562",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "Parent Account",
      value: "--",
      vlaueClassName: "info-badge info-badge-green",
    },
    {
      label: "Status",
      value: "Active",
      vlaueClassName: "info-badge info-badge-green",
    },
    {
      label: "Billing Address",
      value:
        "12/23, Block 2, Titan township,Mathigiri, Hosur, TamilNadu,India- 635110.",
    },
    {
      label: "Shipping Address",
      value:
        "12/23, Block 2, Titan township,Mathigiri, Hosur, TamilNadu,India- 635110.",
    },
  ];

  const ClientData = [
    {
      label: "Name",
      value: clientDetails?.name,
    },
    {
      label: "email",
      value: clientDetails?.email,
    },
    {
      label: "Mobile Number",
      value: clientDetails?.contactNumber,
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "Axapta Code",
      value: clientDetails?.axaptaCode,
    },
    {
      label: "Legal Name",
      value: clientDetails?.legalName,
    },
    {
      label: "Trade Name",
      value: clientDetails?.tradeName,
    },
    {
      label: "Invoice Code",
      value: clientDetails?.invoiceCode || "--",
    },
    {
      label: "Financial Dimension",
      value: clientDetails?.financialDimension,
    },
    {
      label: "Invoice Name",
      value: clientDetails?.invoiceName,
    },
    {
      label: "GSTIN",
      value: clientDetails?.gstin,
    },
    {
      label: "Customer Toll Free Number",
      value: clientDetails?.customerTollFreeNumber || "--",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "ASM Toll Free Number",
      value: clientDetails?.asmTollFreeNumber || "--",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "ASP Toll Free Number",
      value: clientDetails?.aspTollFreeNumber || "--",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "FH Toll Free Number",
      value: clientDetails?.fhTollFreeNumber || "--",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "NM Toll Free Number",
      value: clientDetails?.nmTollFreeNumber || "--",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "RM Toll Free Number",
      value: clientDetails?.rmTollFreeNumber || "--",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "DID Number",
      value: clientDetails?.didNumber || "--",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "Dialer Campaign Name",
      value: clientDetails?.dialerCampaignName || "--",
    },
    {
      label: "Call Center Name",
      value: clientDetails?.callCenters,
    },
    {
      label: "Business Category",
      value: clientDetails?.businessCategoryName,
    },
    {
      label: "TVS SPOC",
      value: clientDetails?.spocUserName,
    },
    {
      label: "Vehicle Type",
      value: clientDetails?.vehicleTypes,
    },
    {
      label: "Vehicle Make",
      value: clientDetails?.vehicleMakes,
    },
    {
      label: "Billing Address",
      value: `${clientDetails?.billingAddress}, ${clientDetails?.billingAddressCity}, ${clientDetails?.billingAddressState}, ${clientDetails?.billingAddressCountry} - ${clientDetails?.billingAddressPincode}`,
    },
    {
      label: "Shipping Address",
      value: `${clientDetails?.shippingAddress}, ${clientDetails?.shippingAddressCity},
      ${clientDetails?.shippingAddressState}, ${clientDetails?.shippingAddressCountry} - ${clientDetails?.shippingAddressPincode}`,
    },
    {
      label: "Status",
      value: clientDetails?.status ?? "--",
      vlaueClassName: `info-badge ${
        clientDetails?.status == "Active"
          ? `info-badge-green`
          : `info-badge-red`
      }`,
    },
  ];

  // const serviceEntitlement = clientDetails?.clientServices?.map((item, i) => {
  //   return [
  //     {
  //       name:"Service",
  //       label:item?.serviceName,
  //     },
  //     {
  //       name:"Policy Type",
  //       label: item?.policyTypeName,
  //     },
  //     {
  //       name:"Membership Type",
  //       label: item?.membershipTypeName,
  //     },
  //     {
  //       name:"Total Service",
  //       label: item?.totalService,
  //     },
  //     clientDetails?.clientServices?.subServices?.map((items) => {
  //       return[
  //       {
  //         name:"Sub Service",
  //         label: items?.subServiceName,
  //       },
  //       {
  //         name: "Limit",
  //         label: items?.limit,
  //       },
  //       {
  //         name: "Entitlement",
  //         label: items?.entitlementName,
  //       }
  //     ]
  //     })
  //   ]
  //   })

  const serviceEntitlement = clientDetails?.clientServices?.map(
    (service, i) => {
      return {
        serviceName: service?.serviceName,
        policyType: service?.policyTypeName,
        membershipType: service?.membershipTypeName,
        totalService: service?.totalService,
        subServices: service?.subServices?.map((subService) => ({
          subServiceName: subService?.subServiceName,
          limit: subService?.limit,
          entitlementName: subService?.entitlementName,
        })),
      };
    }
  );
  // const serviceEntitlementData = serviceEntitlement?.map((item, i) => {
  // return [
  //   {
  //     name:"Service",
  //     label:item?.serviceName,
  //   },
  //   {
  //     name:"Policy Type",
  //     label: item?.policyTypeName,
  //   },
  //   {
  //     name:"Membership Type",
  //     label: item?.membershipTypeName,
  //   },
  //   {
  //     name:"Total Service",
  //     label: item?.totalService,
  //   },
  //   clientDetails?.clientServices?.subServices?.map((items) => {
  //     return[
  //     {
  //       name:"Sub Service",
  //       label: items?.subServiceName,
  //     },
  //     {
  //       name: "Limit",
  //       label: items?.limit,
  //     },
  //     {
  //       name: "Entitlement",
  //       label: items?.entitlementName,
  //     }
  //   ]
  //   })
  // ]
  // })

  // console.log("entitlement", serviceEntitlement);

  const ContactColumns = [
    { title: "Name", field: "name" },
    { title: "Email ID", field: "email_id" },
    {
      title: "Phone number",
      field: "phone_number",
    },
  ];

  const EntitlementColumns = [
    { title: "Entitlement", field: "name" },
    { title: "Unit", field: "unit" },
    {
      title: "Limit",
      field: "limit",
    },
  ];
  const ServiceColumns = [
    { title: "Service Name", field: "service_name" },
    { title: "Price", field: "price" },
    {
      title: "Cap",
      field: "cap",
    },
    {
      title: "Status",
      field: "status",
      body: (field, record) => (
        <>
          {/* {console.log("records", record, field)} */}
          <InputSwitch
            checked={checked}
            onChange={(e) => setChecked(e.value)}
          />
        </>
      ),
    },
  ];
  const serviceData = Array.from({ length: 10 }, (element, index, k) => {
    return {
      service_name: "Towing",
      price: "₹ 5000 - ₹ 7000",
      cap: "2",
      status: true,
    };
  });
  const contactdata = Array.from({ length: 1 }, (element, index, k) => {
    return {
      name: clientDetails?.name,
      email_id: clientDetails?.email,
      phone_number: clientDetails?.contactNumber,
    };
  });
  const entitlementData = data?.data?.data?.clientEntitlements
  console.log("entitlementData",entitlementData)
  const items = [
    {
      label: "Account Details",
      content: (
        <div className="border-box bg-white">
          <ViewGrid items={ClientData} className="grid-4" />
        </div>
      ),
    },
    {
      label: "Contacts",
      content: (
        <ViewTable
          data={contactdata}
          Columns={ContactColumns}
          first={first}
          rows={rows}
          setRows={setRows}
          setFirst={setFirst}
          pagination={true}
          className={"asp-custom-table"}
        />
      ),
    },
    {
      label: "Service Entitlement",
      content: (
        <Accordion
          expandIcon={(options) => <CollapsePlusIcon {...options.iconProps} />}
          collapseIcon={(options) => (
            <CollapseMinusIcon {...options.iconProps} />
          )}
        >
          {serviceEntitlement?.map((service, i) => (
            <AccordionTab
              className="custom-accordian-tab"
              tabIndex={i}
              key={i}
              headerTemplate={() => (
                <div className="accordian-title d-flex align-items-center gap-2">
                  <span>{`SERVICE - ${i + 1}`}</span>
                </div>
              )}
            >
              <div className="border-box bg-white border-transparent mt-1">
                {/* Main Service Details */}
                <ViewGrid
                  items={[
                    {
                      label: "Service",
                      value: service?.serviceName || "Unknown",
                    },
                    {
                      label: "Policy Type",
                      value: service?.policyType || "N/A",
                    },
                    {
                      label: "Membership Type",
                      value: service?.membershipType || "N/A",
                    },
                    {
                      label: "Total Service",
                      value: service?.totalService || "N/A",
                    },
                  ]}
                  className="grid-4"
                />

                {/* Sub-Service Details */}
                {service?.subServices?.length > 0 && (
                  <div>
                    <span className="accordian-title d-flex align-items-center gap-2 mt-4">
                      Sub Service
                    </span>

                    <div className="sub-services mt-3">
                      {service.subServices.map((subService, j) => (
                        <div key={j} className="sub-service-details mt-2">
                          <ViewGrid
                            items={[
                              {
                                label: "Sub-Service",
                                value: subService?.subServiceName || "Unknown",
                              },
                              {
                                label: "Limit",
                                value: subService?.limit ?? "No Limit",
                              },
                              {
                                label: "Entitlement",
                                value: subService?.entitlementName || "N/A",
                              },
                            ]}
                            className="grid-4"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AccordionTab>
          ))}
        </Accordion>
      ),
    },
    {
      label: "Entitlements",
      content: (
        <ViewTable
          data={entitlementData}
          Columns={EntitlementColumns}
          first={first}
          rows={rows}
          setRows={setRows}
          setFirst={setFirst}
          pagination={true}
          className={"asp-custom-table"}
        />
      ),
    },
  ];
  return (
    <div className="page-wrap">
      <CustomBreadCrumb items={MenuItems} milestone={false} />
      <div className="page-body">
        <div className="page-content-wrap">
          <div className="page-content-header gap-4">
            <div className="d-flex align-items-center justify-content-between mb-2_3">
              <div className="page-content-title-wrap">
                <div className="page-content-title-icon">
                  <img
                    className="img-fluid"
                    src={BuildingIcon}
                    alt="Title Icon"
                  />
                </div>
                <div>
                  <h5 className="page-content-title">{clientDetails?.name}</h5>
                </div>
              </div>

              <div className="page-content-header-right">
                <button className="btn btn-close" onClick={handleClose}>
                  <img className="img-fluid" src={CloseIcon} alt="Close" />
                </button>
              </div>
            </div>
            <div className="d-flex gap-4_5 color-grey align-items-center">
              <div className="d-flex gap-2_3">
                <img src={MailIcon} alt="mail_icon" />
                <span>{clientDetails?.email}</span>
              </div>
              <div className="d-flex gap-2_3">
                <img src={PhoneCallIcon} alt="mail_icon" />
                <span>{clientDetails?.contactNumber}</span>
              </div>
              {/*  <div className="d-flex gap-2_3">
                <img src={TwitterIcon} alt="mail_icon" />
                <span>Twitter</span>
              </div> */}
            </div>
          </div>
          <div className="page-content-body">
            <TabMenu
              model={items}
              activeIndex={activeIndex}
              onTabChange={(e) => {
                setActiveIndex(e.index);
              }}
              className="spearate-tab-menu tab-bg-grey"
            />
            <TabView
              activeIndex={activeIndex}
              onTabChange={(e) => {
                setActiveIndex(e.index);
              }}
              className="tab-header-hidden dealer-tabview"
            >
              {items?.map((el, i) => {
                return <TabPanel key={i}>{el?.content}</TabPanel>;
              })}
            </TabView>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAccount;
