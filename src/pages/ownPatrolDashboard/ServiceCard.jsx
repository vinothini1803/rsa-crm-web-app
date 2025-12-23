import React from 'react';
import  "./style.less";
const ServiceCard = ({className,title,Count}) => {
  return (
   <div className={`service-card-container ${className}`}>
     <div className='service-card-content'>
        <div className='service-card-title'>
            <div>{title}</div>
        </div>
        <h4 className='service-card-count'>{Count}</h4>
     </div>
   </div>
  )
}

export default ServiceCard