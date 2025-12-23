import { lazy } from "react";
import { Navigate } from "react-router-dom";
import Loadable from "../components/common/Loadable";
import TabList from "../pages/masters/elements/TabList";
import Components from "../pages/Components";
import AuthLayout from "../components/layout/AuthLayout";
import { useSelector } from "react-redux";
import { CurrentUser } from "../../store/slices/userSlice.js";

const MainLayout = Loadable(
  lazy(() => import("../components/layout/MainLayout"))
);
/* Dashboard Routes */
const Dashboard = Loadable(lazy(() => import("../pages/dashboard")));
/* Home  Routes */
const Home = Loadable(lazy(() => import("../pages/home")));
const CaseView = Loadable(lazy(() => import("../pages/case/CaseView")));
const CaseList = Loadable(lazy(() => import("../pages/case")));
const Inventory = Loadable(lazy(() => import("../pages/inventory")));

const CaseCreation = Loadable(lazy(() => import("../pages/caseCreation")));
const ServiceDetails = Loadable(
  lazy(() => import("../pages/case/serviceDetails/ServiceDetails"))
);
const CaseDetails = Loadable(lazy(() => import("../pages/case/CaseDetails")));

/* Master Routes */
const Element = Loadable(
  lazy(() => import("../pages/masters/elements/Element"))
);
const List = Loadable(lazy(() => import("../pages/masters/elements/List")));
const ViewPage = Loadable(lazy(() => import("../pages/static/ViewPage")));
const MasterHome = Loadable(
  lazy(() => import("../pages/masters")),
  [1]
);
const VehicleManufacturer = Loadable(
  lazy(() => import("../pages/masters/vehicleManufaturer"))
);
const VehicleModel = Loadable(
  lazy(() => import("../pages/masters/vehicleModel"))
);
const VehicleType = Loadable(
  lazy(() => import("../pages/masters/vehicleType"))
);

const WhiteList = Loadable(lazy(() => import("../pages/masters/whiteList")));
const ASPRejectionReason = Loadable(
  lazy(() => import("../pages/masters/aspRejectionReason"))
);
const Services = Loadable(lazy(() => import("../pages/masters/services")));
const SubService = Loadable(lazy(() => import("../pages/masters/subService")));
const CaseSubject = Loadable(
  lazy(() => import("../pages/masters/caseSubject"))
);
const AddCaseSubject = Loadable(
  lazy(() => import("../pages/masters/caseSubject/AddCaseSubject"))
);
const AnswerType = Loadable(lazy(() => import("../pages/masters/answerType")));
const AddAnswerType = Loadable(
  lazy(() => import("../pages/masters/answerType/AddAnswerType"))
);
const ServiceType = Loadable(
  lazy(() => import("../pages/masters/serviceType"))
);
const CaseStatus = Loadable(lazy(() => import("../pages/masters/caseStatus")));
const CallCentre = Loadable(lazy(() => import("../pages/masters/callCentre")));
const AddCallCentre = Loadable(
  lazy(() => import("../pages/masters/callCentre/AddCallCentre"))
);
const Languages = Loadable(lazy(() => import("../pages/masters/languages")));
const Customers = Loadable(lazy(() => import("../pages/masters/customers")));
const Milestone = Loadable(lazy(() => import("../pages/masters/milestone")));

const Dealers = Loadable(
  lazy(() => import("../pages/masters/dealers")),
  [1, 31]
);
const AddDealer = Loadable(
  lazy(() => import("../pages/masters/dealers/AddDealer")),
  [1]
);
const ViewDealer = Loadable(
  lazy(() => import("../pages/masters/dealers/ViewDealer")),
  [1, 31]
);
const Locations = Loadable(lazy(() => import("../pages/masters/locations")));
const Entitlement = Loadable(
  lazy(() => import("../pages/masters/entitlement"))
);
const AspRejectedCcDetailReason = Loadable(
  lazy(() => import("../pages/masters/aspRejectedCcDetailReason"))
);
const ConditionOfVehicle = Loadable(
  lazy(() => import("../pages/masters/conditionOfVehicle"))
);
const AddCity = Loadable(
  lazy(() => import("../pages/masters/locations/AddCity")),
  [1]
);
const ApplicationSettings = Loadable(
  lazy(() => import("../pages/masters/applicationSettings"))
);
const AutoAssignment = Loadable(lazy(() => import("../pages/autoAssignment")));
const Interactions = Loadable(lazy(() => import("../pages/interactions")));
const AspAssignment = Loadable(
  lazy(() => import("../pages/case/aspAssignment"))
);
const AspMechanic = Loadable(lazy(() => import("../pages/case/aspAssignment")));

const SchemeManagement = Loadable(
  lazy(() => import("../pages/masters/schemeManagement"))
);

const InventoryMaster = Loadable(
  lazy(() => import("../pages/masters/inventory"))
);

const SLAProcess = Loadable(lazy(() => import("../pages/masters/slaProcess")));

const EscalationReason = Loadable(
  lazy(() => import("../pages/masters/escalationReason"))
);

const SystemIssueReason = Loadable(
  lazy(() => import("../pages/masters/systemIssueReason"))
);

const ManualLocationReason = Loadable(
  lazy(() => import("../pages/masters/manualLocationReason"))
);

const CaseCancelReason = Loadable(
  lazy(() => import("../pages/masters/caseCancelReason"))
);

const PolicyPremium = Loadable(
  lazy(() => import("../pages/masters/policyPremium"))
);

const ServiceDescription = Loadable(
  lazy(() => import("../pages/masters/serviceDescription"))
);

const Disposition = Loadable(
  lazy(() => import("../pages/masters/disposition"))
);

const ASPActivityCancelReason = Loadable(
  lazy(() => import("../pages/masters/aspActivityCancelReason"))
);

const ProposedDelayReason = Loadable(
  lazy(() => import("../pages/masters/proposedDelayReason"))
);

/* Admin Routes */

const AdminHome = Loadable(
  lazy(() => import("../pages/admin")),
  [1]
);
const Teams = Loadable(lazy(() => import("../pages/admin/teams")));
const AddTeam = Loadable(lazy(() => import("../pages/admin/teams/AddTeam")));
const ViewTeam = Loadable(lazy(() => import("../pages/admin/teams/ViewTeam")));

const Users = Loadable(
  lazy(() => import("../pages/admin/users")),
  [1]
);
const AddUser = Loadable(
  lazy(() => import("../pages/admin/users/AddUser")),
  [1]
);
//Mechanics Routes
const Mechanics = Loadable(
  lazy(() => import("../pages/admin/mechanics")),
  [1]
);
const MechanicForm = Loadable(
  lazy(() => import("../pages/admin/mechanics/MechanicForm.jsx")),
  [1]
);
const ServiceContracts = Loadable(
  lazy(() => import("../pages/admin/serviceContracts"))
);
const AddServiceContracts = Loadable(
  lazy(() => import("../pages/admin/serviceContracts/AddServiceContracts"))
);

const VehicleMaster = Loadable(
  lazy(() => import("../pages/admin/vehicleMaster"))
);
const AddVehicleMaster = Loadable(
  lazy(() => import("../pages/admin/vehicleMaster/AddVehicleMaster"))
);
const ViewVehicleMaster = Loadable(
  lazy(() => import("../pages/admin/vehicleMaster/ViewVehicleMaster"))
);

const ServiceOrgMaster = Loadable(
  lazy(() => import("../pages/admin/serviceOrganization"))
);

const ASPMaster = Loadable(
  lazy(() => import("../pages/admin/aspMaster")),
  [1]
);
const AddASPMaster = Loadable(
  lazy(() => import("../pages/admin/aspMaster/AddASPMaster")),
  [1]
);
const ViewASPMaster = Loadable(
  lazy(() => import("../pages/admin/aspMaster/ViewAspMaster")),
  [1]
);
const AddMechanic = Loadable(
  lazy(() => import("../pages/admin/aspMaster/AddMechanic"))
);
const ViewMechanic = Loadable(
  lazy(() => import("../pages/admin/aspMaster/ViewMechanic"))
);

const BusinessHours = Loadable(
  lazy(() => import("../pages/admin/businessHours"))
);
const AddBusinessHour = Loadable(
  lazy(() => import("../pages/admin/businessHours/AddBusinessHour"))
);

const Roles = Loadable(lazy(() => import("../pages/admin/roles")));
const AddRoles = Loadable(lazy(() => import("../pages/admin/roles/AddRoles")));

const ApiDetails = Loadable(
  lazy(() => import("../pages/admin/apiDetails/index.jsx"))
);

const Templates = Loadable(lazy(() => import("../pages/admin/templates")));
/* Client Routes*/
const Client = Loadable(lazy(() => import("../pages/clients")));
const AddClient = Loadable(lazy(() => import("../pages/clients/AddAccount")));
const EditClient = Loadable(lazy(() => import("../pages/clients/AddAccount")));

const ViewClient = Loadable(lazy(() => import("../pages/clients/ViewAccount")));
/* Reports Routes*/
const ReportHome = Loadable(lazy(() => import("../pages/reports")));
const ASPSyncCall = Loadable(
  lazy(() => import("../pages/reports/aspSyncCall"))
);
const OwnPatrolContribution = Loadable(
  lazy(() => import("../pages/reports/ownPatrolContribution"))
);
/*Own Patrol*/
const OwnPatrolDashboard = Loadable(
  lazy(() => import("../pages/ownPatrolDashboard"))
);
const MapView = Loadable(lazy(() => import("../pages/mapView")));

/* Delivery Request Routes */
const DeliveryRequest = Loadable(
  lazy(() => import("../pages/deliveryRequest")),
  [1, 2, 3, 7, 31]
);
const DeliveryRequestView = Loadable(
  lazy(() => import("../pages/deliveryRequest/DeliveryRequestView")),
  [1, 2, 3, 7, 31]
);
const ServiceProvider = Loadable(
  lazy(() => import("../pages/deliveryRequest/ServiceProvider")),
  [3]
);
const NewRequest = Loadable(
  lazy(() => import("../pages/deliveryRequest/NewRequest")),
  [2]
);
const CustomReport = Loadable(
  lazy(() => import("../pages/deliveryRequest/CustomReport"))
);
const EditRequest = Loadable(
  lazy(() => import("../pages/deliveryRequest/NewRequest"))
);

const InvoiceView = Loadable(
  lazy(() => import("../pages/deliveryRequest/InvoiceView"))
);
//Wallet
const Wallet = Loadable(
  lazy(() => import("../pages/wallet")),
  [2, 31]
);
//profile
const AccountProfile = Loadable(lazy(() => import("../pages/account")));

const SaleServiceHelp = Loadable(
  lazy(() => import("../pages/sale-servicehelp"))
);

const ReportManagement = Loadable(
  lazy(() => import("../pages/report-management"))
);

const CustomReportColumns = Loadable(
  lazy(() => import("../pages/masters/deliveryRequestReport")),
  [1, 2]
);

const AddCustomReportColumns = Loadable(
  lazy(() => import("../pages/masters/deliveryRequestReport/AddColumnReport")),
  [1]
);

const SlaReasons = Loadable(
  lazy(() => import("../pages/masters/slaReasons")),
  [1, 2]
);
const RosSuccessReasons = Loadable(
  lazy(() => import("../pages/masters/rosSuccessReasons")),
  [1, 2]
);
const RosFailureReasons = Loadable(
  lazy(() => import("../pages/masters/rosFailureReasons")),
  [1, 2]
);
const TowSuccessReasons = Loadable(
  lazy(() => import("../pages/masters/towSuccessReasons")),
  [1, 2]
);
const TowFailureReasons = Loadable(
  lazy(() => import("../pages/masters/towFailureReasons")),
  [1, 2]
);
const Notifications = Loadable(lazy(() => import("../pages/notifications")));
const CallInitiate = Loadable(lazy(() => import("../pages/call-initiate")));

const TDSList = Loadable(
  lazy(() => import("../pages/tds")),
  [1, 2, 31]
);

const AddTds = Loadable(
  lazy(() => import("../pages/tds/AddEditTds")),
  [2]
);

const EditTds = Loadable(
  lazy(() => import("../pages/tds/AddEditTds")),
  [2]
);

const ViewTds = Loadable(
  lazy(() => import("../pages/tds/ViewTds.jsx")),
  [1, 2, 31]
);

const ReminderReport = Loadable(
  lazy(() => import("../pages/reports/ReminderReport"))
);
const ServiceSummaryReport = Loadable(
  lazy(() => import("../pages/reports/ServiceSummaryReport"))
);

const VehicleHelper = Loadable(
  lazy(() => import("../pages/admin/vehicleHelper")),
  [1]
);
const AddEditHelper = Loadable(
  lazy(() => import("../pages/admin/vehicleHelper/AddEditHelper")),
  [1]
);

const UserRoutes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "case-creation/:id",
        element: <CaseCreation />,
      },
      /*{
        path: "/dashboard",
        element: <Dashboard />,
      }, */
      {
        path: "clients",
        children: [
          {
            index: true,
            element: <Client />,
          },
          {
            path: "add",
            element: <AddClient />,
          },
          {
            path: "edit/:clientId",
            element: <EditClient />,
          },
          {
            path: "view/:clientId",
            element: <ViewClient />,
          },
        ],
      },
      {
        path: "cases",
        children: [
          {
            index: true,
            element: <CaseList />,
          },
          {
            path: "view/:caseId",
            element: <CaseView />,
            children: [
              /* {
                path: "",
                element: <CaseDetails />,
              },*/
              {
                path: "service-details",
                element: <ServiceDetails />,
              },
            ],
          },
          {
            path: "asp-assignment/:id/:caseActivityId",
            element: <AspAssignment />,
          },
          {
            path: "asp-mechanic",
            element: <AspMechanic />,
          },
          {
            path: "inventory/:activityId/:typeOfId",
            element: <Inventory />,
          },
          {
            path: "towing-inventory/:activityId/:typeOfId",
            element: <Inventory />,
          },
          {
            path: "inventory/update/:activityId/:typeOfId",
            element: <Inventory />,
          },
          {
            path: "towing-inventory/update/:activityId/:typeOfId",
            element: <Inventory />,
          },
        ],
      },
      /* {
        path: "auto-assignment",
        element: <AutoAssignment />,
      },
      {
        path: "own-patrol",
        element: <OwnPatrolDashboard />,
      },
      {
        path: "interactions",
        element: <Interactions />,
      }, */
      {
        path: "map",
        element: <MapView />,
      },

      // VDM Routes

      {
        path: "/dealers",
        children: [
          { index: true, element: <Dealers /> },
          { path: "view/:dealer", element: <ViewDealer /> },
        ],
      },
      {
        path: "/delivery-request",
        children: [
          {
            index: true,
            element: <DeliveryRequest />,
          },
          {
            path: "new",
            element: <NewRequest />,
          },
          {
            path: "edit",
            element: <EditRequest />,
          },
          {
            path: "report",
            element: <CustomReport />,
          },
          {
            path: "view/:caseId",
            element: <DeliveryRequestView />,
          },
          {
            path: ":id/service-provider",
            element: <ServiceProvider />,
          },

          {
            path: "invoice-view/:invoiceId",
            element: <InvoiceView />,
          },
        ],
      },
      {
        path: "/call-initiation",
        element: <CallInitiate />,
      },
      {
        path: "/sale-servicehelp-contact",
        element: <SaleServiceHelp />,
      },
      {
        path: "/wallet",
        element: <Wallet />,
      },
      {
        path: "/report-management",
        element: <ReportManagement />,
      },

      {
        path: "/notifications",
        element: <Notifications />,
      },

      {
        path: "/tds",
        children: [
          {
            index: true,
            element: <TDSList />,
          },
          {
            path: "addtds",
            element: <AddTds />,
          },
          {
            path: "edittds/:id",
            element: <EditTds />,
          },
          {
            path: "view/:id",
            element: <ViewTds />,
          },
        ],
      },
      /* VDM Routes */

      /*  {
        path: "/account",
        element: <AccountProfile />,
      },
      {
        path: "/components",
        element: <Components />,
      }, */
    ],
  },
  {
    path: "/master",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <MasterHome />,
      },

      /*  {
        path: "vehicle-type",
        element: <VehicleType />,
      },  */
      {
        path: "vehicle-manufacturer",
        element: <VehicleManufacturer />,
      },
      {
        path: "vehicle-model",
        element: <VehicleModel />,
      },
      {
        path: "vehicle-type",
        element: <VehicleType />,
      },

      /*{
        path: "whitelist",
        element: <WhiteList />,
      },*/
      { path: "asp-reject-reason", element: <ASPRejectionReason /> },
      {
        path: "elements",
        element: <Element />,
      },

      /*  {
        path: "services",
        element: <Services />,
      }, */
      {
        path: "sub-services",
        element: <SubService />,
      },
      {
        path: "case-subject",
        element: <CaseSubject />,
      },
      {
        path: "case-subject/add",
        element: <AddCaseSubject />,
      },
      {
        path: "case-subject/edit/:caseSubjectId",
        element: <AddCaseSubject />,
      },
      {
        path: "answer-type",
        element: <AnswerType />,
      },
      {
        path: "answer-type/add",
        element: <AddAnswerType />,
      },
      {
        path: "answer-type/edit/:answerTypeId",
        element: <AddAnswerType />,
      },
      {
        path: "service-type",
        element: <ServiceType />,
      },

      /*        {
        path: "case-status",
        element: <CaseStatus />,
      },*/

      {
        path: "languages",
        element: <Languages />,
      },
      {
        path: "entitlements",
        element: <Entitlement />,
      },
      {
        path: "aspRejectedCcDetailReason",
        element: <AspRejectedCcDetailReason />,
      },
      {
        path: "conditionofvehicle",
        element: <ConditionOfVehicle />,
      },
      /* {
        path: "scheme-management",
        element: <SchemeManagement />,
      },
      {
        path: "milestone",
        element: <Milestone />,
      },*/
      /*  {
        path: "customers",
        element: <Customers />,
      },*/

      {
        path: "sla-reasons",
        children: [
          { index: true, element: <SlaReasons /> },
          // { path: "add", element: <AddCustomReportColumns /> },
          // { path: "edit/:roleId/:id", element: <AddCustomReportColumns /> },
        ],
      },
      {
        path: "ros-success-reasons",
        children: [{ index: true, element: <RosSuccessReasons /> }],
      },
      {
        path: "ros-failure-reasons",
        children: [{ index: true, element: <RosFailureReasons /> }],
      },
      {
        path: "tow-success-reasons",
        children: [{ index: true, element: <TowSuccessReasons /> }],
      },
      {
        path: "tow-failure-reasons",
        children: [{ index: true, element: <TowFailureReasons /> }],
      },
      {
        path: "locations",
        children: [
          { index: true, element: <Locations /> },
          { path: "add/city", element: <AddCity /> },
          { path: "edit/:cityId", element: <AddCity /> },
        ],
      },
      {
        path: "escalation-reason",
        element: <EscalationReason />,
      },
      {
        path: "system-issue-reason",
        element: <SystemIssueReason />,
      },
      {
        path: "manual-location-reason",
        element: <ManualLocationReason />,
      },
      {
        path: "case-cancel-reason",
        element: <CaseCancelReason />,
      },
      {
        path: "policy-premium",
        element: <PolicyPremium />,
      },
      {
        path: "service-description",
        element: <ServiceDescription />,
      },
      {
        path: "disposition",
        element: <Disposition />,
      },
      {
        path: "asp-activity-cancel-reason",
        element: <ASPActivityCancelReason />,
      },
      {
        path: "proposed-delay-reason",
        element: <ProposedDelayReason />,
      },

      /* {
        path: "locations",
        element: <Locations />,
      },*/
      /* {
        path: "inventory",
        element: <InventoryMaster />,
      }, */
      /*  {
        path: "applications-settings",
        element: <ApplicationSettings />,
      }, */
      /*{
        path: "list",
        element: <List />,
      },
 
      {
        path: "tablist",
        element: <TabList />,
      }, */
    ],
  },
  {
    path: "/admin",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <AdminHome />,
      },
      {
        path: "users",
        children: [
          { index: true, element: <Users /> },
          { path: "add", element: <AddUser /> },
          { path: "edit/:userId", element: <AddUser /> },
        ],
      },
      {
        path: "mechanics",
        children: [
          { index: true, element: <Mechanics /> },
          { path: "add", element: <MechanicForm /> },
          { path: "edit/:mechanicID", element: <MechanicForm /> },
        ],
      },
      /* {
        path: "teams",
        children: [
          { index: true, element: <Teams /> },
          { path: "add", element: <AddTeam /> },
          { path: "view", element: <ViewTeam /> },
        ],
      },
      {
        path: "service-contracts",
        children: [
          { index: true, element: <ServiceContracts /> },
          { path: "add", element: <AddServiceContracts /> },
        ],
      },
      {
        path: "business-hours",
        children: [
          { index: true, element: <BusinessHours /> },
          { path: "add", element: <AddBusinessHour /> },
        ],
      },*/
      {
        path: "roles",
        children: [
          { index: true, element: <Roles /> },
          { path: "add", element: <AddRoles /> },
          { path: "edit/:roleId", element: <AddRoles /> },
        ],
      },
      /* {
        path: "templates",
        element: <Templates />,
      }, */
      {
        path: "asp-master",
        children: [
          { index: true, element: <ASPMaster /> },
          { path: "add", element: <AddASPMaster /> },
          { path: "edit/:aspId", element: <AddASPMaster /> },
          {
            path: "view/:aspId",
            element: <ViewASPMaster />,
          },
          {
            path: "add-mechanic",
            element: <AddMechanic />,
          },
          {
            path: "view-mechanic",
            element: <ViewMechanic />,
          },
        ],
      },
      {
        path: "service-org-master",
        children: [{ index: true, element: <ServiceOrgMaster /> }],
      },
      {
        path: "vehicle-master",
        children: [
          { index: true, element: <VehicleMaster /> },
          { path: "add", element: <AddVehicleMaster /> },
          { path: "edit/:vehicleId", element: <AddVehicleMaster /> },
          { path: "view/:vehicleId", element: <ViewVehicleMaster /> },
        ],
      },
      {
        path: "helper",
        children: [
          { index: true, element: <VehicleHelper /> },
          { path: "add", element: <AddEditHelper /> },
          { path: "edit/:helperId", element: <AddEditHelper /> },
        ],
      },

      /*  {
        path: "service-org-master",
        children: [{ index: true, element: <ServiceOrgMaster /> }],
      }, */

      /*{
        path: "api-details",
        element: <ApiDetails />,
      }, */
      {
        path: "call-centers",
        children: [
          {
            index: true,
            element: <CallCentre />,
          },
          {
            path: "add",
            element: <AddCallCentre />,
          },
          {
            path: "edit/:callCenterId",
            element: <AddCallCentre />,
          },
        ],
      },
      {
        path: "dealers",
        children: [
          { index: true, element: <Dealers /> },
          { path: "add", element: <AddDealer /> },
          { path: "edit/:dealerId", element: <AddDealer /> },
          { path: "view/:dealer", element: <ViewDealer /> },
        ],
      },
      {
        path: "sla-settings",
        element: <SLAProcess />,
      },
      {
        path: "deliveryRequestReport",
        children: [
          { index: true, element: <CustomReportColumns /> },
          { path: "add", element: <AddCustomReportColumns /> },
          { path: "edit/:roleId/:id", element: <AddCustomReportColumns /> },
        ],
      },
    ],
  },
  {
    path: "/reports",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <ReportHome />,
      },
      {
        path: "reminder-report",
        element: <ReminderReport />,
      },
      {
        path: "crm-reports/:id",
        children: [
          {
            index: true,
            element: <ReminderReport />,
          },
        ],
      },
      {
        path: "delivery-req-report",
        children: [
          {
            index: true,
            element: <ReminderReport />,
          },
        ],
      },

      {
        path: "asp-sync-calls",
        children: [
          {
            index: true,
            element: <ASPSyncCall />,
          },
        ],
      },
      {
        path: "summary-report",
        element: <ServiceSummaryReport />,
      },
      {
        path: "coco-contribution-summary-report",
        children: [
          {
            index: true,
            element: <OwnPatrolContribution />,
          },
        ],
      },
    ],
  },
  /*{
    path: "/static",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <List />,
      },
      {
        path: "view",
        element: <ViewPage />,
      },
    ],
  },*/
];

export default UserRoutes;
