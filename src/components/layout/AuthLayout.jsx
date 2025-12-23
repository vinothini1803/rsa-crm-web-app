import React, { useState } from "react";
import { Outlet } from "react-router";
import { Link } from "react-router-dom";
import { AuthIllustrationImage, LogoImage } from "../../utills/imgConstants";
import ContactUsDialog from "../common/ContactUsDialog";

const AuthLayout = ({ layout }) => {
  const [visible, setVisible] = useState(false);
  const handleContactUs = (e) => {
    e.preventDefault();
    setVisible(true);
  };

  return (
    <>
      <div className="auth-page">
        <div className="auth-header">
          <div className="auth-logo-wrap">
            <img src={LogoImage} alt="logo" />
          </div>
        </div>
        <div className="auth-body">
          <div className="auth-content" id="auth_content">
            <div
              className={`row`}
            >
              { (
                <div className="col-md-6">
                  <div className="auth-left-wrap">
                    <h2 className="auth-title">
                      Customer Relationship Management
                    </h2>
                    <p className="auth-descp">
                      360 Degree customer view for customer management from lead
                      to retention
                    </p>
                    <img
                      className="img-fluid auth-illustration-img"
                      src={AuthIllustrationImage}
                      alt="Auth Illustraton"
                    />
                  </div>
                </div>
              )}
              <div className="col-md-6">
                <div
                  className={`auth-right-wrap `}
                >
                  <div className={`auth-right-content`}>
                    <Outlet />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="auth-footer">
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
          </div>
          <p className="auth-footer-txt">© 2024,CRM. All Rights Reserved.</p>
        </div>
        <ContactUsDialog visible={visible} setVisible={setVisible} />
      </div>
    </>
  );
};

export default AuthLayout;
