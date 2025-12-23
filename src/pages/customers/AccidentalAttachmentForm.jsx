import React, {useState, useEffect} from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { DocumentIcon } from '../../utills/imgConstants';
import CustomFileUpload from '../../components/common/CustomFileUpload';

const AccidentalAttachmentForm = ({id, token, caseDetailId, formSubmit, submitBtnLoading}) => {
  
  // console.log('Query Params => ', id, token, caseDetailId);
  const { handleSubmit, control, getValues, formState: { errors }, setValue, reset } = useForm();

  const noteContent = (
    <div className='font-sm'>
      <span className='color-note-warning fnt-sbd'>Note : </span>Could you upload the proof of the accidental incident? It will help us update our records accurately.
    </div>
  )

  return (
    <div className='customerLayout-attachmentContent'>
      <div className='customerLayout-section-wrap'>
        <div>
          <img className='img-fluid' src={DocumentIcon} />
        </div>
        <h6 className='customerLayout-section-title'>Upload Accidental Documents</h6>
      </div>
      <Message severity='warn' content={noteContent} className='mb-3' />
      <form id='customerAccidentalAttachmentForm' onSubmit={handleSubmit(formSubmit)}>
        <div className="row row-gap-3_4 mb-2">
          <div className="col-md-12">
            <div className="form-group">
              <Controller
                name="attachments"
                control={control}
                rules={{ required: "Attachment is required." }}
                render={({ field, fieldState }) => {
                  return (
                    <>
                      <CustomFileUpload 
                        name={field.name}
                        field={field}
                        multiple={true} 
                        maxFileSize={5000000} 
                        accept='.pdf,.doc,.docx,image/*'
                      />
                      
                      {errors && 
                        <div className="p-error">{errors[field.name]?.message}</div>
                      }
                    </>
                    
                  );
                }}
              />
            </div>
          </div>
        </div>
      </form>
      <div className='customerLayout-custom-footer'>
        <Button className="btn btn-full-wid" rounded type="submit" loading={submitBtnLoading} form='customerAccidentalAttachmentForm'>
          Upload
        </Button>
      </div>
    </div>
  )
}

export default AccidentalAttachmentForm