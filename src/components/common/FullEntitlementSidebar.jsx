import React, { useState } from 'react';
import { Sidebar } from "primereact/sidebar";
import { useQuery, useMutation } from "react-query";
import { Accordion, AccordionTab } from "primereact/accordion";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import NoDataComponent from './NoDataComponent';
import { CloseIcon, CalenderIcon, CollapseMinusIcon, CollapsePlusIcon, TableEmptyImage } from '../../utills/imgConstants';
import { getFullServiceEntitlements } from '../../../services/caseService';
import moment from "moment";

const FullEntitlementSidebar = ({visible, setVisible, caseData, selectedCaseService, selectedCaseSubService,memberGetData}) => {

  // console.log("Full Entitlement Casedata ", caseData);
  const [activeIndex, setActiveIndex] = useState(0);

  const { data: fullEntilementData} = useQuery(["getFullServiceEntitlements", caseData], () => getFullServiceEntitlements({
    clientId: caseData?.clientId,
    vin: caseData?.vin || memberGetData?.data?.vehicle_details?.vi_number || null,
    vehicleRegistrationNumber: caseData?.vehicleRegistrationNumber ||  memberGetData?.data?.vehicle_details?.registration_number || null,
    policyTypeId: caseData?.policyTypeId,
    // policyTypeId: caseData?.extras?.policyDetails?.policy_type ? 
    // caseData?.extras?.policyTypes?.find((item) => item?.name?.toLowerCase() == caseData?.extras?.policyDetails?.policy_type?.toLowerCase())?.id : 434,
    // policyNumber: caseData?.extras?.policyDetails?.policy_number || null, //nullable
    // membershipTypeId: caseData?.extras?.policyDetails?.membership_type_id || null, // policyTypeId rsa means required.
    policyNumber: memberGetData ? memberGetData?.data?.policy_detail?.policy_number :  caseData?.extras?.policyDetails?.policy_number   || null, //nullable
    membershipTypeId: memberGetData ? memberGetData?.data?.policy_detail?.membership_type_id  : caseData?.extras?.policyDetails?.membership_type_id || null, // policyTypeId rsa means required.
    typeId: 0
  }), {
    // enabled: (caseData && caseData?.extras?.policyDetails && visible ) ? true : false,
    enabled: (caseData  && visible ) ? true : false,
    refetchOnWindowFocus: false,
    onSuccess: (res) => {
      if (res?.data?.success && selectedCaseService) {
        res?.data?.data?.map((entitlement, i)=> {
          if(entitlement?.service?.toLowerCase() == selectedCaseService?.name?.toLowerCase()) {
            setActiveIndex(i);
          }
        })
      }
    }
  });

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

  // console.log('Full Entitlement Service => ', fullEntilementData?.data)

  // Function to determine row class based on dynamic condition
  const determineRowClassName = (rowData) => {
    // Example: Highlight rows where the 'status' property is 'high'
    const dynamicCondition = rowData?.subService?.toString()?.toLowerCase() == selectedCaseSubService?.name?.toString()?.toLowerCase();
    console.log('dynamicCondition', dynamicCondition, selectedCaseSubService?.name, rowData?.subService);
    return dynamicCondition ? 'highlight-row' : '';
  };

  return (
    <Sidebar
      visible={visible}
      position="right"
      onHide={() => setVisible(false)}
      showCloseIcon={false}
      pt={{
        root: {
          className: "w-564",
        },
        header: {
          className: "sidebar-content-header align-items-start shadow",
        },
      }}
      icons={
        <>
          <div className='sidebar-title-wrap d-flex flex-column gap-2'>
            <div className="sidebar-title">{caseData?.clientName?.toUpperCase()}</div>
            <div className="policy-no">Policy No : {caseData?.extras?.policyDetails?.policy_number? caseData?.extras?.policyDetails?.policy_number : memberGetData?.data?.policy_detail?.policy_number  || "--"}</div>
            {((memberGetData?.data?.policy_detail?.start_date || caseData?.extras?.policyDetails?.start_date) && (memberGetData?.data?.policy_detail?.end_date || caseData?.extras?.policyDetails?.end_date)) && 
              <div className="d-flex align-items-center gap-2">
                <img src={CalenderIcon} style={{marginInlineEnd: '0'}} />
                <div className="date">
                  {moment(memberGetData?.data?.policy_detail?.start_date ? memberGetData?.data?.policy_detail?.start_date :caseData?.extras?.policyDetails?.start_date).format("DD/MM/YYYY")} -{" "}
                  {moment(memberGetData?.data?.policy_detail?.end_date ? memberGetData?.data?.policy_detail?.end_date :caseData?.extras?.policyDetails?.end_date).format("DD/MM/YYYY")}
                </div>
                <span className="fnt-sbd color-success">Active</span>
              </div>
            }


                   
          </div>
          <button
            className="btn btn-close ms-auto"
            onClick={() => setVisible(false)}
          >
            <img className="img-fluid" src={CloseIcon} alt="Close" style={{marginInlineEnd: '0'}} />
          </button>
        </>
      }
    >
      <div className="sidebar-content-wrap">
        <div className="sidebar-content-body">
          {fullEntilementData?.data?.success && fullEntilementData?.data?.data?.length > 0 ? ( 
            <div className="">
              <Accordion
                className="accordian-custom-header case-accordian"
                expandIcon={(options) => (
                  <CollapsePlusIcon {...options.iconProps} />
                )}
                collapseIcon={(options) => (
                  <CollapseMinusIcon {...options.iconProps} />
                )}
                activeIndex={activeIndex}
                onTabChange={(e) => setActiveIndex(e.index)}
              >
                {fullEntilementData?.data?.data?.map((entitlement, index) => (
                  <AccordionTab
                    key={index}
                    className={`custom-accordian-tab ${entitlement?.service?.toLowerCase() == selectedCaseService?.name?.toLowerCase() ? 'selected-accordin' : ''}`}
                    tabIndex={index}
                    headerTemplate={(e) => {
                      return (
                        <div className="accordian-title">
                          <span>{entitlement?.service}</span>
                          {(entitlement?.service?.toLowerCase() == selectedCaseService?.name?.toLowerCase()) && 
                            <span className='selected-chip'>Selected</span>
                          }
                        </div>
                      );
                    }}
                  >
                    <div>
                      <div className="row mt-2 mb-3">
                        <div className="col-md-4">
                          <div className="service-count">
                            <span className="service-count-label">Total services </span>
                            <span>
                              <b>
                                :{" "}
                                {entitlement?.totalService !== null &&
                                entitlement?.totalService !== undefined
                                  ? entitlement?.totalService
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
                                {entitlement?.availedService !== null &&
                                entitlement?.availedService !== undefined
                                  ? entitlement?.availedService
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
                                {entitlement?.availableService !== null &&
                                entitlement?.availableService !== undefined
                                  ? entitlement?.availableService
                                  : "-"}
                              </b>
                            </span>
                          </div>
                        </div>
                      </div>
                      <DataTable
                        value={
                          entitlement?.customerServiceEntitlements
                            ? entitlement?.customerServiceEntitlements
                            : []
                        }
                        className={`service-table hide-last-row-border scroll-hidden`}
                        rowClassName={determineRowClassName}
                        scrollable
                      >
                        {columns?.map((column, i) => (
                          <Column
                            key={i}
                            field={column.field}
                            header={column.title}
                            body={column.body}
                            // className={column.field == selectedCaseSubService?.name ? 'selected' : ''}
                          ></Column>
                        ))}
                      </DataTable>
                    </div>
                  </AccordionTab>
                ))}
              </Accordion>
            </div>
          ) : (
            <NoDataComponent image={TableEmptyImage} text='The Entitlement Service is currently not accessible for this policy.' />
          )}
        </div>
      </div>
    </Sidebar>
  )
}

export default FullEntitlementSidebar