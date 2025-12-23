import axios from "axios";

export const client = (data) => {
  return axios({ method: "GET", url: "master/client", params: data });
};

export const vehicleType = (data) => {
  return axios({ method: "GET", url: "master/vehicleTypes", params: data });
};

export const vehicleMakes = (data) => {
  return axios({ method: "GET", url: "master/vehicleMakes", params: data });
};

export const vehicleModal = (data) => {
  return axios({
    method: "GET",
    url: `master/vehicleModel`,
    params: data,
  });
};
export const subject = (params) => {
  return axios({ method: "GET", url: `master/subject`, params: params });
};
export const subService = (data) => {
  return axios({ method: "GET", url: `master/subService`, params: data });
};
export const vehicleScheme = (data) => {
  const typeIdQuery = data ? `?typeId=${data}` : "";
  return axios({
    method: "GET",
    url: `master/config${typeIdQuery}`,
    data: data,
  });
};
export const state = (data) => {
  return axios({ method: "GET", url: "master/state", params: data });
};
export const city = (data) => {
  const stateIdQuery = data ? `?stateId=${data}` : "";
  return axios({
    method: "GET",
    url: `master/city${stateIdQuery}`,
    data: data,
  });
};
export const dealer = (data) => {
  return axios({ method: "POST", url: "master/dealer", data: data });
};

export const services = (data) => {
  return axios({ method: "GET", url: "master/service", params: data });
};

export const caseStatus = (data) => {
  return axios({ method: "GET", url: "master/caseStatus", params: data });
};

export const memberShipType = (data) => {
  return axios({
    method: "POST",
    url: "master/membershipTypes/getList",
    data: data,
  });
};

// service Provider api
export const serviceProvider = (data) => {
  return axios({
    method: "GET",
    url: `master/asp?stateId=${data?.stateId}&cityId=${data?.cityId}&limit=${data?.limit}&offset=${data?.offset}&caseDetailId=${data?.caseDetailId}`,
    data: data,
  });
};

// Reject reason
export const aspRejectionReason = (data) => {
  return axios({
    method: "GET",
    url: `master/aspActivityRejectReason`,
    params: data,
  });
};

// Payment Method list

export const paymentMethod = (data) => {
  return axios({
    method: "GET",
    url: `master/paymentMethod`,
    data: data,
  });
};
// Addtional Charge List
export const additionalCharges = (data) => {
  return axios({
    method: "POST",
    url: `master/additionalCharge`,
    data: data,
  });
};
//Discount Reason
export const discountReasons = (data) => {
  return axios({
    method: "GET",
    url: `master/get/nonMembership/discountReasons`,
    data: data,
  });
};

//my case filter
export const myCaseFilterData = (data) => {
  return axios({
    method: "POST",
    url: `master/caseList/filterData`,
    data: data,
  });
};

//map view filter data
export const getMapViewFilterData = (data) => {
  return axios({
    method: "POST",
    url: `master/mapView/filterData`,
    data: data,
  });
};

//sub service filter
export const subServiceFilterData = (data) => {
  return axios({
    method: "POST",
    url: `master/caseSubServiceList/filterData`,
    data: data,
  });
};

//Reimbursement filter
export const reimbursementFilterData = (data) => {
  return axios({
    method: "POST",
    url: `master/reimbursementList/filterData`,
    data: data,
  });
};

export const dealerData = (data) => {
  return axios({
    method: "POST",
    url: `master/getDealerData`,
    data: data,
  });
};

//ASP Mechanics
export const aspMechanics = (data) => {
  return axios({
    method: "POST",
    url: `master/aspMechanic`,
    data: data,
  });
};

export const configtypes = (data) => {
  return axios({
    method: "GET",
    url: `master/config`,
    params: data,
  });
};
export const nspFilter = (data) => {
  return axios({
    method: "GET",
    url: `master/nspFilter/getByTypeId`,
    params: data,
  });
};
//Case Cancel Reason
export const caseCancelReason = (data) => {
  return axios({
    method: "GET",
    url: `master/caseCancelReason`,
    params: data,
  });
};

//ASP Cancel Reason
export const aspCancelReason = (data) => {
  return axios({
    method: "GET",
    url: `master/aspActivityCancelReason`,
    params: data,
  });
};

//Delete subject
export const deleteSubject = (data) => {
  return axios({
    method: "POST",
    url: `master/subject/delete`,
    data: data,
  });
};

//Add Subject
export const addSubject = (data) => {
  return axios({
    method: "POST",
    url: `master/subject/save`,
    data: data,
  });
};

//update Subject Status
export const updateSubjectStatus = (data) => {
  return axios({
    method: "POST",
    url: `master/subject/updateStatus`,
    data: data,
  });
};

//Get subject Data

export const getsubjectFormData = (data) => {
  return axios({
    method: "GET",
    url: `master/subject/getFormData`,
    params: data,
  });
};

// Answer Type APIs
export const answerType = (params) => {
  return axios({ method: "GET", url: `master/answerType`, params: params });
};

export const addAnswerType = (data) => {
  return axios({
    method: "POST",
    url: `master/answerType/save`,
    data: data,
  });
};

export const updateAnswerTypeStatus = (data) => {
  return axios({
    method: "POST",
    url: `master/answerType/updateStatus`,
    data: data,
  });
};

export const getAnswerTypeFormData = (data) => {
  return axios({
    method: "GET",
    url: `master/answerType/getFormData`,
    params: data,
  });
};

export const deleteAnswerType = (data) => {
  return axios({
    method: "POST",
    url: `master/answerType/delete`,
    data: data,
  });
};

export const getQuestionnairesByCaseSubjectId = (data) => {
  return axios({
    method: "GET",
    url: `master/subject/getQuestionnairesByCaseSubjectId`,
    params: data,
  });
};

//Delete Dealer
export const deleteDealer = (data) => {
  return axios({
    method: "POST",
    url: `master/dealer/delete`,
    data: data,
  });
};

//Update Dealer Status
export const updateDelearStatus = (data) => {
  return axios({
    method: "POST",
    url: `master/dealer/updateStatus`,
    data: data,
  });
};

//Save Dealer
export const saveDealer = (data) => {
  return axios({
    method: "POST",
    url: `master/dealer/save`,
    data: data,
  });
};

//Get Dealer Form Data
export const getdealerFormData = (data) => {
  return axios({
    method: "GET",
    url: `master/dealer/getFormData`,
    params: data,
  });
};

export const dealerFilterData = () => {
  return axios({
    method: "GET",
    url: `master/dealer/getFilterData`,
  });
};

//Get City List

export const cities = (data) => {
  return axios({
    method: "GET",
    url: `master/city`,
    params: data,
  });
};

//Get Dealer Data
export const dealerViewData = (data) => {
  return axios({
    method: "GET",
    url: `master/dealer/getViewData`,
    params: data,
  });
};

//callcenter

export const callCenterList = (params) => {
  return axios({
    method: "GET",
    url: `master/callCenter`,
    params: params,
  });
};

//city get Form Data

export const cityData = (data) => {
  return axios({
    method: "GET",
    url: `master/city/getFormData`,
    params: data,
  });
};

//save city

export const saveCity = (data) => {
  return axios({
    method: "POST",
    url: "master/city/save",
    data: data,
  });
};

export const updateCityStatus = (data) => {
  return axios({
    method: "POST",
    url: "master/city/updateStatus",
    data: data,
  });
};

//delete city
export const deleteCity = (data) => {
  return axios({
    method: "POST",
    url: "master/city/delete",
    data: data,
  });
};
//state save

export const saveState = (data) => {
  return axios({
    method: "POST",
    url: "master/state/save",
    data: data,
  });
};
//state Data
export const stateData = (data) => {
  return axios({
    method: "GET",
    url: `master/state/getFormData`,
    params: data,
  });
};
//delete state
export const deleteState = (data) => {
  return axios({
    method: "POST",
    url: `master/state/delete`,
    data: data,
  });
};
//update state status
export const updateStateStatus = (data) => {
  return axios({
    method: "POST",
    url: "master/state/updateStatus",
    data: data,
  });
};

//Region

export const regions = (data) => {
  return axios({
    method: "GET",
    url: "master/region",
    params: data,
  });
};

//save region
export const saveRegion = (data) => {
  return axios({
    method: "POST",
    url: "master/region/save",
    data: data,
  });
};

//update region status
export const updateRegionStatus = (data) => {
  return axios({
    method: "POST",
    url: "master/region/updateStatus",
    data: data,
  });
};
//delete region
export const deleteRegion = (data) => {
  return axios({
    method: "POST",
    url: "master/region/delete",
    data: data,
  });
};

export const regionData = (data) => {
  return axios({
    method: "GET",
    url: "master/region/getFormData",
    params: data,
  });
};

//Language
export const languages = (data) => {
  return axios({
    method: "GET",
    url: "master/languages",
    params: data,
  });
};

//Language getForm Data
export const languageFormData = (data) => {
  return axios({
    method: "GET",
    url: "master/language/getFormData",
    params: data,
  });
};

//Save Language
export const saveLanguage = (data) => {
  return axios({
    method: "POST",
    url: "master/language/save",
    data: data,
  });
};

//Update Language Status
export const updateLanguageStatus = (data) => {
  return axios({
    method: "POST",
    url: "master/language/updateStatus",
    data: data,
  });
};

export const deleteLanguage = (data) => {
  return axios({
    method: "POST",
    url: "master/language/delete",
    data: data,
  });
};

//Entitlement
export const entitlements = (data) => {
  return axios({
    method: "GET",
    url: "master/entitlements",
    params: data,
  });
};

//Entitlement getForm Data
export const entitlementFormData = (data) => {
  return axios({
    method: "GET",
    url: "master/entitlement/getFormData",
    params: data,
  });
};

//Save Entitlement
export const saveEntitlement = (data) => {
  return axios({
    method: "POST",
    url: "master/entitlement/save",
    data: data,
  });
};

//Update Entitlement Status
export const updateEntitlementStatus = (data) => {
  return axios({
    method: "POST",
    url: "master/entitlement/updateStatus",
    data: data,
  });
};
//Delete Entitlement
export const deleteEntitlement = (data) => {
  return axios({
    method: "POST",
    url: "master/entitlement/delete",
    data: data,
  });
};

//Asp Rejected Cc Detail Reason
export const aspRejectedCcDetailReason = (data) => {
  return axios({
    method: "GET",
    url: "master/aspRejectedCcDetailReasons",
    params: data,
  });
};

//Asp Rejected Cc Detail Reason getForm Data
export const aspRejectedCcDetailReasonFormData = (data) => {
  return axios({
    method: "GET",
    url: "master/aspRejectedCcDetailReasons/getFormData",
    params: data,
  });
};

//Save Asp Rejected Cc Detail Reason
export const saveAspRejectedCcDetailReason = (data) => {
  return axios({
    method: "POST",
    url: "master/aspRejectedCcDetailReason/save",
    data: data,
  });
};

//Update Asp Rejected Cc Detail Reason Status
export const updateAspRejectedCcDetailReasonStatus = (data) => {
  return axios({
    method: "POST",
    url: "master/aspRejectedCcDetailReason/updateStatus",
    data: data,
  });
};
//Delete Asp Rejected Cc Detail Reason
export const deleteAspRejectedCcDetailReason = (data) => {
  return axios({
    method: "POST",
    url: "master/aspRejectedCcDetailReason/delete",
    data: data,
  });
};
//Condition Of Vehicle
export const conditionOfVehicle = (data) => {
  return axios({
    method: "GET",
    url: "master/conditionOfVehicle",
    params: data,
  });
};

//ACondition Of Vehicle getForm Data
export const conditionOfVehicleFormData = (data) => {
  return axios({
    method: "GET",
    url: "master/conditionOfVehicle/getFormData",
    params: data,
  });
};

//Save Condition Of Vehicle
export const saveConditionOfVehicle = (data) => {
  return axios({
    method: "POST",
    url: "master/conditionOfVehicle",
    data: data,
  });
};

//Update Condition Of Vehicle
export const updateConditionOfVehicleStatus = (data) => {
  return axios({
    method: "PUT",
    url: "master/conditionOfVehicle/updateStatus",
    data: data,
  });
};
//Delete Condition Of Vehicle
export const deleteConditionOfVehicle = (data) => {
  return axios({
    method: "PUT",
    url: "master/conditionOfVehicle/delete",
    data: data,
  });
};
//Callcenters
export const callCenters = (data) => {
  return axios({
    method: "GET",
    url: "master/callCenter",
    params: data,
  });
};

//Save CallCenter
export const saveCallCenter = (data) => {
  return axios({
    method: "POST",
    url: "master/callCenter/save",
    data: data,
  });
};

//Update CallCenter Status
export const updateCallCenter = (data) => {
  return axios({
    method: "POST",
    url: "master/callCenter/updateStatus",
    data: data,
  });
};
//Delete CallCenter
export const deleteCallCenter = (data) => {
  return axios({
    method: "POST",
    url: "master/callCenter/delete",
    data: data,
  });
};
//CallCenter Form Data
export const callCenterFormData = (data) => {
  return axios({
    method: "GET",
    url: "master/callCenter/getFormData",
    params: data,
  });
};

//Save Rejection Reason
export const saveRejectionReason = (data) => {
  return axios({
    method: "POST",
    url: "master/aspActivityRejectReason/save",
    data: data,
  });
};

//Save Rejection Reason
export const rejectionReasonFormData = (data) => {
  return axios({
    method: "GET",
    url: "master/aspActivityRejectReason/getFormData",
    params: data,
  });
};

//Delete Rejection Reason
export const deleteRejectionReason = (data) => {
  return axios({
    method: "POST",
    url: "master/aspActivityRejectReason/delete",
    data: data,
  });
};

//Update Rejection Reason Status
export const updateRejectionReasonStatus = (data) => {
  return axios({
    method: "POST",
    url: "master/aspActivityRejectReason/updateStatus",
    data: data,
  });
};

//save case status
export const saveCaseStatus = (data) => {
  return axios({
    method: "POST",
    url: "master/caseStatus/save",
    data: data,
  });
};

//Delete case Status
export const deleteCaseStatus = (data) => {
  return axios({
    method: "POST",
    url: "master/caseStatus/delete",
    data: data,
  });
};

//Update case status
export const updateCaseStatus = (data) => {
  return axios({
    method: "POST",
    url: "master/caseStatus/updateStatus",
    data: data,
  });
};

//Case Status Form Data
export const caseStatusFormData = (data) => {
  return axios({
    method: "GET",
    url: "master/caseStatus/getFormData",
    params: data,
  });
};

//Save Vehicle Model

export const saveVehicleModel = (data) => {
  return axios({
    method: "POST",
    url: "master/vehicleModel/save",
    data: data,
  });
};

//Delete Vehicle Model
export const deleteVehicleModel = (data) => {
  return axios({
    method: "POST",
    url: "master/vehicleModel/delete",
    data: data,
  });
};

//Update Vehicle Model Status
export const updateVehicleModelStatus = (data) => {
  return axios({
    method: "POST",
    url: "master/vehicleModel/updateStatus",
    data: data,
  });
};

//Vechicle Model Form Data
export const vehicleModelFormData = (data) => {
  return axios({
    method: "GET",
    url: "master/vehicleModel/getFormData",
    params: data,
  });
};

//Save Vechicle Make
export const saveVechicleMake = (data) => {
  return axios({
    method: "POST",
    url: "master/vehicleMake/save",
    data: data,
  });
};

//Vechicle Make Form Data
export const vehicleMakeFormData = (data) => {
  return axios({
    method: "GET",
    url: "master/vehicleMake/getFormData",
    params: data,
  });
};

//Delete Vehicle Make
export const deleteVechicleMake = (data) => {
  return axios({
    method: "POST",
    url: "master/vehicleMake/delete",
    data: data,
  });
};

//Update vehicle Make status
export const updateVechicleMakeStatus = (data) => {
  return axios({
    method: "POST",
    url: "master/vehicleMake/updateStatus",
    data: data,
  });
};
//Service Organisation List
export const serviceOrganisations = (data) => {
  return axios({
    method: "GET",
    url: "master/serviceOrganisation",
    params: data,
  });
};
//Save Service Organisation
export const saveServiceOrganisations = (data) => {
  return axios({
    method: "POST",
    url: "master/serviceOrganisation/save",
    data: data,
  });
};
//Update Service Organisation Status
export const updateServiceOrganisationStatus = (data) => {
  return axios({
    method: "POST",
    url: "master/serviceOrganisation/updateStatus",
    data: data,
  });
};
// Delete Service Organisation
export const deleteServiceOrganisation = (data) => {
  return axios({
    method: "POST",
    url: "master/serviceOrganisation/delete",
    data: data,
  });
};
//Service Organisation Form Data
export const serviceOrganisationFormData = (data) => {
  return axios({
    method: "GET",
    url: "master/serviceOrganisation/getFormData",
    params: data,
  });
};
//Service Organisation Import
export const serviceOrganisationImport = (data) => {
  return axios({
    method: "POST",
    url: "master/serviceOrganisationImport",
    data: data,
  });
};
//Service Organisation Export
export const serviceOrganisationExport = (data) => {
  return axios({
    method: "POST",
    url: "master/serviceOrganisationExport",
    data: data,
  });
};

//Save Service
export const saveService = (data) => {
  return axios({
    method: "POST",
    url: "master/service/save",
    data: data,
  });
};

//Delete Service
export const deleteService = (data) => {
  return axios({
    method: "POST",
    url: "master/service/delete",
    data: data,
  });
};

//Update Service status
export const updateServiceStatus = (data) => {
  return axios({
    method: "POST",
    url: "master/service/updateStatus",
    data: data,
  });
};

//Service Form Data
export const serviceFormData = (data) => {
  return axios({
    method: "GET",
    url: "master/service/getFormData",
    params: data,
  });
};

//Save Service
export const saveSubService = (data) => {
  return axios({
    method: "POST",
    url: "master/subService/save",
    data: data,
  });
};

//Delete Service
export const deleteSubService = (data) => {
  return axios({
    method: "POST",
    url: "master/subService/delete",
    data: data,
  });
};

//Update Service status
export const updateSubServiceStatus = (data) => {
  return axios({
    method: "POST",
    url: "master/subService/updateStatus",
    data: data,
  });
};

//Service Form Data
export const subServiceFormData = (data) => {
  return axios({
    method: "GET",
    url: "master/subService/getFormData",
    params: data,
  });
};

//Save Vehicle Type
export const saveVehicleType = (data) => {
  return axios({
    method: "POST",
    url: "master/vehicleTypes/save",
    data: data,
  });
};

//Delete Vehicle Type
export const deleteVehicleType = (data) => {
  return axios({
    method: "POST",
    url: "master/vehicleTypes/delete",
    data: data,
  });
};

//Update  Vehicle Type status
export const updateVehicleTypeStatus = (data) => {
  return axios({
    method: "POST",
    url: "master/vehicleTypes/updateStatus",
    data: data,
  });
};

//Vehicle Type Form Data
export const vehicleTypeFormData = (data) => {
  return axios({
    method: "GET",
    url: "master/vehicleTypes/getFormData",
    params: data,
  });
};

//Client Status Update
export const clientStatusUpdate = (data) => {
  return axios({
    method: "POST",
    url: "master/client/updateStatus",
    data: data,
  });
};
//Delete Client
export const deleteClient = (data) => {
  return axios({
    method: "POST",
    url: "master/client/delete",
    data: data,
  });
};
//Client Form Data
export const clientFormData = (data) => {
  return axios({
    method: "GET",
    url: "master/client/getFormData",
    params: data,
  });
};
//Save Client
export const saveClient = (data) => {
  return axios({
    method: "POST",
    url: "master/client/save",
    data: data,
  });
};
//Sub service
export const subServiceClient = (data) => {
  return axios({
    method: "GET",
    url: "master/subService",
    params: data,
  });
};
//Sub service based entitlement
export const entitlementDropdown = (data) => {
  return axios({
    method: "POST",
    url: "master/get/subService/entitlements",
    data: data,
  });
};
//View Client
export const viewClient = (data) => {
  return axios({
    method: "GET",
    url: "master/client/getViewData",
    params: data,
  });
};

//getUser Clients
export const userClients = (data) => {
  return axios({
    method: "POST",
    url: "master/client/getUserClients",
    data: data,
  });
};

//roleBasedColumnList
export const roleBasedColumnList = (data) => {
  return axios({
    method: "POST",
    url: "case/roleBasedColumnList",
    data: data,
  });
};
//Dealer Import
export const importDealer = (data) => {
  return axios({
    method: "POST",
    url: "master/dealerImportMaster",
    data: data,
  });
};

//roleBasedColumn
export const roleBasedColumn = (data) => {
  return axios({
    method: "POST",
    url: "case/roleBasedColumn",
    data: data,
  });
};
//Dealer Export
export const exportDealer = (data) => {
  return axios({
    method: "POST",
    url: "master/dealerExportMaster",
    data: data,
  });
};

//deleteRoleBasedColumnList
export const delRoleBasedColumn = (data) => {
  return axios({
    method: "POST",
    url: "case/delRoleBasedColumn",
    data: data,
  });
};
//Vechicle model import

export const vehicleModelImport = (data) => {
  return axios({
    method: "POST",
    url: "master/vehicleModelImportMaster",

    data: data,
  });
};

export const vehicleModelExport = (data) => {
  return axios({
    method: "POST",
    url: "master/vehicleModelExportMaster",
    data: data,
  });
};

export const vehicleMakeImport = (data) => {
  return axios({
    method: "POST",
    url: "master/vehicleMakeImportMaster",
    data: data,
  });
};

export const vehicleMakeExport = (data) => {
  return axios({
    method: "POST",
    url: "master/vehicleMakeExportMaster",
    data: data,
  });
};

export const aspRejReasonImport = (data) => {
  return axios({
    method: "POST",
    url: "master/aspRejReasonImport",
    data: data,
  });
};

export const aspRejReasonExport = (data) => {
  return axios({
    method: "POST",
    url: "master/aspRejReasonExport",
    data: data,
  });
};

//Service Import and Export

export const serviceImportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/serviceImportMaster",
    data: data,
  });
};

export const serviceExportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/serviceExportMaster",
    data: data,
  });
};

//Case Subject Import and Export

export const subjectImportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/subjectImportMaster",
    data: data,
  });
};

export const subjectExportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/subjectExportMaster",
    data: data,
  });
};

//Case Subject Questionnaire Import and Export

export const caseSubjectQuestionnaireImport = (data) => {
  return axios({
    method: "POST",
    url: "master/caseSubjectQuestionnaire/import",
    data: data,
  });
};

export const caseSubjectQuestionnaireExport = (data) => {
  return axios({
    method: "POST",
    url: "master/caseSubjectQuestionnaire/export",
    data: data,
  });
};

//Sub Services Import and Export

export const subServiceImportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/subServiceImportMaster",
    data: data,
  });
};

export const subServiceExportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/subServiceExportMaster",
    data: data,
  });
};

//Case Status Import and Export

export const caseStatusImportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/caseStatusImportMaster",
    data: data,
  });
};

export const caseStatusExportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/caseStatusExportMaster",
    data: data,
  });
};

//Call Centre Import and Export

export const callCenterImportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/callCenterImportMaster",
    data: data,
  });
};

export const callCenterExportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/callCenterExportMaster",
    data: data,
  });
};

//Languages Import and Export

export const languageImportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/languageImportMaster",
    data: data,
  });
};

export const languageExportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/languageExportMaster",
    data: data,
  });
};

//State Import and Export

export const stateImportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/stateImportMaster",
    data: data,
  });
};

export const stateExportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/stateExportMaster",
    data: data,
  });
};

//City Import and Export

export const cityImportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/cityImportMaster",
    data: data,
  });
};

export const cityExportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/cityExportMaster",
    data: data,
  });
};

//Region Import and Export

export const regionImportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/regionImportMaster",
    data: data,
  });
};

export const regionExportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/regionExportMaster",
    data: data,
  });
};
//Taluk Import and Export

export const talukImportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/taluk/import",
    data: data,
  });
};

export const talukExportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/taluk/export",
    data: data,
  });
};
//District Import and Export
export const districtImportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/district/import",
    data: data,
  });
};

export const districtExportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/district/export",
    data: data,
  });
};
//NearestCity Import and Export
export const nearestCityImportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/nearestCity/import",
    data: data,
  });
};

export const nearestCityExportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/nearestCity/export",
    data: data,
  });
};

//Escalation Reason Import and Export
export const escalationImportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/escalationReason/import",
    data: data,
  });
};

export const escalationExportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/escalationReason/export",
    data: data,
  });
};
//System Issue Reason Import and Export
export const systemIssueImportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/systemIssueReason/import",
    data: data,
  });
};

export const systemIssueExportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/systemIssueReason/export",
    data: data,
  });
};
//Entitlement Import and Export
export const entitlementImportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/entitlement/import",
    data: data,
  });
};

export const entitlementExportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/entitlement/export",
    data: data,
  });
};

//Asp Rejected CcDetail Reason Import and Export
export const aspRejectedCcDetailReasonImportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/aspRejectedCcDetailReason/import",
    data: data,
  });
};

export const aspRejectedCcDetailReasonExportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/aspRejectedCcDetailReason/export",
    data: data,
  });
};
//Condition of Vehicle Import and Export
export const conditionOfVehicleImportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/conditionOfVehicle/import",
    data: data,
  });
};

export const conditionOfVehicleExportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/conditionOfVehicle/export",
    data: data,
  });
};
//Vehicle Type Import and Export

export const vehicleTypeImportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/vehicleTypeImportMaster",
    data: data,
  });
};

export const vehicleTypeExportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/vehicleTypeExportMaster",
    data: data,
  });
};

//clients Import and Export

export const clientImport = (data) => {
  return axios({
    method: "POST",
    url: "master/clientImport",
    data: data,
  });
};

export const clientExport = (data) => {
  return axios({
    method: "POST",
    url: "master/clientExport",
    data: data,
  });
};
//Service Entitlement Import and Export

export const serviceImport = (data) => {
  return axios({
    method: "POST",
    url: "master/clientServiceEntitlement/import",
    data: data,
  });
};

export const serviceExport = (data) => {
  return axios({
    method: "POST",
    url: "master/clientServiceEntitlement/export",
    data: data,
  });
};

//SLA Violate Reason Import and Export
export const slaViolateReasonImport = (data) => {
  return axios({
    method: "POST",
    url: "master/slaViolateReason/import",
    data: data,
  });
};

export const slaViolateReasonExport = (data) => {
  return axios({
    method: "POST",
    url: "master/slaViolateReason/export",
    data: data,
  });
};

//SLA Setting Import and Export
export const slaImport = (data) => {
  return axios({
    method: "POST",
    url: "master/sla/import",
    data: data,
  });
};

export const slaExport = (data) => {
  return axios({
    method: "POST",
    url: "master/sla/export",
    data: data,
  });
};

// SLA Process List
export const slaProcessList = (data) => {
  return axios({
    method: "GET",
    url: `master/sla/getList`,
    params: data,
  });
};

//SAVE Sla Process

export const saveSlaProcess = (data) => {
  return axios({
    method: "POST",
    url: "master/sla/save",
    data: data,
  });
};

//GET BY ID Sla Process

export const getSlaProcessFormData = (data) => {
  return axios({
    method: "GET",
    url: "master/sla/getFormData",
    params: data,
  });
};

//Update Sla Process

export const updateSlaProcessStatus = (data) => {
  return axios({
    method: "POST",
    url: "master/sla/updateStatus",
    data: data,
  });
};
//State Id by Google Map Code
export const getStateId = (data) => {
  return axios({
    method: "POST",
    url: "master/state/getByGoogleMapCode",
    data: data,
  });
};

//Roles Dropdown
export const rolesDropdown = (data) => {
  return axios({
    method: "GET",
    url: "user/listRoles",
    params: data,
  });
};

export const allrolesDropdown = (data) => {
  return axios({
    method: "GET",
    url: "user/getAllRoles",
    params: data,
  });
};
//SLA Volation Reasons List
export const slaViolateReasons = (data) => {
  return axios({
    method: "GET",
    url: "master/slaViolateReason/getList",
    params: data,
  });
};

//Proposed Delay Reasons List
export const proposedDelayReasons = (data) => {
  return axios({
    method: "GET",
    url: "master/proposedDelayReason/getList",
    params: data,
  });
};

//SLA GET all Reasons
export const slaViolateAllReasons = (data) => {
  return axios({
    method: "GET",
    url: "user/getAllRoles",
    params: data,
  });
};

//SLA Violation Reason Save
export const saveSlaViolationReason = (data) => {
  return axios({
    method: "POST",
    url: "master/slaViolateReason/save",
    data: data,
  });
};

//SLA Violation Reason Status Update
export const updateSlaViolationReasonStatus = (data) => {
  return axios({
    method: "PUT",
    url: "master/slaViolateReason/updateStatus",
    data: data,
  });
};

//SLA Violation Reason FormData
export const slaViolationReasonFormData = (data) => {
  return axios({
    method: "GET",
    url: "master/slaViolateReason/getFormData",
    params: data,
  });
};

//SLA Delete SLA Violation Reason
export const deleteSlaViolateReason = (data) => {
  return axios({
    method: "PUT",
    url: "master/slaViolateReason/delete",
    data: data,
  });
};

//ROS Failure Reasons List
export const rosFailureReasons = (data) => {
  return axios({
    method: "GET",
    url: "master/rosFailureReason/getList",
    params: data,
  });
};

//ROS GET all Reasons
export const rosFailureAllReasons = (data) => {
  return axios({
    method: "GET",
    url: "user/getAllRoles",
    params: data,
  });
};

//ROS Failure Reason Save
export const saveRosFailureReason = (data) => {
  return axios({
    method: "POST",
    url: "master/rosFailureReason/save",
    data: data,
  });
};

//ROS Failure Reason Status Update
export const updateRosFailureReasonStatus = (data) => {
  return axios({
    method: "PUT",
    url: "master/rosFailureReason/updateStatus",
    data: data,
  });
};

//ROS Failure Reason FormData
export const rosFailureReasonFormData = (data) => {
  return axios({
    method: "GET",
    url: "master/rosFailureReason/getFormData",
    params: data,
  });
};

//ROS Delete ROS Failure Reason
export const deleteRosFailureReason = (data) => {
  return axios({
    method: "PUT",
    url: "master/rosFailureReason/delete",
    data: data,
  });
};

export const rosFailureReasonImport = (data) => {
  return axios({
    method: "POST",
    url: "master/rosFailureReason/import",
    data: data,
  });
};

export const rosFailureReasonExport = (data) => {
  return axios({
    method: "POST",
    url: "master/rosFailureReason/export",
    data: data,
  });
};

//ROS Success Reasons List
export const rosSuccessReasons = (data) => {
  return axios({
    method: "GET",
    url: "master/rosSuccessReason/getList",
    params: data,
  });
};

//ROS Success Reason Save
export const saveRosSuccessReason = (data) => {
  return axios({
    method: "POST",
    url: "master/rosSuccessReason/save",
    data: data,
  });
};

//ROS Success Reason Status Update
export const updateRosSuccessReasonStatus = (data) => {
  return axios({
    method: "PUT",
    url: "master/rosSuccessReason/updateStatus",
    data: data,
  });
};

//ROS Success Reason FormData
export const rosSuccessReasonFormData = (data) => {
  return axios({
    method: "GET",
    url: "master/rosSuccessReason/getFormData",
    params: data,
  });
};

//ROS Delete ROS Success Reason
export const deleteRosSuccessReason = (data) => {
  return axios({
    method: "PUT",
    url: "master/rosSuccessReason/delete",
    data: data,
  });
};

export const rosSuccessReasonImport = (data) => {
  return axios({
    method: "POST",
    url: "master/rosSuccessReason/import",
    data: data,
  });
};

export const rosSuccessReasonExport = (data) => {
  return axios({
    method: "POST",
    url: "master/rosSuccessReason/export",
    data: data,
  });
};

//Tow Success Reasons List
export const towSuccessReasons = (data) => {
  return axios({
    method: "GET",
    url: "master/towSuccessReason/getList",
    params: data,
  });
};

//Tow Success Reason Save
export const saveTowSuccessReason = (data) => {
  return axios({
    method: "POST",
    url: "master/towSuccessReason/save",
    data: data,
  });
};

//Tow Success Reason Status Update
export const updateTowSuccessReasonStatus = (data) => {
  return axios({
    method: "PUT",
    url: "master/towSuccessReason/updateStatus",
    data: data,
  });
};

//Tow Success Reason FormData
export const towSuccessReasonFormData = (data) => {
  return axios({
    method: "GET",
    url: "master/towSuccessReason/getFormData",
    params: data,
  });
};

//Tow Delete Tow Success Reason
export const deleteTowSuccessReason = (data) => {
  return axios({
    method: "PUT",
    url: "master/towSuccessReason/delete",
    data: data,
  });
};

export const towSuccessReasonImport = (data) => {
  return axios({
    method: "POST",
    url: "master/towSuccessReason/import",
    data: data,
  });
};

export const towSuccessReasonExport = (data) => {
  return axios({
    method: "POST",
    url: "master/towSuccessReason/export",
    data: data,
  });
};

//Tow Failure Reasons List
export const towFailureReasons = (data) => {
  return axios({
    method: "GET",
    url: "master/towFailureReason/getList",
    params: data,
  });
};

//Tow Failure Reason Save
export const saveTowFailureReason = (data) => {
  return axios({
    method: "POST",
    url: "master/towFailureReason/save",
    data: data,
  });
};

//Tow Failure Reason Status Update
export const updateTowFailureReasonStatus = (data) => {
  return axios({
    method: "PUT",
    url: "master/towFailureReason/updateStatus",
    data: data,
  });
};

//Tow Failure Reason FormData
export const towFailureReasonFormData = (data) => {
  return axios({
    method: "GET",
    url: "master/towFailureReason/getFormData",
    params: data,
  });
};

//Tow Delete Tow Failure Reason
export const deleteTowFailureReason = (data) => {
  return axios({
    method: "PUT",
    url: "master/towFailureReason/delete",
    data: data,
  });
};

export const towFailureReasonImport = (data) => {
  return axios({
    method: "POST",
    url: "master/towFailureReason/import",
    data: data,
  });
};

export const towFailureReasonExport = (data) => {
  return axios({
    method: "POST",
    url: "master/towFailureReason/export",
    data: data,
  });
};

/* // Reject Reasons for ASP CC Detail
export const aspRejectedCcDetailReasons = (data) => {
  return axios({
    method: "GET",
    url: "master/aspRejectedCcDetailReasons",
    params: data,
  });
}; */

//get Delaer by gropup code
export const getDealersByGroupCode = (data) => {
  return axios({
    method: "POST",
    url: "master/getDealersByGroupCode",
    data: data,
  });
};
export const getConfigList = (data) => {
  return axios({
    method: "GET",
    url: `master/config`,
    params: data,
  });
};

export const getState = (data) => {
  return axios({
    method: "POST",
    url: "master/state/getByGoogleMapCode",
    data: data,
  });
};

//Get Escalation reasons
export const getEscalationReason = (data) => {
  return axios({
    method: "GET",
    url: "master/escalationReason",
    params: data,
  });
};

//Save Escaltion reasons
export const saveEscaltionReason = (data) => {
  return axios({
    method: "POST",
    url: "master/escalationReason/save",
    data: data,
  });
};

//Delete escaltion reason
export const deleteEscalationReason = (data) => {
  return axios({
    method: "POST",
    url: "master/escalationReason/delete",
    data: data,
  });
};

//Get form escaltion reason
export const escalationReasonData = (data) => {
  return axios({
    method: "GET",
    url: "master/escalationReason/getFormData",
    params: data,
  });
};

//Update escalation reason
export const updateEscalationReason = (data) => {
  return axios({
    method: "POST",
    url: "master/escalationReason/updateStatus",
    data: data,
  });
};

//Proposed Delay Reason Import and Export
export const proposedDelayReasonImportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/proposedDelayReason/import",
    data: data,
  });
};

export const proposedDelayReasonExportMaster = (data) => {
  return axios({
    method: "POST",
    url: "master/proposedDelayReason/export",
    data: data,
  });
};

//Get Proposed Delay reasons
export const getProposedDelayReason = (data) => {
  return axios({
    method: "GET",
    url: "master/proposedDelayReason/getList",
    params: data,
  });
};

//Save Proposed Delay reasons
export const saveProposedDelayReason = (data) => {
  return axios({
    method: "POST",
    url: "master/proposedDelayReason/save",
    data: data,
  });
};

//Delete Proposed Delay reason
export const deleteProposedDelayReason = (data) => {
  return axios({
    method: "PUT",
    url: "master/proposedDelayReason/delete",
    data: data,
  });
};

//Get form Proposed Delay reason
export const proposedDelayReasonData = (data) => {
  return axios({
    method: "GET",
    url: "master/proposedDelayReason/getFormData",
    params: data,
  });
};

//Update Proposed Delay reason
export const updateProposedDelayReason = (data) => {
  return axios({
    method: "PUT",
    url: "master/proposedDelayReason/updateStatus",
    data: data,
  });
};

//Get system issue reason
export const getSystemIssueReason = (data) => {
  return axios({
    method: "GET",
    url: "master/systemIssueReason",
    params: data,
  });
};

//Save system issue reasons
export const saveSystemIssueReason = (data) => {
  return axios({
    method: "POST",
    url: "master/systemIssueReason/save",
    data: data,
  });
};

//delete system issue reason
export const deleteSystemIssueReason = (data) => {
  return axios({
    method: "POST",
    url: "master/systemIssueReason/delete",
    data: data,
  });
};

//get from system issue reason
export const systemIssueReasonData = (data) => {
  return axios({
    method: "GET",
    url: "master/systemIssueReason/getFormData",
    params: data,
  });
};

//update system issue reason
export const updateSystemIssueReason = (data) => {
  return axios({
    method: "POST",
    url: "master/systemIssueReason/updateStatus",
    data: data,
  });
};
//Taluk save
export const saveTaluk = (data) => {
  return axios({
    method: "POST",
    url: "master/taluk/save",
    data: data,
  });
};

//Taluk List
export const talukList = (data) => {
  return axios({
    method: "GET",
    url: "master/taluk",
    params: data,
  });
};

//Taluk form Data
export const getTalukData = (data) => {
  return axios({
    method: "GET",
    url: "master/taluk/getFormData",
    params: data,
  });
};

//Taluk Status Update
export const talukStatusUpdate = (data) => {
  return axios({
    method: "POST",
    url: "master/taluk/updateStatus",
    data: data,
  });
};
//Taluk Delete
export const deleteTaluk = (data) => {
  return axios({
    method: "POST",
    url: "master/taluk/delete",
    data: data,
  });
};
//District save
export const saveDistrict = (data) => {
  return axios({
    method: "POST",
    url: "master/district/save",
    data: data,
  });
};
//District List
export const districtList = (data) => {
  return axios({
    method: "GET",
    url: "master/district",
    params: data,
  });
};

//District form Data
export const getDistrictData = (data) => {
  return axios({
    method: "GET",
    url: "master/district/getFormData",
    params: data,
  });
};
//District Status Update
export const districtStatusUpdate = (data) => {
  return axios({
    method: "POST",
    url: "master/district/updateStatus",
    data: data,
  });
};

//District Delete
export const deleteDistrict = (data) => {
  return axios({
    method: "POST",
    url: "master/district/delete",
    data: data,
  });
};
//Nearest City save
export const saveNearestCity = (data) => {
  return axios({
    method: "POST",
    url: "master/nearestCity/save",
    data: data,
  });
};
//Nearest City List
export const nearestCityList = (data) => {
  return axios({
    method: "GET",
    url: "master/nearestCity",
    params: data,
  });
};

//Nearest City form Data
export const getNearestCityData = (data) => {
  return axios({
    method: "GET",
    url: "master/nearestCity/getFormData",
    params: data,
  });
};

//District Status Update
export const nearestCityStatusUpdate = (data) => {
  return axios({
    method: "POST",
    url: "master/nearestCity/updateStatus",
    data: data,
  });
};

//District Delete
export const deleteNearestCity = (data) => {
  return axios({
    method: "POST",
    url: "master/nearestCity/delete",
    data: data,
  });
};

//get manual location reason
export const getManualLocationReason = (data) => {
  return axios({
    method: "GET",
    url: "master/manualLocationReason",
    params: data,
  });
};

//save manual location reason
export const saveManualLocationReason = (data) => {
  return axios({
    method: "POST",
    url: "master/manualLocationReason/save",
    data: data,
  });
};

//delect manual location reason
export const deleteManualLocationReason = (data) => {
  return axios({
    method: "POST",
    url: "master/manualLocationReason/delete",
    data: data,
  });
};

//get form manual location reason
export const manualLocationReasonData = (data) => {
  return axios({
    method: "GET",
    url: "master/manualLocationReason/getFormData",
    params: data,
  });
};

//update manual location reason
export const updateManualLocationReason = (data) => {
  return axios({
    method: "POST",
    url: "master/manualLocationReason/updateStatus",
    data: data,
  });
};

//export manual location reason
export const manualLocationReasonExport = (data) => {
  return axios({
    method: "POST",
    url: "master/manualLocationReasonExport",
    data: data,
  });
};

//import manual location reason
export const manualLocationReasonImport = (data) => {
  return axios({
    method: "POST",
    url: "master/manualLocationReasonImport",
    data: data,
  });
};

//get policy permium
export const getPolicyPremium = (data) => {
  return axios({
    method: "GET",
    url: "master/policyPremium",
    params: data,
  });
};

//save policy permium
export const savePolicyPremium = (data) => {
  return axios({
    method: "POST",
    url: "master/policyPremium",
    data: data,
  });
};

//delect policy permium
export const deletePolicyPremium = (data) => {
  return axios({
    method: "PUT",
    url: "master/policyPremium/delete",
    data: data,
  });
};

//get form policy permium
export const policyPremiumData = (data) => {
  return axios({
    method: "GET",
    url: "master/policyPremium/getFormData",
    params: data,
  });
};

//update policy permium
export const updatePolicyPremium = (data) => {
  return axios({
    method: "PUT",
    url: "master/policyPremium/updateStatus",
    data: data,
  });
};

//export policy permium
export const policyPremiumExport = (data) => {
  return axios({
    method: "POST",
    url: "master/policyPremium/export",
    data: data,
  });
};

//import policy premium
export const policyPremiumImport = (data) => {
  return axios({
    method: "POST",
    url: "master/policyPremium/import",
    data,
  });
};

//get case cancel reason
export const getCaseCancelReason = (data) => {
  return axios({
    method: "GET",
    url: "master/caseCancelReason",
    params: data,
  });
};

//save case cancel reason
export const saveCaseCancelReason = (data) => {
  return axios({
    method: "POST",
    url: "master/caseCancelReason/save",
    data: data,
  });
};

//delect case cancel reason
export const deleteCaseCancelReason = (data) => {
  return axios({
    method: "POST",
    url: "master/caseCancelReason/delete",
    data: data,
  });
};

//get form case cancel reason
export const caseCancelReasonData = (data) => {
  return axios({
    method: "GET",
    url: "master/caseCancelReason/getFormData",
    params: data,
  });
};

//update case cancel reason
export const updateCaseCancelReason = (data) => {
  return axios({
    method: "POST",
    url: "master/caseCancelReason/updateStatus",
    data: data,
  });
};

//export case cancel reason
export const caseCancelReasonExport = (data) => {
  return axios({
    method: "POST",
    url: "master/caseCancelReason/export",
    data: data,
  });
};

//import case cancel reason
export const caseCancelReasonImport = (data) => {
  return axios({
    method: "POST",
    url: "master/caseCancelReason/import",
    data: data,
  });
};

//get disposition
export const getDisposition = (data) => {
  return axios({
    method: "GET",
    url: "master/disposition",
    params: data,
  });
};

//save disposition
export const saveDisposition = (data) => {
  return axios({
    method: "POST",
    url: "master/disposition",
    data: data,
  });
};

//delect disposition
export const deleteDisposition = (data) => {
  return axios({
    method: "PUT",
    url: "master/disposition/delete",
    data: data,
  });
};

//get form disposition
export const dispositionData = (data) => {
  return axios({
    method: "GET",
    url: "master/disposition/getFormData",
    params: data,
  });
};

//update disposition
export const updateDisposition = (data) => {
  return axios({
    method: "PUT",
    url: "master/disposition/updateStatus",
    data: data,
  });
};

//export disposition
export const dispositionExport = (data) => {
  return axios({
    method: "POST",
    url: "master/disposition/export",
    data: data,
  });
};

//import disposition
export const dispositionImport = (data) => {
  return axios({
    method: "POST",
    url: "master/disposition/import",
    data: data,
  });
};

//get asp activity cancel reason
export const getAspACtivityCancel = (data) => {
  return axios({
    method: "GET",
    url: "master/aspActivityCancelReason",
    params: data,
  });
};

//save asp activity cancel reason
export const saveAspACtivityCancel = (data) => {
  return axios({
    method: "POST",
    url: "master/aspActivityCancelReason/save",
    data: data,
  });
};

//delect asp activity cancel reason
export const deleteAspACtivityCancel = (data) => {
  return axios({
    method: "POST",
    url: "master/aspActivityCancelReason/delete",
    data: data,
  });
};

//get asp activity cancel reason
export const aspACtivityCancelData = (data) => {
  return axios({
    method: "GET",
    url: "master/aspActivityCancelReason/getFormData",
    params: data,
  });
};

//update asp activity cancel reason
export const updateAspACtivityCancel = (data) => {
  return axios({
    method: "POST",
    url: "master/aspActivityCancelReason/updateStatus",
    data: data,
  });
};

//export asp activity cancel reason
export const aspACtivityCancelExport = (data) => {
  return axios({
    method: "POST",
    url: "master/aspActivityCancelReason/export",
    data: data,
  });
};

//import manual location reason
export const aspACtivityCancelImport = (data) => {
  return axios({
    method: "POST",
    url: "master/aspActivityCancelReason/import",
    data: data,
  });
};

//case creation membership details used to get fuel type,policies,vehicle details

export const memberShipCaseCreation = (data) => {
  return axios({
    method: "POST",
    url: "master/get/membership/details",
    data: data,
  });
};

//Get vehicle VIN using fetch
export const getVIN = (data) => {
  return axios({
    method: "POST",
    url: "/master/rsa/getVehicleDetails",
    data: data,
  });
};

export const getCityId = (data) => {
  return axios({
    method: "POST",
    url: "master/city/getByGoogleDetail",
    data: data,
  });
};

export const getLatestUpdates = (data) => {
  return axios({
    method: "POST",
    url: "master/getLatestUpdates",
    data: data,
  });
};

export const clientEntitlementImport = (data) => {
  return axios({
    method: "POST",
    url: "master/client/entitlement/import",
    data: data,
  });
};

export const clientEntitlementExport = (data) => {
  return axios({
    method: "POST",
    url: "master/client/entitlement/export",
    data: data,
  });
};

// Service Description APIs
export const getServiceDescription = (data) => {
  return axios({
    method: "GET",
    url: "master/serviceDescription",
    params: data,
  });
};

export const saveServiceDescription = (data) => {
  return axios({
    method: "POST",
    url: "master/serviceDescription",
    data,
  });
};

export const deleteServiceDescription = (data) => {
  return axios({
    method: "PUT",
    url: "master/serviceDescription/delete",
    data,
  });
};

export const serviceDescriptionData = (data) => {
  return axios({
    method: "GET",
    url: "master/serviceDescription/getFormData",
    params: data,
  });
};

export const updateServiceDescription = (data) => {
  return axios({
    method: "PUT",
    url: "master/serviceDescription/updateStatus",
    data,
  });
};

export const serviceDescriptionExport = (data) => {
  return axios({
    method: "POST",
    url: "master/serviceDescription/export",
    data,
  });
};

export const serviceDescriptionImport = (data) => {
  return axios({
    method: "POST",
    url: "master/serviceDescription/import",
    data: data,
  });
};