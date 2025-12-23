import React from 'react';
import { Outlet } from 'react-router';
import { LogoImage } from '../../utills/imgConstants';

const CustomerLayout = () => {
  return (
    <div className="container">
      <div className="customerLayout-page">
        <div className="customerLayout-header">
          <img className="img-fluid" src={LogoImage} alt="logo" />
          <div>
            <h5 className="customerLayout-header-title">ROADCAREPRO</h5>
            <p className="customerLayout-header-subtitle">
              On the Road, Beyond Expectations
            </p>
          </div>
        </div>
        <div className="customerLayout-body">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default CustomerLayout