import React, { useState } from "react";
import { TabMenu } from "primereact/tabmenu";
import { CalenderIcon, ScreenViewIcon, TableEmptyImage } from "../../utills/imgConstants";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import NoDataComponent from "../../components/common/NoDataComponent";
import moment from "moment";
import PercentageBar from "../../components/common/PercentageBar";
import "./style.less";

const ServiceDetailCard = ({
  tabMenu,
  companyName,
  className,
  tableClassName,
  entitlementData,
  client,
  serviceTableScrollHidden,
  setFullEntitlementVisible,
  tabMenuItems,
  setActiveEntitlementIndex,
  selectedCaseSubService
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const items = [{ label: "TN 70 BB 2223" }, { label: "TN 70 AA 1234" }];
  const handleChange = (e) => {
    setActiveIndex(e.index);
    // console.log('Active Entitle Index', e.index)
    setActiveEntitlementIndex(e.index)
  };

  // console.log('Service Entitlement Data => ', entitlementData)

  // Function to determine row class based on dynamic condition
  const determineRowClassName = (rowData) => {
    // Example: Highlight rows where the 'status' property is 'high'
    const dynamicCondition = selectedCaseSubService ? rowData?.subService?.toString()?.toLowerCase() === selectedCaseSubService?.name?.toString()?.toLowerCase() ? true : false : false;
    console.log('dynamicCondition', dynamicCondition, selectedCaseSubService?.name, rowData?.subService, rowData);
    return dynamicCondition ? 'highlight-row' : '';
  };
  console.log("entitlementData",entitlementData)
  const data = [
    {
      service: "Towing",
      available: "Unlimited",
      availed: "Unlimited",
      cap: "Unlimited",
      balance: "Unlimited",
      color: "#794B2F",
    },
    {
      service: "Cab",
      available: "4",
      availed: "3",
      cap: "30 KM",
      balance: "Availed (Payable)",
      color: "#AC2A25",
    },
    {
      service: "Hotel",
      available: "4",
      availed: "2",
      cap: "₹ 500",
      balance: "1",
      color: "#FF762A",
    },
    {
      service: "Fuel",
      available: "1",
      availed: "0",
      cap: "5 Litres",
      balance: "5 Litres",
      color: "#FECC3F",
    },
    {
      service: "Hotel",
      available: "4",
      availed: "2",
      cap: "₹ 500",
      balance: "1",
      color: "#FF762A",
    },
    {
      service: "Fuel",
      available: "1",
      availed: "0",
      cap: "5 Litres",
      balance: "5 Litres",
      color: "#FECC3F",
    },
    {
      service: "Hotel",
      available: "4",
      availed: "2",
      cap: "₹ 500",
      balance: "1",
      color: "#FF762A",
    },
    {
      service: "Fuel",
      available: "1",
      availed: "0",
      cap: "5 Litres",
      balance: "5 Litres",
      color: "#FECC3F",
    },
  ];
  const columns = [
    {
      title: "Sub Service",
      field: "subService",
      body: (record, column) => {
        //console.log("record, column", record, column);
        return (
          <div className="col-service">
            {/* <div
              className="dot-container"
              style={{ backgroundColor: record.color }}
            ></div> */}
            <div className="service-text">{record.subService}</div>{" "}
          </div>
        );
      },
    },
    {
      title: "Total",
      field: "totalService",
      body: (record, column) => {
        //console.log("record, column", record, column);
        return <div className="color-grey fnt-md">{record.totalService}</div>;
      },
    },
    {
      title: "Available",
      field: "availableService",
      body: (record, column) => {
        //console.log("record, column", record, column);
        return (
          <div className="color-grey fnt-md">{record.availableService}</div>
        );
      },
    },
    /* {
      title: "Availed",
      field: "availed",
      body: (record, column) => {
        //console.log("record, column", record, column);
        return <div className="color-grey fnt-md">{record.availed}</div>;
      },
    }, */
    {
      title: "Entitlement",
      field: "entitlement",
      body: (record, column) => {
        //console.log("recordc, column", column);
        return (
          <div className={`color-grey font-sbd`}>{record.entitlement || '--'}</div>
        );
      },
    },
    {
      title: "Limit",
      field: "entitlementLimit",
      body: (record, column) => {
        //console.log("recordc, column", column);
        return (
          <div className={`color-grey font-sbd`}>
            {record.entitlementLimit}{" "}
            {record.entitlementLimit && record?.entitlementUnit || '--'}
          </div>
        );
      },
    },
    /* {
      title: "Balance",
      field: "entitlementLimit",
      body: (record, column) => {
        //console.log("record, column", record, column);
        return (
          <div
            className={`${
              record.balance == "Unlimited"  ? "color-success" : record.balance == "Availed (Payable)" ? "color-danger": "color-text"
            } fnt-sbd`}
          >
            {record.balance}
          </div>
        );
      },
    }, */
  ];
  const searchColumns = [
    {
      title: "Service",
      field: "service",
      body: (record, column) => {
        //console.log("record, column", record, column);
        return (
          <div className="col-service">
            {/* <div
              className="dot-container"
              style={{ backgroundColor: record.color }}
            ></div> */}
            <div className="service-text">{record.service}</div>{" "}
          </div>
        );
      },
    },
    {
      title: "Total",
      field: "totalService",
      body: (record, column) => {
        //console.log("record, column", record, column);
        return <div className="color-grey fnt-md">{record.totalService}</div>;
      },
    },
    {
      title: "Availed",
      field: "availedService",
      body: (record, column) => {
        //console.log("record, column", record, column);
        return <div className="color-grey fnt-md">{record.availedService}</div>;
      },
    },
    {
      title: "Available",
      field: "availableService",
      body: (record, column) => {
        //console.log("record, column", record, column);
        return (
          <div className="color-grey fnt-md">{record.availableService}</div>
        );
      },
    },
  ];
  console.log("Selected Sub Service in Entitlement", selectedCaseSubService);
  console.log("Service Card Entitlement => ", entitlementData);

  return (
    <div className={`search-results-card service-detail-card ${className}`}>
      <div
        className={`service-detail-card-header ${
          companyName ? "brdr-transparent" : ""
        } ${tabMenu !== false ? 'align-items-end justify-content-between' : ''}`}
        
      >
        {companyName && (
          <>
            <div className="company-name">
              {client ? client?.name?.toUpperCase() : "Royal Sundaram Diversion"}
            </div>
            {(entitlementData?.service && entitlementData?.policyData) && 
              <div className="service-detail-card-header-chip">{entitlementData?.service}</div>
            }
            {(entitlementData?.policyData && entitlementData?.fullScreenView !== false) && 
              <div className="screenview-icon" onClick={() => setFullEntitlementVisible(true)}>
                <img src={ScreenViewIcon} />
              </div>
            }
          </>
        )}
        
        {(tabMenu !== false && tabMenuItems?.length > 0) && (
          <>
            <TabMenu
              model={tabMenuItems?.map((item) => {
                return {
                  label: item?.vehicleRegistrationNumber || item?.vin
                }
              })}
              activeIndex={activeIndex}
              onTabChange={handleChange}
            />
            {entitlementData?.policyData && 
              <div className="screenview-icon" style={{position: 'absolute', top:'6px', right:'20px'}} onClick={() => setFullEntitlementVisible(true)}>
                <img src={ScreenViewIcon} />
              </div>
            }
          </>
          
        )}
      </div>
      {entitlementData?.quickSearch ? (
        <div
          className={`service-detail-card-body ${
            companyName ? "with-company-name" : ""
          }`}
        >
          {entitlementData?.policyData ? (
            <>
              <div className="policy-no">
                Policy No : {entitlementData?.policyData?.policyNumber || "--"}
              </div>
              {(entitlementData?.policyData?.policyStartDate && entitlementData?.policyData?.policyEndDate) && 
                <div className="date-contanier">
                  <img src={CalenderIcon} />
                  <div className="date">
                    {entitlementData?.policyData?.policyStartDate} -{" "}
                    {entitlementData?.policyData?.policyEndDate }{" "}
                    <span className="service-status">Active</span>
                  </div>
                </div>
              }
              
              {entitlementData?.customerServiceEntitlements?.length > 0 && (
                <>
                  {/* <div className="row">
                    <div className="col-md-4">
                      <div className="service-count">
                        <span className="service-count-label">Total services </span>
                        <span>
                          <b>
                            :{" "}
                            {entitlementData?.totalService !== null &&
                            entitlementData?.totalService !== undefined
                              ? entitlementData?.totalService
                              : "-"}
                          </b>
                        </span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="service-count">
                        <span className="service-count-label">Availed </span>
                        <span>
                          <b>
                            :{" "}
                            {entitlementData?.availedService !== null &&
                            entitlementData?.availedService !== undefined
                              ? entitlementData?.availedService
                              : "-"}
                          </b>
                        </span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="service-count">
                        <span className="service-count-label">Available </span>
                        <span>
                          <b>
                            :{" "}
                            {entitlementData?.availableService !== null &&
                            entitlementData?.availableService !== undefined
                              ? entitlementData?.availableService
                              : "-"}
                          </b>
                        </span>
                      </div>
                    </div>
                  </div> */}
                  <DataTable
                    value={
                      entitlementData?.customerServiceEntitlements
                        ? entitlementData?.customerServiceEntitlements
                        : []
                    }
                    className={`service-table hide-last-row-border ${
                      tableClassName ?? tableClassName
                    } ${serviceTableScrollHidden ? "scroll-hidden" : ""}`}
                    rowClassName={determineRowClassName}
                    scrollable
                    emptyMessage={<NoDataComponent image={TableEmptyImage} text='The Entitlement Service is currently not accessible for this policy.' />}
                  >
                    {searchColumns?.map((column, i) => (
                      <Column
                        key={i}
                        field={column.field}
                        header={column.title}
                        body={column.body}
                      ></Column>
                    ))}
                  </DataTable>
                </>
              )}
            </>
          ) : (
            <div className="d-flex flex-column align-items-center pb-3">
              <img className="img-fluid" src={TableEmptyImage} alt="Entitlement Empty" style={{maxWidth: '120px'}} />
              <h6 className="text-center">The policy is unavailable.</h6>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`service-detail-card-body ${
            companyName ? "with-company-name" : ""
          }`}
        >
          {entitlementData?.policyData ? (
            <>
              <div className="policy-no">
                Policy No : {entitlementData?.policyData?.policyNumber || "--"}
              </div>
              {(entitlementData?.policyData?.policyStartDate !="Invalid date" && entitlementData?.policyData?.policyEndDate !="Invalid date") ? 
                <div className="date-contanier">
                  <img src={CalenderIcon} />
                  <div className="date">
                    {entitlementData?.policyData?.policyStartDate} -{" "}
                    {entitlementData?.policyData?.policyEndDate }{" "}
                    <span className="service-status">Active</span>
                  </div>
                </div>:null
              }
              {/*  <PercentageBar
                items={[
                  { label: "Towing", value: 6, color: "#794B2F" },
                  { label: "Cab", value: 3, color: "#AC2A25" },
                  { label: "Hotel", value: 2, color: "#FF762A" },
                  { label: "Fuel", value: 8, color: "#FECC3F" },
                  { label: "BreakDown", value: 8, color: "#1BA9D2" },
                ]}
              /> */}
              
              {entitlementData?.customerServiceEntitlements?.length > 0 && (
                <>
                  <div className="row">
                    <div className="col-md-4">
                      <div className="service-count">
                        <span className="service-count-label">Total services </span>
                        <span>
                          <b>
                            :{" "}
                            {entitlementData?.totalService !== null &&
                            entitlementData?.totalService !== undefined
                              ? entitlementData?.totalService
                              : "-"}
                          </b>
                        </span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="service-count">
                        <span className="service-count-label">Availed </span>
                        <span>
                          <b>
                            :{" "}
                            {entitlementData?.availedService !== null &&
                            entitlementData?.availedService !== undefined
                              ? entitlementData?.availedService
                              : "-"}
                          </b>
                        </span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="service-count">
                        <span className="service-count-label">Available </span>
                        <span>
                          <b>
                            :{" "}
                            {entitlementData?.availableService !== null &&
                            entitlementData?.availableService !== undefined
                              ? entitlementData?.availableService
                              : "-"}
                          </b>
                        </span>
                      </div>
                    </div>
                  </div>
                  <DataTable
                    value={
                      entitlementData?.customerServiceEntitlements  
                        ? entitlementData?.customerServiceEntitlements
                        : []
                    }
                    className={`service-table hide-last-row-border ${
                      tableClassName ?? tableClassName
                    } ${serviceTableScrollHidden ? "scroll-hidden" : ""}`}
                    rowClassName={determineRowClassName}
                    scrollable
                  >
                    {columns?.map((column, i) => (
                      <Column
                        key={i}
                        field={column.field}
                        header={column.title}
                        body={column.body}
                        emptyMessage={<NoDataComponent image={TableEmptyImage} text='The Entitlement Service is currently not accessible for this policy.' />}
                      ></Column>
                    ))}
                  </DataTable>
                </>
              )}
            </>
          ) : (
            <div className="d-flex flex-column align-items-center pb-3">
              <img className="img-fluid" src={TableEmptyImage} alt="Entitlement Empty" style={{maxWidth: '120px'}} />
              <h6 className="text-center">The policy is unavailable.</h6>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceDetailCard;
