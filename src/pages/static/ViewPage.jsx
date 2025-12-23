import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from "react-router";
import CustomBreadCrumb from '../../components/common/CustomBreadCrumb';
import ViewGrid from '../../components/common/ViewGrid';
import { FolderIcon, CloseIcon } from "../../utills/imgConstants";

const ViewPage = () => {

  const navigate = useNavigate();

  //Go Back
  const goBack = () => {
    navigate('/static');
  };

  //Breadcrumb Items
  const breadcrumbItems = [
    {
      label: <div onClick={() => navigate("/static")}>List</div>,
      //url: "/master",
    },
    { label: "View" }
  ];

  //ViewGrid Items
  const gridItems = [
    {
      label: 'RSA Person Name',
      value: 'Lokesh Kumar'
    },
    {
      label: 'Address',
      value: '12/12, Block 9, Titan Township, Mathigiri.'
    },
    {
      label: 'Pin code',
      value: '635110',
      vlaueClassName: 'info-badge info-badge-yellow'
    },
    {
      label: 'Registration Date',
      value: '02/03/2022',
      vlaueClassName: 'info-badge info-badge-purple'
    },
    {
      label: 'Fuel Type',
      value: 'Diesel',
      vlaueClassName: 'info-badge info-badge-blue',
      itemClassName: 'separator-none'
    },
    {
      label: 'Mechanical Type',
      value: 'No',
      vlaueClassName: 'info-badge info-badge-red',
      itemClassName: 'separator-none'
    },
    {
      label: 'Status',
      value: 'Active',
      vlaueClassName: 'info-badge info-badge-green',
      itemClassName: 'separator-none'
    }
  ]


  return (
    <div className="page-wrap">
      <CustomBreadCrumb items={breadcrumbItems} />
      <div className="page-body">
        <div className="page-content-wrap view-page">
          <div className="page-content-header">
            <div className="d-flex align-items-center justify-content-between">
              <div className="page-content-title-wrap">
                <div className="page-content-title-icon">
                  <img
                    className="img-fluid"
                    src={FolderIcon}
                    alt="Title Icon"
                  />
                </div>
                <div>
                  <h5 className="page-content-title">ARK Automobiles</h5>
                </div>
              </div>
              <div className="page-content-header-right">
                <button className="btn btn-close" onClick={goBack}>
                  <img className="img-fluid" src={CloseIcon} alt="Close" />
                </button>
              </div>
            </div>
          </div>
          {/* <!-- Page Content Header --> */}
          <div className="page-content-body">
            <div className="border-box">
              <ViewGrid items={gridItems} className='grid-4' />
            </div>
          </div>
          {/* <!-- Page Content Body --> */}
        </div>
        {/* <!-- Page Content Wrap --> */}
      </div>
      {/* <!-- Page Body --> */}
    </div>
  )
}

export default ViewPage