/* Menu Icons */
import HomeMenuIcon from "../assets/img/menu-icons/home-icon.svg";
import ClientsMenuIcon from "../assets/img/menu-icons/clients-icon.svg";
import CasesMenuIcon from "../assets/img/menu-icons/cases-icon.svg";
import AdminMenuIcon from "../assets/img/menu-icons/admin-icon.svg";
import PatrolMenuIcon from "../assets/img/menu-icons/patrol-icon.svg";
import InteractionsMenuIcon from "../assets/img/menu-icons/interactions-icon.svg";
import AssignmentMenuIcon from "../assets/img/menu-icons/assignment-icon.svg";
import ReportsMenuIcon from "../assets/img/menu-icons/reports-icon.svg";
import MapMenuIcon from "../assets/img/menu-icons/map-icon.svg";
import MastersMenuIcon from "../assets/img/menu-icons/masters-icon.svg";
import EscalationsMenuIcon from "../assets/img/menu-icons/escalations-icon.svg";
import CallsMenuIcon from "../assets/img/menu-icons/calls-icon.svg";
import DeliveryRequestIcon from "../assets/img/menu-icons/folder-profile-icon.svg";
import SaleServiceIcon from "../assets/img/menu-icons/sale-service-icon.svg";
import TaxDeductionIcon from "../assets/img/menu-icons/tax-icon.svg";

import {
  CallCenterIcon,
  CaseStatusIcon,
  CaseSubjectIcon,
  AnswerTypeIcon,
  CustomerIcon,
  DealersIcon,
  LanguageIcon,
  LocationsIcon,
  MileStoneIcon,
  RejectionReasonIcon,
  ServiceIcon,
  ServiceTypeIcon,
  SettingsIcon,
  SubServiceIcon,
  VehicleManufacturerIcon,
  VehicleModelIcon,
  WhitelistIcon,
  UserIcon,
  TeamsIcon,
  ServiceContractsIcon,
  BusinessHoursIcon,
  RolesIcon,
  TemplatesIcon,
  MasterUploadIcon,
  ASPMasterIcon,
  VehicleMasterIcon,
  ServiceOrgMasterIcon,
  APIDetailsIcon,
  ReportIcon,
  UsersReportIcon,
  FileXIcon,
  documentIcon,
  InteractionIcon,
  UserTickIcon,
  ShieldPlusIcon,
  PasswordIcon,
  SystemClockIcon,
  MobileIcon,
  BuildingsIcon,
  ASPIcon,
  TruckIcon,
  PhoneIcon,
  SchemeMangement,
  InventoryIcon,
  RequestReportIcon,
  SLASettingsIcon,
  EscalationReasonIcon,
  SystemIssueIcon,
  ManualLocationIcon,
  ASPCanelIcon,
  DispositionIcon,
  PolicyPremiumIcon,
  CaseCancelIcon,
  EntitlementIcon,
  VehicleConditionIcon,
  AspRejectCcIcon,
  ProposedDelayReasonIcon,
  RosFailureIcon,
  RosSuccessIcon,
  TowSuccessIcon,
  TowFailureIcon,
} from "./imgConstants";
import { useSelector } from "react-redux";

/* Menu List */
export const MenuList = [
  {
    group_title: "Menu",
    menus: [
      {
        label: "Home",
        icon: HomeMenuIcon,
        key: 1,
        code: "",
        // accessRoleId: [3,8,1,7],
        url: "/",
        requiredPermission: "home",
      },
      {
        label: "Clients",
        icon: ClientsMenuIcon,
        key: 2,
        code: "clients",
        url: "/clients",
        requiredPermission: "client",
        // accessRoleId: [1],
      },
      {
        label: "Cases",
        icon: CasesMenuIcon,
        key: 3,
        // accessRoleId: [3,8,1,7,14,15,16,21,22,23,24,25,26,27],
        code: "cases",
        url: "/cases",
        requiredPermission: "cases-web",
      },
      {
        label: "Admin",
        icon: AdminMenuIcon,
        key: 4,
        code: "admin",
        // accessRoleId: [1],
        url: "/admin",
        requiredPermission: "admin",
        submenus: [
          {
            label: "Users",
            url: "users",
            description:
              "Who use the application to request assistance for their vehicles.",
            icon: UserIcon,
          },
          /*  {
            label: "Teams",
            url: "teams",
            description: "Teams are groups of people who work together",
            icon: TeamsIcon,
          },
          {
            label: "Service Contracts",
            url: "service-contracts",
            description:
              "Service Contracts are agreements that specify service terms and conditions.",
            icon: ServiceContractsIcon,
          },
          {
            label: "Business Hours",
            url: "business-hours",
            description: "Business is open and available to provide services.",
            icon: BusinessHoursIcon,
          }, */
          {
            label: "Roles",
            url: "roles",
            description:
              "Organise and assign permissions to users in a system or organisation.",
            icon: RolesIcon,
          },
          /*{
            label: "Templates",
            url: "templates",
            description:
              "Templates of SMS that is sent to customers, ASP, and Users.",
            icon: TemplatesIcon,
          },
          {
            label: "Master Upload",
            url: "master-upload",
            description:
              "Master upload refers to the process of uploading a master copy of a file or data.",
            icon: MasterUploadIcon,
          }, */
          {
            label: "ASP Master",
            url: "asp-master",
            description:
              "To quickly add or view from a list of authorised service providers.",
            icon: ASPMasterIcon,
          },
          {
            label: "Mechanics",
            url: "mechanics",
            description:
              "To quickly add or view from a list of authorised mechanics.",
            icon: ASPMasterIcon,
          },
          {
            label: "COCO Vehicle Master",
            url: "vehicle-master",
            description: "To quickly add or view from a list of vehicles.",
            icon: VehicleMasterIcon,
          },
          {
            label: "COCO Vehicle Helper",
            url: "helper",
            description:
              "A vehicle helper aids in maintenance, repairs, and inspections.",
            icon: UserIcon,
          },
          {
            label: "Service Org Master",
            url: "service-org-master",
            description:
              "Organisation provides services to multiple subsidiary organisations.",
            icon: ServiceOrgMasterIcon,
          },
          /* {
            label: "API Details",
            url: "api-details",
            description:
              "Communication between systems for data exchange and interaction.",
            icon: APIDetailsIcon,
          },  */
          {
            label: "Call Center",
            url: "call-centers",
            description:
              "Manage large volumes of incoming and outgoing telephone calls.",
            icon: CallCenterIcon,
          },
          {
            label: "Dealers",
            url: "dealers",
            description:
              "Businesses authorized to sell or distribute a specific product or service.",
            icon: DealersIcon,
          },
          {
            label: "SLA Settings",
            url: "sla-settings",
            description:
              "To provide the access for the user to configure the SLA time",
            icon: SLASettingsIcon,
          },
          {
            label: "Delivery Request Report Settings",
            url: "deliveryRequestReport",
            description:
              "To provide role-based column access for generating the delivery request report.",
            icon: RequestReportIcon,
          },
        ],
      },
      /*{
        label: "Own Patrol",
        icon: PatrolMenuIcon,
        key: 5,
        code: "own-patrol",
        url: "/own-patrol",
      },
      {
        label: "Interactions",
        icon: InteractionsMenuIcon,
        key: 6,
        code: "interactions",
        url: "/interactions",
      }, */

      /*VDM Menu  */
      {
        label: "Dealers",
        icon: AdminMenuIcon,
        key: 10,
        accessRoleId: [31],
        code: "dealers",
        url: "/dealers",
      },
      {
        label: "Delivery Requests",
        icon: DeliveryRequestIcon,
        key: 7,
        accessRoleId: [1, 2, 3, 7, 31],
        code: "delivery-request",
        url: "/delivery-request",
      },
      {
        label: "TDS",
        icon: TaxDeductionIcon,
        key: 8,
        accessRoleId: [1, 2, 31],
        code: "tds",
        url: "/tds",
      },
      {
        label: "Contact Us",
        icon: SaleServiceIcon,
        key: 9,
        accessRoleId: [2, 3, 7, 8, 1],
        code: "sale-servicehelp-contact",
        url: "/sale-servicehelp-contact",
      },

      /*CRM Menu  */
      /* Call Initiate */
      {
        label: "Call Initiation",
        icon: AssignmentMenuIcon,
        key: 16,
        // accessRoleId: [3,8],
        code: "call-initiation",
        url: "/call-initiation",
        requiredPermission: "call-initiation",
      },
    ],
  },
  {
    group_title: "Settings",
    menus: [
      /*  {
        label: "Auto Assignment",
        icon: AssignmentMenuIcon,
        key: 9,
        code: "auto-assignment",
        url: "/auto-assignment",
      }, */
      {
        label: "Reports",
        icon: ReportsMenuIcon,
        key: 10,
        code: "reports",
        url: "/reports",
        // requiredPermission: "reports-web",

        accessRoleId: [1, 3, 7],
        // submenus: [
        //   {
        //     label: "Reminder Report",
        //     description:
        //       "Notification listing upcoming tasks that that require attention or action.",
        //     icon: ReportIcon,
        //     url: "reminder-report",
        //   },
        //   {
        //     label: "Client Report",
        //     description:
        //       "Summary of a client's account or project activities and performance.",
        //     icon: UsersReportIcon,
        //     url: "client-report",
        //   },
        //   {
        //     label: "Financial Report",
        //     description:
        //       "A document that presents the financial performance of a business.",
        //     icon: FileXIcon,
        //     url: "financial-report",
        //   },
        //   {
        //     label: "Summary Report",
        //     description:
        //       "A brief document that summarizes the main points and key takeaways.",
        //     icon: documentIcon,
        //     url: "summary-report",
        //   },
        //   {
        //     label: "Interaction Report",
        //     description:
        //       "A document that provides an overview of interactions with a business.",
        //     icon: InteractionIcon,
        //     url: "Interaction-report",
        //   },
        //   {
        //     label: "ASP Accept / Reject Report",
        //     description:
        //       "A list of requests that have been accepted or rejected, with reasons.",
        //     icon: UserTickIcon,
        //     url: "asp-accept-reject-report",
        //   },
        //   {
        //     label: "Own patrol Contribution Summary",
        //     description:
        //       "A summary of an individual's contributions made during a patrol.",
        //     icon: ShieldPlusIcon,
        //     url: "ownpatorl-report",
        //   },
        //   {
        //     label: "Login / Logout Report",
        //     description:
        //       "Activity of tracking the times and durations of user logins and logouts.",
        //     icon: PasswordIcon,
        //     url: "login-logout-report",
        //   },
        //   {
        //     label: "ASP Portal Report",
        //     description:
        //       "A summary or analysis of data related to user activity within a web portal.",
        //     icon: SystemClockIcon,
        //     url: "aspportal-report",
        //   },
        //   {
        //     label: "Mobile App User Page Report",
        //     description:
        //       "A document that provides insights and analytics about user behavior.",
        //     icon: MobileIcon,
        //     url: "mobile-app-user-report",
        //   },
        //   {
        //     label: "Client Report With Mobile Number",
        //     description:
        //       "Organisation provides services to multiple subsidiary organisations.",
        //     icon: BuildingsIcon,
        //     url: "client-mobile-report",
        //   },
        //   {
        //     label: "Auto Allocated ASP",
        //     description:
        //       "Communication between systems for data exchange and interaction.",
        //     icon: ASPIcon,
        //     url: "auto-allocated-report",
        //   },
        //   {
        //     label: "Mechanic Status Report",
        //     description: "To quickly add or view from a list of vehicles.",
        //     icon: TruckIcon,
        //     url: "mechanic-status-report",
        //   },
        //   {
        //     label: "Attendance Report",
        //     description:
        //       "Organisation provides services to multiple subsidiary organisations.",
        //     icon: BuildingsIcon,
        //     url: "attendence-report",
        //   },
        //   {
        //     label: "ASP Sync Calls",
        //     description:
        //       "Call history of every inbound and outbound calls from agent.",
        //     icon: PhoneIcon,
        //     url: "asp-sync-calls",

        //   },
        //   {
        //     label: "Delivery Request Report",
        //     description:
        //       "Report detailing delivery requests and related information.",
        //     icon: TruckIcon,
        //     url: "delivery-req-report",
        //   },
        // ],
      },
      /*{
      },  */
      {
        label: "Map View",
        icon: MapMenuIcon,
        key: 9,
        code: "map",
        url: "/map",
        requiredPermission: "map-view-web",
        // accessRoleId: [1],
      },
      {
        label: "Masters",
        icon: MastersMenuIcon,
        key: 11,
        code: "master",
        url: "/master",
        // accessRoleId: [1],
        requiredPermission: "master",
        submenus: [
          {
            label: "Vehicle Manufacturer",
            url: "vehicle-manufacturer",
            description:
              "Companies that design, develop, produce, and sell automobiles.",
            icon: VehicleManufacturerIcon,
          },
          {
            label: "Vehicle Type",
            url: "vehicle-type",
            description:
              "The classification of a vehicle based on its intended purpose, design, or features.",
            icon: VehicleManufacturerIcon,
          },
          {
            label: "Vehicle Model",
            url: "vehicle-model",
            description:
              "A specific design of a vehicle produced by a manufacturer, identified by a unique name.",
            icon: VehicleModelIcon,
          },

          /* {
            label: "Whitelist IP",
            url: "whitelist",
            description:
              "Adding an approved IP address to a list of authorized users for a system.",
            icon: WhitelistIcon,
          },*/
          {
            label: "ASP Reject Reason",
            url: "asp-reject-reason",
            description:
              "Justification for why a request has been declined or denied.",
            icon: RejectionReasonIcon,
          },
          /* {
            label: "Services",
            url: "services",
            description:
              "Activities or tasks provided by a business or organization to customers or clients",
            icon: ServiceIcon,
          },*/
          {
            label: "Case Subject",
            url: "case-subject",
            description:
              "A brief description that summarizes the main topic of a case.",
            icon: CaseSubjectIcon,
          },
          /* {
            label: "Sub Services",
            url: "sub-services",
            description:
              "A specific subset or type of service offered within a broader category of services.",
            icon: SubServiceIcon,
          }, */
          /*{
            label: "Service Type",
            url: "service-type",
            description:
              "Classification of a service based on its characteristics. ",
            icon: ServiceTypeIcon,
          },*/
          /* {
            label: "Case Status",
            url: "case-status",
            description:
              "The current stage or condition of a case, often indicated by a specific label.",
            icon: CaseStatusIcon,
          },*/

          {
            label: "SLA Reasons",
            url: "sla-reasons",
            description:
              "To provide the access for the user to configure the SLA Reasons",
            icon: RequestReportIcon,
          },

          {
            label: "Escalation Reason",
            url: "escalation-reason",
            description:
              "To provide the access for the user to configure the Escalation Reason",
            icon: EscalationReasonIcon,
          },
          {
            label: "System Issue Reason",
            icon: SystemIssueIcon,
            url: "system-issue-reason",
            description:
              "To provide the access for the user to configure the System Issue Reason",
          },
          {
            label: "Languages",
            url: "languages",
            description:
              "The specific language or languages used to convey information.",
            icon: LanguageIcon,
          },
          {
            label: "Locations",
            url: "locations",
            description:
              "Specific places, regions, or areas that can be identified.",
            icon: LocationsIcon,
          },
          ,
          /*{
            label: "Entitlements",
            url: "entitlements",
            description:
              "Specific places, regions, or areas that can be identified.",
            icon: EntitlementIcon,
          }*/ /* {
            label: "Asp Rejected Cc Detail Reason Status",
            url: "aspRejectedCcDetailReason",
            description:
              "Specific places, regions, or areas that can be identified.",
            icon: AspRejectCcIcon,
          }, */
          {
            label: "Condition Of Vehicle",
            url: "conditionOfVehicle",
            description:
              "Specific places, regions, or areas that can be identified.",
            icon: VehicleConditionIcon,
          },
          {
            label: "Manual Location Reason",
            url: "manual-location-reason",
            description:
              "To provide the access for the user to configure the Manual Location Reason",
            icon: ManualLocationIcon,
          },
          {
            label: "Case Cancel Reason",
            url: "case-cancel-reason",
            description:
              "To provide the access for the user to configure the Case Cancel Reason",
            icon: CaseCancelIcon,
          },
          {
            label: "Policy Premium",
            url: "policy-premium",
            description:
              "To provide the access for the user to configure the Policy Permium",
            icon: PolicyPremiumIcon,
          },
          {
            label: "Service Description",
            url: "service-description",
            description:
              "To provide the access for the user to configure the Service Description",
            icon: SubServiceIcon,
          },
          {
            label: "Disposition",
            url: "disposition",
            description:
              "To provide the access for the user to configure the Disposition",
            icon: DispositionIcon,
          },
          {
            label: "ASP Activity Cancel Reason",
            url: "asp-activity-cancel-reason",
            description:
              "To provide the access for the user to configure the ASP Activity Cancel Reason",
            icon: ASPCanelIcon,
          },
          {
            label: "Proposed Delay Reason",
            url: "proposed-delay-reason",
            description:
              "To provide the access for the user to configure the Proposed Delay Reason",
            icon: ProposedDelayReasonIcon,
          },
          {
            label: "ROS Success Reasons",
            url: "ros-success-reasons",
            description:
              "To provide the access for the user to configure the ROS Success Reasons",
            icon: RosSuccessIcon,
          },
          {
            label: "ROS Failure Reasons",
            url: "ros-failure-reasons",
            description:
              "To provide the access for the user to configure the ROS Failure Reasons",
            icon: RosFailureIcon,
          },
          {
            label: "Tow Success Reasons",
            url: "tow-success-reasons",
            description:
              "To provide the access for the user to configure the Tow Success Reasons",
            icon: TowSuccessIcon,
          },
          {
            label: "Tow Failure Reasons",
            url: "tow-failure-reasons",
            description:
              "To provide the access for the user to configure the Tow Failure Reasons",
            icon: TowFailureIcon,
          },
          {
            label: "Answer Type",
            url: "answer-type",
            description:
              "Types of answers that can be used in questionnaires and forms.",
            icon: AnswerTypeIcon,
          },
          /*  {
            label: "Customers",
            url: "customers",
            description:
              "Process of identifying and interacting with customers.",
            icon: CustomerIcon,
          },*/
          /* {
            label: "Milestone",
            url: "milestone",
            description: "Milestone in optimizing our operational process.",
            icon: MileStoneIcon,
          },
          {
            label: "Scheme Management",
            url: "scheme-management",
            description:
              "OEMs and dealers form a vital partnership in the product supply chain.",
            icon: SchemeMangement,
          },*/
          /*{
            label: "Inventory",
            url: "inventory",
            description: "The inventory used to scheme information.",
            icon: InventoryIcon,
          },*/
          /*{
            label: "Application Settings",
            url: "applications-settings",
            description:
              "Configurable options that users can modify to customize their experience",
            icon: SettingsIcon,
          }, */
          // {
          //   label: "Elements",
          //   url: "elements",
          //   description: "",
          // },
        ],
      },

      /*{
        label: "Escalations",
        icon: EscalationsMenuIcon,
        key: 12,
        code: "escalations",
        url: "escalation-reason",
      },
      {
        label: "ASP Sync Calls",
        icon: CallsMenuIcon,
        key: 13,
        code: "calls",
        url: "/calls",
      },
      {
        label: "Components",
        icon: CallsMenuIcon,
        key: 14,
        code: "components",
        url: "/components",
      },
      {
        label: "Static",
        icon: MastersMenuIcon,
        key: 15,
        code: "static",
        url: "/static",
      }, */
    ],
  },
];

export const DocumentTitle = {
  "/login": "Login",
  "/delivery-request/new": "Add Delivery Request",
  "/delivery-request": "Delivery Request",
  "/delivery-request/view": "View Delivery Request",
};
