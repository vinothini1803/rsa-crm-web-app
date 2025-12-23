import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { errorData } from "../../utills/errorPagesData";
import { useSelector } from "react-redux";
import { CurrentUser } from "../../../store/slices/userSlice";

const ErrorPage = () => {
  const [pageData, setPageData] = useState();
  const navigate = useNavigate();
  const { id } = useParams();

  const user = useSelector(CurrentUser);

  useEffect(() => {
    if (errorData.findIndex((item) => item.id == id) == -1) {
      navigate("/page/404");
      setPageData(errorData.find((data) => data.id == 404));
      document.title = `Page 404 | RSA CRM`;
    } else {
      setPageData(errorData.find((data) => data.id == id));
      document.title = `Page ${id} | RSA CRM`;
    }
  }, []);

  //console.log('Error Page Data =>', pageData);

  return (
    <div className="error-page">
      <div className="error-wrap">
        <div className="error-img">
          <img className="img-fluid" src={pageData?.img} alt={id} />
        </div>
        <h1 className="error-title">{pageData?.title}</h1>
        <p className="error-subtitle">{pageData?.description}</p>
        <Link
          className="btn btn-view ant-btn-primary"
          to={
            user?.userTypeId == "140" || user?.userTypeId == "141"
              ? "/delivery-request"
              : user == null
              ? "/login"
              : "/delivery-request"
          }
        >
          Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
