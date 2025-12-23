import React from 'react';
import { PageNotFoundImage } from "../../utills/imgConstants";
import "./bad-requests.less";

const Page404 = () => {
  return (
    <div className="err-page-wrap">
      <div className="err-cover">
        <div className="err-img-wrap">
          <img className='err-img' src={PageNotFoundImage} alt="404" />
        </div>
        <div className="err-content-wrap">
          <h1 className="err-title">404 Page Not Found</h1>
          <p className="err-subtitle">
            The page you are trying to access does not exist or has been moved.
            Try going back to our homepage.
          </p>
          <a href='/' className="btn btn-primary">Home</a>
        </div>
        
      </div>
    </div>
  )
}

export default Page404