import React, { useState, useEffect } from "react";
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Button } from "primereact/button";
import { useLocation } from 'react-router-dom';
import { useQuery, useMutation } from "react-query";
import { Message } from 'primereact/message';
import { FileUpload } from "primereact/fileupload";
import { toast } from "react-toastify";
import { EmptyLocationImage, LogoImage, SuccessIcon, DangerIcon, ImageIcon, ImageFilledIcon, ClearIcon } from "../../utills/imgConstants";
import MapLocation from "./MapLocation";
import { checkLocationExpiry, saveLocationLog } from "../../../services/caseService";
import imageCompression from 'browser-image-compression';

const index = () => {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  document.title = `Capture Location | RSA CRM`;
  // Access individual query parameters
  const paramValues = {
    token: queryParams.get('token'),
    id: queryParams.get('id'),
  };
  // console.log('Query Params => ', paramValues);

  const [captureLatLong, setCaptureLatLong] = useState(null);
  const [locationStatus, setLocationStatus] = useState(false);
  const [shareLocationClicked, setShareLocationClicked] = useState(false);
  const [locatioError, setLocationError] = useState("");
  const [shareButton, setShareButton] = useState(true)
  const { handleSubmit, control, getValues, formState: { errors }, setValue, reset } = useForm();

  const headerTemplate = (options) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;
    //console.log("chooseButton", chooseButton);
    return <div className={className}>{chooseButton}</div>;
  };
  const uploadedPicture = useWatch({
    control,
    name: "attachments",
  });

  const itemTemplate = (file, props, field) => {
    //console.log("File =>", file);
    const fileTypeArray = file.type.split("/");
    const fileType = fileTypeArray[0];
    //console.log('Type => ', fileType);
    return (
      <div className="p-fileupload-img-item">
        <div className="p-fileupload-img-item-wrap">
          <img
            className="img-fluid p-fileupload-img-item-img"
            alt={file.name}
            role="presentation"
            src={fileType == "image" ? file.objectURL : ImageIcon}
          />
        </div>
        <Button
          type="button"
          className="btn-icon btn-clear bg-transparent"
          onClick={() => {

            // Update the files list to exclude the file being removed
            const updatedFiles = field.value.filter((f) => f !== file);
            // Call the onChange with the updated files list
            field.onChange(updatedFiles);
            // Call props.onRemove() after updating the files
            props.onRemove();
          }}
        >
          <img className="img-fluid" src={ClearIcon} alt="Remove" />
        </Button>
      </div>
    );
  };

  const noteContent = (
    <div className='font-sm'>
      <span className='color-note-warning fnt-sbd'>Note : </span>Could you upload the image of the breakdown vechicle? It will help us update our records accurately.
    </div>
  )

  const { data: locationExpiryResponse, refetch: locationExpiryRefetch, isLoading: locationExpiryResponseLoading } = useQuery(['checkLocationExpiry'], () => checkLocationExpiry({
    id: paramValues?.id
  }), {
    enabled: paramValues?.id ? true : false,
    // onSuccess: (response) => {
    //   //console.log('Location Expiry Response => ', response?.data);
    //   if (shareLocationClicked) {
    //     if (response?.data?.success) {
    //       if (response?.data?.linkExpired) {
    //         setLocationError("This Link Has Expired");
    //         setLocationStatus(true);
    //       } //else {
    //       //   saveLocationLogMutate({
    //       //     ...paramValues,
    //       //     latitude: captureLatLong?.lat.toString(),
    //       //     longitude: captureLatLong?.lng.toString()
    //       //   })
    //       // }
    //     } else {
    //       if (response?.data?.error) {
    //         setLocationError(response?.data?.error);
    //         setLocationStatus(true);
    //       } else {
    //         setLocationStatus(false);
    //         response?.data?.errors.forEach((err) => toast.error(err));
    //       }
    //     }
    //   }
    // }
  });

  const { data: saveLocationLogData, mutate: saveLocationLogMutate, isLoading: saveLocationLogLoading } = useMutation(saveLocationLog, {
    onSuccess: (response) => {
      //console.log('Save Location Log Response => ', response?.data);
      if (response?.data?.success) {
        setLocationError("Your current location has been shared successfully");
        setLocationStatus(true);
        setShareButton(false)
        toast.success(response?.data?.message);
      } else {
        if (response?.data?.error) {
          setLocationError(response?.data?.error);
          setLocationStatus(true);
          toast.error(res?.data?.error);
        } else {
          setLocationStatus(false);
          response?.data?.errors.forEach((err) => toast.error(err));
        }
      }
    }
  });

  const Notifymsg = ({ color, msg }) => (
    <div className={`notify-error ${color}`}>
      <img src={(locationExpiryResponse?.data?.linkExpired == false && saveLocationLogData?.data?.success) ? SuccessIcon : DangerIcon} alt="message icon" />
      <div>{msg}</div>
    </div>
  );

  const EmptyEle = () => (
    <>
      <div className="roadlocation-body-empty">
        <img src={EmptyLocationImage} alt="Empty Location" />
      </div>
      <p className="roadlocation-body-content">
        To capture your current location. We use your location to ensure
        accurate service delivery tailored to your location.
      </p>
    </>
  );

  const ExpiredEle = () => (
    <>
      <div className="roadlocation-body-empty">
        <img src={EmptyLocationImage} alt="Empty Location" />
      </div>
      <h5>Sorry, This Link Has Expired.</h5>
      <p className="roadlocation-body-content">
        If you need access to specific information, please reach out to the individual who shared the link for updated access.
      </p>
    </>
  );

  const handleFileSelect = async (e, field) => {
    const files = e.files;
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    const compressedFiles = [];
  
    // Filter files to ensure they don't exceed max file size
    const validFiles = files.filter(file => file.size <= maxSize);
  
    if (validFiles.length !== files.length) {
      toast.error('One or more files exceed the 5MB size limit.');
    }
  
    // Compress valid files
    for (const file of validFiles) {
      try {
        const options = {
          maxSizeMB: 1, // Set maximum file size for compression in MB
          maxWidthOrHeight: 800, // Resize the image to this max width/height
          useWebWorker: true, // Use web worker for faster compression
        };
  
        // Compress the file
        const compressedFile = await imageCompression(file, options);
        compressedFiles.push(compressedFile); // Add the compressed file to the array
      } catch (error) {
        console.error('Error during image compression', error);
      }
    }
  
    // Update the form field with the valid and compressed files
    field.onChange(compressedFiles);
  };  

  // Handle Share Loaction Button
  const handleShareLocation = (values) => {
    //console.log('Form Values => ', values);
    setShareLocationClicked(true);
    locationExpiryRefetch()?.then((response) => {
      if (response?.data?.data?.success) {
        if (!response?.data?.data?.linkExpired) {
          const FormValues = new FormData();
          FormValues.append("id", paramValues?.id)
          FormValues.append("token", paramValues?.token)
          FormValues.append("latitude", captureLatLong?.lat.toString())
          FormValues.append("longitude", captureLatLong?.lng.toString())
          if (values?.attachments && values.attachments.length > 0) {
            values?.attachments.forEach((attachment, index) => {
              FormValues.append("files", attachment);
            });
          }
          saveLocationLogMutate(FormValues)
        }
      }
    });
  };

  // Get User Location on Page Load
  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          //console.log("")
          setCaptureLatLong({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationError("");
          setLocationStatus(false);
        },
        (error) => {
          setLocationError(error.message);
          setLocationStatus(true);
        }
      );
    } else {
      setLocationError(`Geolocation is not supported by this browser.`);
      setLocationStatus(true);
    }
  };

  useEffect(() => {
    if (locationExpiryResponse?.data?.linkExpired == false) {
      handleGetLocation();
    }
  }, [locationExpiryResponse?.data?.linkExpired]);

  return (
    <div className="container">
      <div className="roadlocation-page">
        <div className="roadlocation-header">
          <img className="img-fluid" src={LogoImage} alt="logo" />
          <div>
            <h5 className="roadlocation-header-title">ROADCAREPRO</h5>
            <p className="roadlocation-header-subtitle">
              On the Road, Beyond Expectations
            </p>
          </div>
        </div>
        <div className="roadlocation-body">
          {locationExpiryResponse?.data?.success ? (
            <>
              {locationExpiryResponse?.data?.linkExpired ? (
                <ExpiredEle />
              ) : (
                <>
                  {captureLatLong ? (
                    <>
                      <MapLocation location={captureLatLong} />
                      {shareButton &&
                        <>
                          <div className='customerLayout-attachmentContent'>
                            <div className='customerLayout-section-wrap'>
                              <div>
                                <img className='img-fluid' src={ImageFilledIcon} />
                              </div>
                              <h6 className='customerLayout-section-title customerLayout-required'>Upload Vehicle Image</h6>
                            </div>
                            <Message severity='warn' content={noteContent} className='mb-3' />
                            <form id='customerAccidentalAttachmentForm' onSubmit={handleSubmit(handleShareLocation)}>
                              <div className="row row-gap-3_4 mb-2">
                                <div className="">
                                  <div className="form-group">
                                    <Controller
                                      name="attachments"
                                      control={control}
                                      rules={{
                                        required: "Attachment is required.",
                                      }}
                                      render={({ field, fieldState }) => {
                                        return (
                                          <>
                                            <FileUpload
                                              name={field.name}
                                              multiple={true}
                                              accept={'image/*'}
                                              maxFileSize={5000000}
                                              headerTemplate={headerTemplate}
                                              onSelect={(e) => handleFileSelect(e, field)} 
                                              chooseLabel="Upload"
                                              itemTemplate={(file, props) => itemTemplate(file, props, field)}
                                              className="custom-file-multiple file-upload"
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
                          </div>
                          <div className='customerLayout-custom-footer'>
                            <Button type="submit" disabled={uploadedPicture?.length < 1 || uploadedPicture == undefined} form='customerAccidentalAttachmentForm' loading={saveLocationLogLoading} className="btn btn-full-wid btn-share">
                              Share Location
                            </Button>
                          </div>
                        </>
                      }
                    </>
                  ) : (
                    <EmptyEle />
                  )}
                </>
              )}
            </>
          ) : (
            <EmptyEle />
          )}

          {locationStatus &&
            <Notifymsg
              color={(locationExpiryResponse?.data?.linkExpired == false && saveLocationLogData?.data?.success) ? "success" : "danger"}
              msg={locatioError}
            />
          }
        </div>
      </div>
    </div>
  );
};

export default index;
