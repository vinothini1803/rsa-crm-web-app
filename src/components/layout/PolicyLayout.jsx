import React, { useState } from "react";
import { PolicyheaderIcon } from "../../utills/imgConstants";
import { Link, Outlet } from "react-router-dom";
import ContactUsDialog from "../common/ContactUsDialog";

const PolicyLayout = () => {
  const [visible, setVisible] = useState(false);

  const handleContactUs = (e) => {
    e.preventDefault();
    setVisible(true);
  };
  return (
    <div className="page-wrap">
      <div className="policy-page-header">
        <div className="logo-container">
          <img src={PolicyheaderIcon} />
        </div>
        <div>
          <div className="road-care-pro-title">ROADCAREPRO</div>
          <div className="road-care-pro-subtitle">
            On the Road, Beyond Expectations
          </div>
        </div>
      </div>

      <Outlet />

      <div className="policy-page-footer">
        <div className="footer-content">
          <div className="auth-footer-list-wrap">
            <ul className="auth-footer-list">
              <li>
                <Link
                  className="auth-footer-link"
                  to="#"
                  onClick={handleContactUs}
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link className="auth-footer-link" to="/terms" target="_blank">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  className="auth-footer-link"
                  to="/privacy"
                  target="_blank"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
            <p className="auth-footer-txt copyright-text">
              © 2024,CRM. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
      <ContactUsDialog visible={visible} setVisible={setVisible} />
    </div>
  );
};

export default PolicyLayout;
