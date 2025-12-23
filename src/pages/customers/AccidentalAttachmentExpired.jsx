import React from 'react';
import { LinkExpiredImage } from '../../utills/imgConstants';

const AccidentalAttachmentExpired = () => {
  return (
    <div className='d-flex flex-column align-items-center text-center gap-3'>
      <img className='img-fluid' src={LinkExpiredImage} alt='Expired' style={{maxWidth: '185px'}}  />
      <h6 className='customerLayout-section-title color-danger'>Link Expired</h6>
      <p>It seems that the link to upload the proof for the accidental document page has expired.</p>
    </div>
  )
}

export default AccidentalAttachmentExpired