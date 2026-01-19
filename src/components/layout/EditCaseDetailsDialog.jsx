// import React, { useEffect, useState } from "react";
// import { Dialog } from "primereact/dialog";
// import { Dropdown } from "primereact/dropdown";
// import { Button } from "primereact/button";
// import { useQuery } from "react-query";

// const EditCaseDetailsDialog = ({ visible, onHide, selectedCase, onSave }) => {
//   if (!visible || !selectedCase) return null;

//   const { caseSubject, activity } = selectedCase;

//   const [service, setService] = useState(null);
//   const [subService, setSubService] = useState(null);

//   // Prefill service
//   useEffect(() => {
//     if (caseSubject) {
//       setService({
//         id: caseSubject.serviceId,
//         name: caseSubject.service,
//       });
//     }
//   }, [caseSubject]);

//   // Fetch sub-services for this service
//   const { data: subServiceRes } = useQuery(
//     ["getSubServices_edit", service?.id],
//     () =>
//       getCaseSubjectSubServices({
//         apiType: "dropdown",
//         serviceId: service?.id,
//       }),
//     {
//       enabled: !!service?.id,
//     }
//   );

//   // Prefill subService ONLY after options load
//   useEffect(() => {
//     const options = subServiceRes?.data?.data || [];
//     if (options.length && activity?.subServiceId) {
//       const matched = options.find((opt) => opt.id === activity.subServiceId);
//       if (matched) setSubService(matched);
//     }
//   }, [subServiceRes, activity]);

//   return (
//     <Dialog
//       header="Edit Case Details"
//       visible={visible}
//       style={{ width: "30vw" }}
//       modal
//       onHide={onHide}
//     >
//       {/* SERVICE (READ ONLY) */}
//       <div className="form-group">
//         <label>Service</label>
//         <Dropdown
//           value={service}
//           options={[service]}
//           optionLabel="name"
//           className="w-100"
//           disabled
//         />
//       </div>

//       {/* SUB SERVICE */}
//       {subServiceRes?.data?.data?.length > 0 && (
//         <div className="form-group mt-3">
//           <label className="required">Sub Service</label>
//           <Dropdown
//             value={subService}
//             options={subServiceRes.data.data}
//             optionLabel="name"
//             placeholder="Select Sub Service"
//             className="w-100"
//             onChange={(e) => setSubService(e.value)}
//           />
//         </div>
//       )}

//       {/* ACTIONS */}
//       <div className="flex justify-content-end mt-4 gap-2">
//         <Button label="Cancel" className="p-button-text" onClick={onHide} />
//         <Button
//           label="Save"
//           disabled={!subService}
//           onClick={() =>
//             onSave({
//               caseId: caseSubject.caseDetailId,
//               activityId: activity.activityId,
//               serviceId: service.id,
//               subServiceId: subService.id,
//             })
//           }
//         />
//       </div>
//     </Dialog>
//   );
// };

// export default EditCaseDetailsDialog;
import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useQuery } from "react-query";
import { getCaseSubjectSubServices } from "../../../services/caseService";

const EditCaseDetailsDialog = ({ visible, onHide, selectedCase, onSave }) => {
  if (!visible || !selectedCase) return null;

  const { caseSubject, activity } = selectedCase;

  const [selectedCaseService, setSelectedCaseService] = useState(null);
  const [selectedSubService, setSelectedSubService] = useState(null);

  /* -----------------------------
     Prefill service
  ----------------------------- */
  useEffect(() => {
    if (caseSubject) {
      setSelectedCaseService({
        id: caseSubject.serviceId,
        name: caseSubject.service,
      });
    }
  }, [caseSubject]);

  /* -----------------------------
     Fetch sub services
  ----------------------------- */
  console.log(selectedCaseService?.id,"case service ");
  
  const { data: caseSubjectSubServicesData } = useQuery(
    ["getCaseSubjectSubServices", selectedCaseService],
    () =>
      getCaseSubjectSubServices({
        apiType: "dropdown",
        serviceId: selectedCaseService?.id,
      }),
    {
      enabled: !!selectedCaseService,
    }
  );

  /* -----------------------------
     Prefill sub service safely
  ----------------------------- */
  useEffect(() => {
    const options = caseSubjectSubServicesData?.data?.data || [];
    if (options.length && activity?.subServiceId) {
      const matched = options.find(
        (opt) => opt.id === activity.subServiceId
      );
      if (matched) setSelectedSubService(matched);
    }
  }, [caseSubjectSubServicesData, activity]);

  return (
    <Dialog
      header="Edit Case Details"
      visible={visible}
      style={{ width: "30vw" }}
      modal
      onHide={onHide}
    >
      {/* CASE SUBJECT (READ ONLY) */}
      <div className="form-group">
        <label>Case Subject</label>
        <InputText
          value={caseSubject?.caseSubject || ""}
          className="w-100"
          disabled
        />
      </div>
      {/* SUB SERVICE (EDITABLE) */}
      <div className="form-group mt-3">
        <label className="required">Sub Service</label>
        <Dropdown
          value={selectedSubService}
          options={caseSubjectSubServicesData?.data?.data || []}
          optionLabel="name"
          placeholder="Select Sub Service"
          className="w-100"
          onChange={(e) => setSelectedSubService(e.value)}
        />
      </div>

      {/* ACTIONS */}
      <div className="d-flex justify-content-end align-items-center gap-2 mt-4">
        <Button label="Cancel" className="p-button-text" onClick={onHide} />
        <Button
          label="Save"
          disabled={!selectedSubService}
          onClick={() =>
            onSave({
              caseId: caseSubject.caseDetailId,
              activityId: activity.activityId,
              serviceId: selectedCaseService.id,
              subServiceId: selectedSubService.id,
            })
          }
        />
      </div>
    </Dialog>
  );
};

export default EditCaseDetailsDialog;
