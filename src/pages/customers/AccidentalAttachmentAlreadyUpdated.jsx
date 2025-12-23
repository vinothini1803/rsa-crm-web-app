import React from 'react';
import { FileAldreadyUpdatedImage } from '../../utills/imgConstants';

const AccidentalAttachmentAlreadyUpdated = () => {
  return (
    <div className='d-flex flex-column align-items-center text-center gap-3'>
      <img className='img-fluid' src={FileAldreadyUpdatedImage} alt='Already Updated' style={{maxWidth: '105px'}}  />
      <h6 className='customerLayout-section-title color-successs'>File Already Updated</h6>
      <p>Your document has already been updated. We'll take care of the rest. Thank you!</p>
    </div>
  )
}

export default AccidentalAttachmentAlreadyUpdated