import axios from "axios";

//Get Call Initiate List
export const getCallInitiateList = (data) => {
  return axios({
    method: "GET",
    url: "case/getCallInitiationList",
    params: data,
  });
};

//Get Form Initall Data
export const getFormDataCallInitiation = (data) => {
  return axios({
    url: "master/callInitiation/getFormData",
    method: "GET",
    params: data,
  });
};

//export call initiate

export const exportCallInitiate = (data) => {
  return axios({
    url: "case/callInitiationExport",
    method: "POST",
    data: data,
  });
};

export const getCallInitiateFilterData = () => {
  return axios({
    url: "master/callInitiation/getFilterData",
    method: "GET",
  });
};

export const getFormDataDisposition = (data) => {
  return axios({
    url: "master/disposition",
    method: "GET",
    params: data,
  });
};

export const getCaseSubjectServices = (data) => {
  return axios({
    url: "master/getSubjectService",
    method: "POST",
    data: data,
  });
};

export const getCaseSubjectSubServices = (data) => {
  return axios({
    url: "master/subService",
    method: "GET",
    params: data,
  });
};

export const saveTempCaseFormDetail = (data) => {
  return axios({
    url: "case/save/tempCaseFormDetail",
    method: "POST",
    data: data,
  });
};

export const getFormDataCreateCase = (data) => {
  return axios({
    url: "case/rsa/getFormData",
    method: "GET",
    params: data,
  });
};

export const getCaseVehicleModel = (data) => {
  return axios({
    url: "master/vehicleModel",
    method: "GET",
    params: data,
  });
};

export const getMembershipTypes = (data) => {
  return axios({
    url: "master/membershipTypes/getList",
    method: "POST",
    data: data,
  });
};

export const getEntitlementDetails = (data) => {
  return axios({
    url: "case/getCustomerEntitlementDetails",
    method: "POST",
    data: data,
  });
};

export const getFullServiceEntitlements = (data) => {
  return axios({
    url: "case/getCustomerServiceEntitlements",
    method: "POST",
    data: data,
  });
};

export const createCallIntiate = (data) => {
  return axios({
    method: "POST",
    url: "case/callInitiation",
    data: data,
  });
};

export const getNearestDealersByLocation = (data) => {
  return axios({
    method: "POST",
    url: "master/getNearestDealersByLocation",
    data: data,
  });
};

export const assignCaseAsp = (data) => {
  return axios({
    method: "POST",
    url: "case/rsa/activityRequest",
    data: data,
  });
};

export const caseMapView = (data) => {
  return axios({
    method: "POST",
    url: "case/rsa/asp/mapView",
    data: data,
  });
};

export const caseAccectRequest = (data) => {
  return axios({
    method: "PUT",
    url: "case/asp/activity/accept",
    data: data,
  });
};

export const getStateId = (data) => {
  return axios({
    method: "POST",
    url: "master/state/getByGoogleMapCode",
    data: data,
  });
};

export const getCityMaster = (data) => {
  return axios({
    method: "GET",
    url: "master/city",
    params: data,
  });
};

export const createCaseInfo = (data) => {
  return axios({
    method: "POST",
    url: "case/createCaseInformation",
    data: data,
  });
};

export const getCaseInfo = (data) => {
  return axios({
    method: "POST",
    url: "case/getCaseInformation",
    data: data,
  });
};

// Get Vehicle Case Details for Map View
export const getMapViewVehicleCaseDetails = (data) => {
  return axios({
    method: "POST",
    url: "case/mapView/getVehicleCaseDetails",
    data: data,
  });
};

// Get Technician Case Details for Map View
export const getMapViewTechnicianCaseDetails = (data) => {
  return axios({
    method: "POST",
    url: "case/mapView/getTechnicianCaseDetails",
    data: data,
  });
};

// Get Case Service Details for Map View
export const getMapViewCaseServiceDetails = (data) => {
  return axios({
    method: "POST",
    url: "case/mapView/getCaseServiceDetails",
    data: data,
  });
};

export const caseList = (data) => {
  return axios({
    method: "POST",
    url: "case/caseInfoList",
    data: data,
  });
};

export const refundCaseList = (data) => {
  return axios({
    method: "POST",
    url: "case/refundCaseInfoList",
    data: data,
  });
};

export const caseGrid = (data) => {
  return axios({
    method: "GET",
    url: "case/caseInfoGridList",
    params: data,
  });
};

export const subServiceGrid = (data) => {
  return axios({
    method: "POST",
    url: "case/caseSubServiceGridList",
    data: data,
  });
};

export const sendLocationURL = (data) => {
  return axios({
    method: "POST",
    url: "case/sendLocationUrl",
    data: data,
  });
};

export const saveLocationLog = (data) => {
  return axios({
    method: "POST",
    url: "case/saveLocationLogs",
    data: data,
  });
};

export const checkLocationExpiry = (data) => {
  return axios({
    method: "POST",
    url: "case/checkLocationExpiry",
    data: data,
  });
};

export const quickSearch = (data) => {
  return axios({
    method: "POST",
    url: "case/elasticsearch",
    data: data,
  });
};

export const getMembershipRatecard = (data) => {
  return axios({
    method: "POST",
    url: "master/get/nonMembership/rateCards",
    data: data,
  });
};

export const getReceivedSMSId = (data) => {
  return axios({
    method: "POST",
    url: "case/getLocationDetails",
    data: data,
  });
};

export const requestPolicyInterestedCustomer = (data) => {
  return axios({
    method: "POST",
    url: "case/process/policyInterestedCustomer",
    data: data,
  });
};

export const uploadAccidentalDocument = (data) => {
  return axios({
    method: "POST",
    url: "case/uploadAccidentalDocument",
    data: data,
  });
};

export const updateAccidentalDocumentRemarks = (data) => {
  return axios({
    method: "POST",
    url: "case/updateAccidentalDocumentRemarks",
    data: data,
  });
};

export const sendAccidentalDocumentUrl = (data) => {
  return axios({
    method: "POST",
    url: "case/accidentalDocument/sendTrackerUrl",
    data: data,
  });
};

export const checkAccidentalDocumentUrl = (data) => {
  return axios({
    method: "POST",
    url: "case/accidentalDocument/checkExpiry",
    data: data,
  });
};

export const getNspLocations = (data) => {
  return axios({
    method: "POST",
    url: "case/rsa/getNspLocations",
    data: data,
  });
};

export const sendPaymentLinkToCustomer = (data) => {
  return axios({
    method: "POST",
    url: "case/activity/processNonMembership",
    data: data,
  });
};

export const storeAdditionalPaymentDisagreement = (data) => {
  return axios({
    method: "POST",
    url: "case/activity/storeAdditionalPaymentDisagreement",
    data: data,
  });
};

export const caseSendApproval = (data) => {
  return axios({
    method: "POST",
    url: "case/rsa/approve/activity",
    data: data,
  });
};

// GET Service Details
export const additionalServiceDetails = (data) => {
  return axios({
    method: "GET",
    url: "case/rsa/getAdditionalServiceRequestFormData",
    params: data,
  });
};
// update serivce
export const addService = (data) => {
  return axios({
    method: "POST",
    url: "case/addService",
    data: data,
  });
};

// Add Inventory in Actvity Case
export const addRSAActivityInventory = (data) => {
  return axios({
    method: "POST",
    url: "case/rsaActivityInventory",
    data: data,
  });
};

// Get form Data for ASP Activity Status changes
export const getAspActivityStatuses = (data) => {
  return axios({
    method: "POST",
    url: "case/getAspActivityStatuses",
    data: data,
  });
};

// Update ASP Activity Status Changes
export const updateAspActivityStatuses = (data) => {
  return axios({
    method: "PUT",
    url: "case/asp/activity/updateStatus",
    data: data,
  });
};

export const getSubServiceList = (data) => {
  return axios({
    method: "GET",
    url: "case/caseSubServiceList",
    params: data,
  });
};

export const updatePickupTime = (data) => {
  return axios({
    method: "POST",
    url: "case/updateAgentPickedActivity",
    data: data,
  });
};

export const paymentLinkExpire = (data) => {
  return axios({
    method: "POST",
    url: "case/activity/checkPaymentLinkExpiredOrNot",
    data: data,
  });
};

export const resendPaymentLink = (data) => {
  return axios({
    method: "POST",
    url: "case/activity/resendPaymentLink",
    data: data,
  });
};

export const initiateCancellation = (data) => {
  return axios({
    method: "POST",
    url: "case/activity/initiateCancellation",
    data: data,
  });
};

export const checkRefundStatus = (data) => {
  return axios({
    method: "POST",
    url: "case/activity/check/refundStatus",
    data: data,
  });
};

// Get Activity Transactions
export const getActivityTransactions = (activityId) => {
  return axios({
    method: "GET",
    url: "case/activities/transactions",
    params: { activityId },
  });
};

export const getLatestPositiveActivity = (data) => {
  return axios({
    method: "POST",
    url: "case/getLatestPositiveActivity",
    data: data,
  });
};

//Send Customer Invoice
export const sendCustomerInvoice = (data) => {
  return axios({
    method: "POST",
    url: "case/activity/sendCustomerInvoice",
    data: data,
  });
};

//Policy type Save & edit
export const savePolicyType = (data) => {
  return axios({
    method: "POST",
    url: "case/updatePolicyDetail",
    data: data,
  });
};

//get form policy type
export const policyTypeData = (data) => {
  return axios({
    method: "POST",
    url: "case/policyDetailUpdate/formData",
    data: data,
  });
};
//update Location
export const updateLocation = (data) => {
  return axios({
    method: "POST",
    url: "case/rsa/updateLocation",
    data: data,
  });
};

//update payment cash
export const cashPayment = (data) => {
  return axios({
    method: "POST",
    url: "case/activity/processCashPaymentMethod",
    data: data,
  });
};

//Vdm update Location
export const updateVdmLocation = (data) => {
  return axios({
    method: "POST",
    url: "case/updateLocation",
    data: data,
  });
};
//Asp Live Location
export const getAspLiveLocation = (data) => {
  return axios({
    method: "POST",
    url: "case/escalation/getAspLiveLocation",
    data: data,
  });
};
//id card
export const getIdCard = (data) => {
  return axios({
    method: "POST",
    url: "case/serviceProviderIdCardDetail",
    data: data,
  });
};
//agent followup
export const agentFollowup = (data) => {
  return axios({
    method: "PUT",
    url: "case/agentReplacement",
    data: data,
  });
};

//Ongoing cases
export const getOngoingCases = (data) => {
  return axios({
    method: "POST",
    url: "case/dashboard/agentOnGoingCases",
    data: data,
  });
};

//Get service provider live location for agent view purpose.
export const getServiceProviderLiveLocation = (data) => {
  return axios({
    method: "POST",
    url: "case/getServiceProviderLiveLocation",
    data: data,
  });
};

//Update service drop location
export const updateServiceDropLocation = (data) => {
  return axios({
    method: "POST",
    url: "case/addService/updateDropLocation",
    data: data,
  });
};

export const activityCheckPaymentStatus = (data) => {
  return axios({
    method: "POST",
    url: "case/activity/checkPaymentStatus",
    data: data,
  });
};

// Search Cases for Interaction Form
export const searchCasesForInteraction = (searchKey, levelId) => {
  return axios({
    method: "GET",
    url: "case/searchCasesForInteraction",
    params: { searchKey, ...(levelId && { levelId }) },
  });
};

// Customer Feedback APIs
export const getCustomerFeedbackFormData = () => {
  return axios({
    method: "GET",
    url: "master/customerFeedback/getFormData",
  });
};

export const getCustomerFeedbackQuestions = (callStatusId, clientId = null) => {
  const params = { callStatusId };
  if (clientId) {
    params.clientId = clientId;
  }
  return axios({
    method: "GET",
    url: "master/customerFeedback/getQuestionsByCallStatus",
    params,
  });
};

export const saveCustomerFeedback = (data) => {
  return axios({
    method: "POST",
    url: "case/customerFeedback/save",
    data: data,
  });
};

export const getCustomerFeedbackByCaseId = (caseDetailId) => {
  return axios({
    method: "GET",
    url: "case/customerFeedback/getByCaseId",
    params: { caseDetailId },
  });
};

export const getQuestionnaireAnswersByCaseId = (caseId) => {
  return axios({
    method: "GET",
    url: "case/questionnaire/getByCaseId",
    params: { caseId },
  });
};
