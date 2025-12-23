import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from "react-query";
import { toast } from "react-toastify";
import AccidentalAttachmentForm from './AccidentalAttachmentForm';
import AccidentalAttachmentExpired from './AccidentalAttachmentExpired';
import AccidentalAttachmentAlreadyUpdated from './AccidentalAttachmentAlreadyUpdated';
import { checkAccidentalDocumentUrl, uploadAccidentalDocument } from '../../../services/caseService';

const AccidentalAttachmentContent = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  document.title = `Accidental Attachment | RSA CRM`;
  // Access individual query parameters
  const paramValues = {
    token: queryParams.get('token'),
    id: queryParams.get('id'),
    caseDetailId: queryParams.get('entityId')
  };

  const { data: urlExpiryResponse, refetch:urlExpiryRefetch, isLoading: urlExpiryResponseLoading} = useQuery(['checkAccidentalDocumentUrl'], () => checkAccidentalDocumentUrl({
    id: paramValues?.id
  }), {
    enabled: paramValues?.id ? true : false,
    onSuccess: (response) => {
      console.log('URL Expiry Response => ', response?.data);
    }
  });

  const {data: uploadAccidentalDocumentData, mutate: uploadAccidentalDocumentMutate, isLoading: uploadAccidentalDocumentLoading} = useMutation(uploadAccidentalDocument);

  const onSubmit = (values) => {
    console.log('Accidental Documents => ', values);
    urlExpiryRefetch();
    if(urlExpiryResponse?.data?.linkExpired == false) {
      // navigate(`/customers/accidental-attachments-success`);
      let formData = new FormData();
      formData.append("attachmentTypeId", 82);
      formData.append("attachmentOfId", 101);
      formData.append("entityId", paramValues?.caseDetailId);
      formData.append("linkId", paramValues?.id);
      formData.append("linkToken", paramValues?.token);
      values?.attachments?.filter((file)=>file?.id == undefined)?.map((file) => {
        formData.append("files", file)
      });
      uploadAccidentalDocumentMutate(formData, {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast?.success(res?.data?.message);
            navigate(`/customers/accidental-attachments-success`);
          } else {
            if (res?.data?.error) {
              toast.error(res?.data?.error);
            } else {
              res?.data?.errors?.forEach((el) => toast.error(el));
            }
          }
        }
      })
    }
  }

  return (
    <>
      {urlExpiryResponse?.data &&
        <>
          {urlExpiryResponse?.data?.status == false ? (
            <>
              {urlExpiryResponse?.data?.linkExpired == false ? (
                <AccidentalAttachmentForm 
                  id={paramValues?.id}  
                  token={paramValues?.token} 
                  caseDetailId={paramValues?.caseDetailId} 
                  formSubmit={onSubmit}
                  submitBtnLoading={uploadAccidentalDocumentLoading}
                />
              ) : (
                <AccidentalAttachmentExpired />
              )}
            </>
          ) : (
            <AccidentalAttachmentAlreadyUpdated />
          )}
        </>
      }
    </>
  )
}

export default AccidentalAttachmentContent