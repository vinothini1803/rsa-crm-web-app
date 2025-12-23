import React, { useEffect, useState } from "react";
import CallInitiateForm from "./CallInitiateForm";
import "./style.less";
import { useQuery, useMutation } from "react-query";
import Filters from "../../components/common/Filters";
import CaseCard from "./CaseCard";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Badge } from "primereact/badge";
// import ReminderDialog from "./ReminderDialog";
import CaseChart from "./CaseChart";
import ServiceChart from "../../components/common/ServiceChart";
import CustomerPreviewCard from "./CustomerPreviewCard";
import ServiceDetailCard from "./ServiceDetailCard";
import TableCard from "./TableCard";
import CallInitiateDialog from "../../components/common/CallInitiateDialog";
import {
  CaseHistoryImage,
  DialogCloseSmallIcon,
  NoResultsImage,
  VechicleImage,
} from "../../utills/imgConstants";
import StatusBadge from "../../components/common/StatusBadge";
import InfoCard from "./InfoCard";
import Note from "../../components/common/Note";
import NoDataComponent from "../../components/common/NoDataComponent";
import { useNavigate, useLocation } from "react-router";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { client } from "../../../services/masterServices";
import { setCaseData } from "../../../store/slices/caseSlice";
import { SearchCaseData } from "../../../store/slices/caseSlice";
import { CurrentUser } from "../../../store/slices/userSlice";
import {
  quickSearch,
  getFullServiceEntitlements,
  getFormDataCallInitiation,
  getFormDataDisposition,
  saveTempCaseFormDetail,
  getOngoingCases,
} from "../../../services/caseService";
import FullEntitlementSidebar from "../../components/common/FullEntitlementSidebar";
import moment from "moment";
import { Button } from "primereact/button";
import { SplitButton } from "primereact/splitbutton";
import { vehiclePatternValidation } from "../../utills/patternValidation";
import { set } from "firebase/database";
import ReminderDialog from "../../components/common/ReminderDialog";

const Home = ({ onClose, hasOpened }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const initialSearchCaseData = useSelector(SearchCaseData);
  // const [visible, setVisible] = useState(false);
  const [fullEntitlementVisible, setFullEntitlementVisible] = useState(false);
  const [fullEntilementData, setFullEntilementData] = useState({});
  const [selectedAccount, setSelectedAccount] = useState();
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchPayload, setSearchPayload] = useState();
  const [callInitiateVisible, setCallInitiateVisible] = useState(false);
  const [entitlementData, setEntitlementData] = useState([]);
  const [activeEntitlementIndex, setActiveEntitlementIndex] = useState(0);
  const vechicleInfo = false;
  const contactInfo = false;
  const user = useSelector(CurrentUser);
  const [quick, setQuick] = useState(false);
  const [filters, setFilters] = useState({ startDate: null, endDate: null });
  const [quickSearchData, setQuickSearchData] = useState([]);

  // const { data,refetch } = useQuery(
  //   ["getOngoingCases", filters],
  //   () =>
  //     getOngoingCases({
  //       startDate: filters.startDate
  //       ? moment(filters.startDate).format("YYYY-MM-DD")
  //       : moment().format("YYYY-MM-DD"),
  //     endDate: filters.endDate
  //       ? moment(filters.endDate).format("YYYY-MM-DD")
  //       : moment().format("YYYY-MM-DD"),
  //     limit: "10",
  //     offset: "0",

  //     }),
  //     {
  //       refetchOnWindowFocus: false,
  //       enabled: false
  //     }

  // );
  // useEffect(()=>{
  //   if(user?.role?.id ==3){
  //     refetch();
  //   }

  // },[filters])
  const Cases = [
    {
      caseName: "Starting Problem",
      caseNo: "F23COROTRPC00283",
      date: "Jan 14 , 11:30 PM",
      description: "Starting Problem from past 4 days",
      statusId: "success",
      status: "Open",
      // caseId: 143,
      // caseNumber: "TST013F240000142",
      // caseType: "Accidental",
      // subject: "Vehicle Transfer2",
      // service: "Towing",
      // registrationNumber: "tn39au8391",
      // policyType: "RSA Retail",
      // channel: "New Vehicle",
      // voiceOfCustomer: "Satisfied",
      // status: "In Progress",
      // createdAt: "Nov 4, 12:11 PM",
    },
    {
      caseName: "Break down",
      caseNo: "F23COROTRPC00284",
      date: "Jan 14 , 11:30 PM",
      description: "Vehicle brakes not functioning",
      statusId: "in-progress",
      status: "In-Progress",
    },
    {
      caseName: "Starting Problem",
      caseNo: "F23COROTRPC00296",
      date: "Jan 14 , 11:30 PM",
      description: "Battery drained",
      statusId: "hold",
      status: "On Hold",
    },
    {
      caseName: "Break down",
      caseNo: "F23COROTRPC00283",
      date: "Jan 14 , 11:30 PM",
      description: "Vehicle brakes not functioning",
      statusId: "in-progress",
      status: "In-Progress",
    },
  ];

  // const Subject = [
  //   { id: 1, label: "NON - RSA" },
  //   { id: 2, label: "RSA" },
  // ];

  /* const Subject = data?.data?.data?.subjects.map((subject) => ({
    id: subject.id,
    label: subject.name,
  }));
  const accountList = data?.data?.data?.clients.map((clients) => ({
    id: clients.id,
    name: clients.name,
  })); */

  const { data: clientOptionsData } = useQuery(
    ["getClientOptions"],
    () =>
      client({
        apiType: "dropdown",
      }),
    {
      refetchOnWindowFocus: false,
    }
  );

  /* const {data: getCallInitiationFormData} = useQuery(["getFormDataCallInitiation"], () => getFormDataCallInitiation(), {
    refetchOnWindowFocus:false
  }); */
  /* const {data: getDipositionOptions} = useQuery(["getFormDataDispositionSearch"], () => getFormDataDisposition({
    apiType: "dropdown",
    typeId: 392,
  }),{
    refetchOnWindowFocus:false
  }); */

  const {
    data: quickSearchDatum,
    mutate: quickSearchMutate,
    isLoading: quickSearchLoading,
  } = useMutation(quickSearch, {
    onSuccess: (response) => {
      //console.log("API Response:", response); // Debug log

      if (response?.data) {
        sessionStorage.setItem(
          "quickSearchDatum",
          JSON.stringify(response.data)
        );
        setQuickSearchData(response.data);
      }
    },
  });

  const { mutate: tempCaseMutate, isLoading: tempCaseMutateLoading } =
    useMutation(saveTempCaseFormDetail);

  const {
    data: entitlementSearchData,
    mutate: entitlementMutate,
    isLoading: entitlementIsLoading,
  } = useMutation(getFullServiceEntitlements);

  const identifyVehicleType = (inputValue) => {
    if (inputValue) {
      const trimmedValue = inputValue.trim().toUpperCase(); // Trim and convert to uppercase

      // Check VIN pattern (17 characters alphanumeric)
      const vinPattern = /^[A-HJ-NPR-Z0-9]{17}$/i;

      // Check VRN pattern (custom format for registration number)
      const vrnPattern =
        /^[A-Z0-9]{2}[A-Z0-9]{0,2}[A-Z0-9]{0,3}[A-Z0-9]{0,4}$/i;

      if (trimmedValue.length === 17 && vinPattern.test(trimmedValue)) {
        console.log("Vehicle VIN");
        return "VIN"; // If matches VIN pattern
      } else if (vehiclePatternValidation(trimmedValue)) {
        console.log("Vehicle Passed");
        return "VRN"; // If matches VRN pattern
      } else {
        console.log("Vehicle Unkown");
        return "Unknown"; // If neither VIN nor VRN
      }
    }
  };
  const handleSearch = (values) => {
    console.log("quick search values", values);
    setQuick(false);
    const vehicleType = identifyVehicleType(values?.vin_vrn);
    if (vehicleType === "VIN") {
      console.log("Entered value is a VIN.");
    } else if (vehicleType === "VRN") {
      console.log("Entered value is a VRN.");
    } else {
      console.log("Entered value does not match VIN or VRN pattern.");
    }
    if (values) {
      const searchPayloads = {
        ...(values?.vin_vrn &&
          vehicleType === "VIN" && {
            vin: values?.vin_vrn,
          }),
        ...(values?.vin_vrn &&
          vehicleType === "VRN" && {
            vehicleRegistrationNo: values?.vin_vrn,
          }),
        ...(values?.mobileNumber && {
          mobileNumber: values?.mobileNumber,
        }),
        ...(values?.policyNumber && {
          policyNumber: values?.policyNumber,
        }),
        ...(values?.caseNumber && {
          caseNumber: values?.caseNumber,
        }),
        ...(values?.isSearchFromCallInitiation && {
          isSearchFromCallInitiation: values?.isSearchFromCallInitiation,
        }),
        ...(values?.caseRemarks && {
          callInitiationRemarks: values?.caseRemarks,
        }),
        client: values?.selectAccount?.name,
        clientId: values?.selectAccount?.id,
      };
      //console.log("Search Payload ", searchPayloads);
      //setSearchPayload(searchPayloads);
      if (!hasOpened) {
        quickSearchMutate(searchPayloads, {
          onSuccess: (response) => {
            console.log("Quick Search Response =>", response?.data?.data);
            setSearchPayload(searchPayloads);
            dispatch(setCaseData({ searchCaseData: null }));
            if (response?.data?.success) {
              if (response?.data?.searchResults) {
                if (response?.data?.data?.customerEntitlement?.length > 0) {
                  entitlementMutate(
                    {
                      clientId:
                        response?.data?.data?.customerEntitlement[0]?.clientId,
                      vin: response?.data?.data?.customerEntitlement[0]?.vin,
                      vehicleRegistrationNumber:
                        response?.data?.data?.customerEntitlement[0]?.vehicleRegistrationNumber
                          ?.toString()
                          ?.toLowerCase() !== "null"
                          ? response?.data?.data?.customerEntitlement[0]
                              ?.vehicleRegistrationNumber
                          : null,
                      policyTypeId:
                        response?.data?.data?.customerEntitlement[0]?.policyTypeId
                          ?.toString()
                          ?.toLowerCase() !== "null"
                          ? response?.data?.data?.customerEntitlement[0]
                              ?.policyTypeId
                          : 434,
                      policyNumber:
                        response?.data?.data?.customerEntitlement[0]?.policyNumber
                          ?.toString()
                          ?.toLowerCase() !== "null"
                          ? response?.data?.data?.customerEntitlement[0]
                              ?.policyNumber
                          : null, //nullable
                      membershipTypeId:
                        response?.data?.data?.customerEntitlement[0]?.membershipTypeId
                          ?.toString()
                          ?.toLowerCase() !== "null"
                          ? response?.data?.data?.customerEntitlement[0]
                              ?.membershipTypeId
                          : null, // policyTypeId rsa means required.
                      policyStartDate:
                        response?.data?.data?.customerEntitlement[0]
                          ?.policyStartDate || null,
                      policyEndDate:
                        response?.data?.data?.customerEntitlement[0]
                          ?.policyEndDate || null,
                      typeId: 0,
                    },
                    {
                      onSuccess: (res) => {
                        if (res?.data?.success) {
                          console.log("EntitlementData++", res?.data?.data);
                          setEntitlementData({
                            policyData: {
                              policyNumber:
                                response?.data?.data?.customerEntitlement[0]?.policyNumber
                                  ?.toString()
                                  ?.toLowerCase() !== "null"
                                  ? response?.data?.data?.customerEntitlement[0]
                                      ?.policyNumber
                                  : null,
                              policyStartDate: res?.data?.data[0]
                                ?.policyStartDate
                                ? moment(
                                    res?.data?.data[0]?.policyStartDate
                                  ).format("DD/MM/YYYY")
                                : null,
                              policyEndDate: res?.data?.data[0]?.policyEndDate
                                ? moment(
                                    res?.data?.data[0]?.policyEndDate
                                  ).format("DD/MM/YYYY")
                                : null,
                            },
                            quickSearch: true,
                            customerServiceEntitlements: res?.data?.data,
                          });
                          setFullEntilementData({
                            clientId:
                              response?.data?.data?.customerEntitlement[0]
                                ?.clientId,
                            clientName: searchPayloads?.client,
                            vin: response?.data?.data?.customerEntitlement[0]
                              ?.vin,
                            vehicleRegistrationNumber:
                              response?.data?.data?.customerEntitlement[0]?.vehicleRegistrationNumber
                                ?.toString()
                                ?.toLowerCase() !== "null"
                                ? response?.data?.data?.customerEntitlement[0]
                                    ?.vehicleRegistrationNumber
                                : null,
                            policyTypeId:
                              response?.data?.data?.customerEntitlement[0]?.policyTypeId
                                ?.toString()
                                ?.toLowerCase() !== "null"
                                ? response?.data?.data?.customerEntitlement[0]
                                    ?.policyTypeId
                                : 434,

                            extras: {
                              policyDetails: {
                                policyTypeId:
                                  response?.data?.data?.customerEntitlement[0]?.policyTypeId
                                    ?.toString()
                                    ?.toLowerCase() !== "null"
                                    ? response?.data?.data
                                        ?.customerEntitlement[0]?.policyTypeId
                                    : 434,
                                policy_number:
                                  response?.data?.data?.customerEntitlement[0]?.policyNumber
                                    ?.toString()
                                    ?.toLowerCase() !== "null"
                                    ? response?.data?.data
                                        ?.customerEntitlement[0]?.policyNumber
                                    : null, //nullable
                                membership_type_id:
                                  response?.data?.data?.customerEntitlement[0]?.membershipTypeId
                                    ?.toString()
                                    ?.toLowerCase() !== "null"
                                    ? response?.data?.data
                                        ?.customerEntitlement[0]
                                        ?.membershipTypeId
                                    : null, // policyTypeId rsa means required.
                                start_date: res?.data?.data[0]?.policyStartDate
                                  ? res?.data?.data[0]?.policyStartDate
                                  : null,
                                end_date: res?.data?.data[0]?.policyEndDate
                                  ? res?.data?.data[0]?.policyEndDate
                                  : null,
                              },
                            },
                          });
                        }
                      },
                    }
                  );
                }
                setSearchResults(response?.data);
              } else {
                setSearchResults({
                  ...response?.data,
                  data: null,
                });
              }
              setShowSearchResults(true);
            } else {
              // setQuickSearchData([]);
              if (response?.data?.error) {
                toast.error(response?.data?.error);
              } else {
                response?.data?.errors?.forEach((el) => toast.error(el));
              }
            }
          },
        });
      }
      setSearchPayload(searchPayloads);
    }
  };
  useEffect(() => {
    const storedResults = sessionStorage.getItem("searchResults");
    const storedQuickSearchDatum = sessionStorage.getItem("quickSearchDatum");
    //console.log("storedQuickSearchDatum", storedQuickSearchDatum)
    setShowSearchResults(true);
    if (storedResults) {
      setSearchResults(JSON.parse(storedResults));
    }
    if (storedQuickSearchDatum && storedQuickSearchDatum !== "null") {
      //  Prevent null issues
      setQuickSearchData(JSON.parse(storedQuickSearchDatum));
    } else {
      setQuickSearchData([]); //  Fallback if no data is found
    }
  }, []);

  useEffect(() => {
    setShowSearchResults(true);
    if (searchResults) {
      sessionStorage.setItem("searchResults", JSON.stringify(searchResults));
    }
    if (quickSearchData) {
      sessionStorage.setItem(
        "quickSearchData",
        JSON.stringify(quickSearchData)
      ); //  Save quickSearchData
    }
  }, [searchResults, quickSearchData]);
  //console.log("searchResults", searchResults, quickSearchData, quickSearchDatum)
  const ContactInfo = [
    {
      label: "Vehicle No",
      value: "TN22CS4432",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "VIN No",
      value: "M85426AB83270318D",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "Contact Name",
      value: "Baskaran D",
    },
    {
      label: "Contact Number",
      value: "9876543211",
    },
    {
      label: "Account Name",
      value: "Royal Sundaram Diversion",
    },
    {
      label: "Policy No",
      value: "29864234",
    },
    {
      label: "Service Eligibility",
      value: "--",
    },
    {
      label: "RSA Policy Type",
      value: "--",
    },
    {
      label: "Policy End Date",
      value: "02/03/2022",
      vlaueClassName: "info-badge info-badge-purple",
    },
  ];
  const VehicleInfo = [
    {
      label: "Vehicle No",
      value: "TN22CS4432",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "VIN No",
      value: "M85426AB83270318D",
      vlaueClassName: "info-badge info-badge-yellow",
    },
    {
      label: "Contact Name",
      value: "Baskaran D",
    },
    {
      label: "Account Name",
      value: "Royal Sundaram Diversion",
    },
    {
      label: "Registration Date",
      value: "02/03/2022",
      vlaueClassName: "info-badge info-badge-purple",
    },
    {
      label: "Vehicle class",
      value: "M-Cycle/Scooter",
    },
    {
      label: "Model Type",
      value: "Pleasure",
    },
    {
      label: "Colour",
      value: "Red",
    },
    {
      label: "Fuel Type",
      value: "Petrol",
      vlaueClassName: "info-badge info-badge-green",
    },
    {
      label: "Policy No",
      value: "29864234",
    },
    {
      label: "Insurance Company",
      value: "Royal Sundaram Diversion",
    },
    {
      label: "Insurance Status",
      value: "Active",
      vlaueClassName: "info-badge info-badge-green",
      itemClassName: "separator-none ",
    },
  ];

  // Non-Membership Case Creation
  const handleCreateCase = () => {
    console.log("Non-membership Create Case");

    /* dispatch(setCaseData({
      createCase: {
        existCustomer: false,
        createdById: user?.id,
        clientId: getCallInitiationFormData?.data?.data?.clients?.find(item => item?.id == searchPayload?.clientId) ,
        subjectId: [392],
        dispositionId: getDipositionOptions?.data?.data?.find(item => item?.id == 3),
        callFromId: getCallInitiationFormData?.data?.data?.callFrom?.find(item => item?.id == 375),
        ...((searchPayload?.vehicleRegistrationNo) && {
          vehicleRegistrationNumber: searchPayload?.vehicleRegistrationNo || null,
        }),
        ...((searchPayload?.vin) && {
          vin: searchPayload?.vin || null,
        }),
        ...((searchPayload?.mobileNumber) && {
          mobileNumber: searchPayload.mobileNumber,
        })
      }
    })); */
    tempCaseMutate(
      {
        existCustomer: false,
        createdById: user?.id,
        clientId: searchPayload?.clientId,
        subjectId: 392,
        dispositionId: 3,
        callFromId: 375,
        channelId: null,
        contactLanguageId: null,
        currentContactLanguageId: null,
        policyNumber:
          searchPayload?.policyNumber ||
          (quickSearchData?.success &&
            quickSearchData?.data?.customerEntitlement?.[0]?.policyNumber) ||
          null,
        ...(searchPayload?.vehicleRegistrationNo && {
          vehicleRegistrationNumber:
            searchPayload?.vehicleRegistrationNo || null,
        }),
        ...(searchPayload?.vin && {
          vin: searchPayload?.vin || null,
        }),
        ...(searchPayload?.mobileNumber && {
          mobileNumber: searchPayload.mobileNumber,
        }),

        ...(quickSearchData?.callInitiationId && {
          callInitiationId: quickSearchData?.callInitiationId,
        }),
      },
      {
        onSuccess: (res) => {
          console.log("Save Temp Case for Non-membership => ", res);
          if (res?.data?.success) {
            navigate(`/case-creation/${res?.data?.data?.id}`);
            onClose();
          }
        },
      }
    );
  };
  console.log("quickSearchData", quickSearchData, searchPayload);
  // Membership Case Creation
  const handleVehicleCreateCase = (record) => {
    console.log("Vehicle Create Case Record => ", record);
    /* dispatch(setCaseData({createCase: {
      existCustomer: true,
      clientId: getCallInitiationFormData?.data?.data?.clients?.find(item => item?.id == searchPayload?.clientId) ,
      subjectId: [392],
      dispositionId: getDipositionOptions?.data?.data?.find(item => item?.id == 3),
      callFromId: getCallInitiationFormData?.data?.data?.callFrom?.find(item => item?.id == 375),
      vehicleRegistrationNumber: (record && record?._source?.vehicleRegistrationNumber?.toString()?.toLowerCase() !== 'null') ? record?._source?.vehicleRegistrationNumber : null,
      vin: (record && record?._source?.vin?.toString()?.toLowerCase() !== 'null') ? record?._source?.vin : null,
      contactName: quickSearchData?.data?.data?.customer?.length > 0 ? quickSearchData?.data?.data?.customer[0]?._source?.name || null : null,
      mobileNumber: quickSearchData?.data?.data?.customer?.length > 0 ? quickSearchData?.data?.data?.customer[0]?._source?.mobileNumber || null : null,
      createdById: user?.id,
    }})); */
    tempCaseMutate(
      {
        existCustomer: true,
        createdById: user?.id,
        clientId: searchPayload?.clientId,
        subjectId: 392,
        dispositionId: 3,
        callFromId: 375,
        vehicleRegistrationNumber:
          record &&
          record?._source?.vehicleRegistrationNumber
            ?.toString()
            ?.toLowerCase() !== "null"
            ? record?._source?.vehicleRegistrationNumber
            : null,
        vin:
          record && record?._source?.vin?.toString()?.toLowerCase() !== "null"
            ? record?._source?.vin
            : null,
        contactName:
          quickSearchData?.data?.customer?.length > 0
            ? quickSearchData?.data?.customer[0]?._source?.policies?.name ||
              null
            : null,
        mobileNumber:
          quickSearchData?.data?.customer?.length > 0
            ? quickSearchData?.data?.customer[0]?._source?.mobileNumber !== "NA"
              ? quickSearchData?.data?.customer[0]?._source?.mobileNumber.toString() ||
                null
              : null
            : null,
        channelId: null,
        contactLanguageId: null,
        currentContactLanguageId: null,
        ...(((quickSearchData?.success &&
          quickSearchData?.data?.customerEntitlement?.[0]?.policyNumber) ||
          searchPayload?.policyNumber) && {
          policyNumber:
            searchPayload?.policyNumber ||
            quickSearchData?.data?.customerEntitlement[0]?.policyNumber,
        }),
        ...(quickSearchData?.callInitiationId && {
          callInitiationId: quickSearchData?.callInitiationId,
        }),
      },
      {
        onSuccess: (res) => {
          console.log("Save Temp Case for Non-membership => ", res);
          if (res?.data?.success) {
            navigate(`/case-creation/${res?.data?.data?.id}`);
            onClose();
          } else {
            if (res?.data?.error) {
              toast.error(res?.data?.error);
            } else {
              res?.data?.errors?.forEach((el) => toast.error(el));
            }
          }
        },
      }
    );
  };

  const handleVehicleCaseView = (record) => {
    navigate(`/cases/view/${record?._source?.caseId}`);
  };

  useEffect(() => {
    console.log("initialSearchCaseData", initialSearchCaseData);
    if (initialSearchCaseData) {
      // handleSearch({...initialSearchCaseData, isSearchFromCallInitiation: true})
      handleSearch(initialSearchCaseData);
      setQuick(true);
    }
  }, [initialSearchCaseData, quick]);

  const VechicleTableColumns = [
    {
      title: "Account",
      field: "_source",
      body: (record, field) => {
        // console.log('Case ID => ', record)
        return (
          <>
            {record?._source?.clientPolicies?.client
              ? record?._source?.clientPolicies?.client
              : "--"}
          </>
        );
      },
    },
    {
      title: "Vehicle Number",
      field: "_source",
      body: (record, field) => {
        // console.log('Case ID => ', record)
        return <>{record?._source?.vehicleRegistrationNumber || "--"}</>;
      },
    },

    {
      title: "VIN Number",
      field: "_source",
      body: (record, field) => {
        // console.log('Case ID => ', record)
        return <>{record?._source?.vin || "--"}</>;
      },
    },
    /* { 
      title: "Run KM", 
      field: "_source",
      body: (record, field) => {
        // console.log('Case ID => ', record)
        return (
        <>
          {record?._source?.runningKm || '--'}
        </>
      )},
    }, */
    {
      title: "Policy Type",
      field: "_source",
      body: (record, field) => {
        // console.log('Case ID => ', record)
        return <>{record?.policyType || "--"}</>;
      },
    },
    {
      title: "Policy Number",
      field: "_source",
      body: (record, field) => {
        // console.log('Case ID => ', record)
        return (
          <>
            {record?.policyNumber?.toString()?.toLowerCase() !== "null"
              ? record?.policyNumber
              : "--"}
          </>
        );
      },
    },
    {
      title: "Policy Start Date",
      field: "_source",
      body: (record, field) => {
        // console.log('Case ID => ', record)
        return (
          <>
            {record?.policyStartDate
              ? moment(record?.policyStartDate).format("DD-MM-YYYY")
              : "--"}
          </>
        );
      },
    },
    {
      title: "Policy End Date",
      field: "_source",
      body: (record, field) => {
        // console.log('Case ID => ', record)
        return (
          <>
            {record?.policyEndDate
              ? moment(record?.policyEndDate).format("DD-MM-YYYY")
              : "--"}
          </>
        );
      },
    },
    ...(searchPayload?.caseNumber
      ? []
      : [
          {
            title: "Action",
            field: "action",
            body: (record, field) => (
              <>
                {" "}
                {!quick && (
                  <Button
                    type="button"
                    className="btn-link"
                    onClick={() => handleVehicleCreateCase(record)}
                    disabled={user?.levelId == 1046}
                  >
                    Create Case
                  </Button>
                )}
              </>
            ),
          },
        ]),
  ];
  const CaseHistoryColumns = [
    {
      title: "Case ID",
      field: "_source",
      body: (record, field) => (
        <>
          {/* <div className="table-col-blue-text">{record?._source?.caseNumber}</div> */}
          <Button
            type="button"
            className="btn-link"
            onClick={() => handleVehicleCaseView(record)}
          >
            {record?._source?.caseNumber}
          </Button>
        </>
      ),
    },
    {
      title: "Vehicle Number",
      field: "_source",
      body: (record, field) => {
        // console.log('Case ID => ', record)
        return <>{record?._source?.vehicleNumber || "--"}</>;
      },
    },
    {
      title: "VIN Number",
      field: "_source",
      body: (record, field) => {
        // console.log('Case ID => ', record)
        return <>{record?._source?.vin || "--"}</>;
      },
    },
    {
      title: "Subject",
      field: "_source",
      body: (record, field) => {
        // console.log('Case ID => ', record)
        return <>{record?._source?.subject || "--"}</>;
      },
    },
    {
      title: "Current Contact Name",
      field: "_source",
      body: (record, field) => {
        // console.log('Case ID => ', record)
        return <>{record?._source?.customerContactName || "--"}</>;
      },
    },
    {
      title: "Current Mobile Number",
      field: "_source",
      body: (record, field) => {
        // console.log('Case ID => ', record)
        return <>{record?._source?.customerMobileNumber || "--"}</>;
      },
    },
    {
      title: "Status",
      field: "_source",
      body: (record, field) => (
        <StatusBadge
          text={record?._source?.status}
          statusType="activityStatus"
          statusId={record?._source?.statusId || 1}
        />
      ),
    },
    /* { 
      title: "Account", 
      field: "account",
      body: (record, field) => {
        // console.log('Case ID => ', record)
        return (
        <>
          {record?._source?.account || '--'}
        </>
      )},
    }, */
    {
      title: "Location",
      field: "_source",
      body: (record, field) => {
        // console.log('Case ID => ', record)
        return (
          <div
            style={{
              maxWidth: "300px",
              whiteSpace: "break-spaces",
              minWidth: "300px",
            }}
          >
            {record?._source?.breakdownLocation || "--"}
          </div>
        );
      },
    },
    /* {
      title: "Action",
      field: "action",
      body: (record, field) => (
        <Button type="button" className="btn-link" onClick={()=>handleVehicleCaseView(record)}>View Case</Button>
      ),
    }, */
  ];
  const PoliciesTableColumns = [
    {
      title: "Policy Type",
      field: "_source",
      body: (record, field) => {
        // console.log('Case ID => ', record)
        return <>{record?._source?.policyType}</>;
      },
    },
    {
      title: "Policy Number",
      field: "_source",
      body: (record, field) => {
        // console.log('Case ID => ', record)
        return (
          <>
            {record?._source?.policyNumber?.toString()?.toLowerCase() !== "null"
              ? record?._source?.policyNumber
              : "--"}
          </>
        );
      },
    },
    {
      title: "Policy Start Date",
      field: "_source",
      body: (record, field) => {
        // console.log('Case ID => ', record)
        return (
          <>
            {record?._source?.startDate
              ? moment(record?._source?.startDate).format("DD-MM-YYYY")
              : "--"}
          </>
        );
      },
    },
    {
      title: "Policy End Date",
      field: "_source",
      body: (record, field) => {
        // console.log('Case ID => ', record)
        return (
          <>
            {record?._source?.endDate
              ? moment(record?._source?.endDate).format("DD-MM-YYYY")
              : "--"}
          </>
        );
      },
    },
    {
      title: "Status",
      field: "_source",
      body: (record, field) => (
        <StatusBadge
          text={record?._source?.status}
          statusType="levelstatus"
          statusId={
            record?._source?.status == "Active"
              ? 1
              : record?._source?.status == "Expired"
              ? 4
              : 3
          }
        />
      ),
    },
  ];

  useEffect(() => {
    if (
      quickSearchData?.success &&
      quickSearchData?.data?.customerEntitlement?.length > 0
    ) {
      entitlementMutate(
        {
          clientId:
            quickSearchData?.data?.customerEntitlement[activeEntitlementIndex]
              ?.clientId,
          vin: quickSearchData?.data?.customerEntitlement[
            activeEntitlementIndex
          ]?.vin,
          vehicleRegistrationNumber:
            quickSearchData?.data?.customerEntitlement[
              activeEntitlementIndex
            ]?.vehicleRegistrationNumber
              ?.toString()
              ?.toLowerCase() !== "null"
              ? quickSearchData?.data?.customerEntitlement[
                  activeEntitlementIndex
                ]?.vehicleRegistrationNumber
              : null,
          policyTypeId:
            quickSearchData?.data?.customerEntitlement[
              activeEntitlementIndex
            ]?.policyTypeId
              ?.toString()
              ?.toLowerCase() !== "null"
              ? quickSearchData?.data?.customerEntitlement[
                  activeEntitlementIndex
                ]?.policyTypeId
              : 434,
          policyNumber:
            quickSearchData?.data?.customerEntitlement[
              activeEntitlementIndex
            ]?.policyNumber
              ?.toString()
              ?.toLowerCase() !== "null"
              ? quickSearchData?.data?.customerEntitlement[
                  activeEntitlementIndex
                ]?.policyNumber
              : null, //nullable
          membershipTypeId:
            quickSearchData?.data?.customerEntitlement[
              activeEntitlementIndex
            ]?.membershipTypeId
              ?.toString()
              ?.toLowerCase() !== "null"
              ? quickSearchData?.data?.customerEntitlement[
                  activeEntitlementIndex
                ]?.membershipTypeId
              : null, // policyTypeId rsa means required.
          policyStartDate:
            quickSearchData?.data?.customerEntitlement[activeEntitlementIndex]
              ?.policyStartDate || null,
          policyEndDate:
            quickSearchData?.data?.customerEntitlement[activeEntitlementIndex]
              ?.policyEndDate || null,
          typeId: 0,
        },
        {
          onSuccess: (res) => {
            if (res?.data?.success) {
              setEntitlementData({
                policyData: {
                  policyNumber:
                    quickSearchData?.data?.customerEntitlement[
                      activeEntitlementIndex
                    ]?.policyNumber
                      ?.toString()
                      ?.toLowerCase() !== "null"
                      ? quickSearchData?.data?.customerEntitlement[
                          activeEntitlementIndex
                        ]?.policyNumber
                      : null,
                  policyStartDate: res?.data?.data[activeEntitlementIndex]
                    ?.policyStartDate
                    ? moment(
                        res?.data?.data[activeEntitlementIndex]?.policyStartDate
                      ).format("DD/MM/YYYY")
                    : null,
                  policyEndDate: res?.data?.data[activeEntitlementIndex]
                    ?.policyEndDate
                    ? moment(
                        res?.data?.data[activeEntitlementIndex]?.policyEndDate
                      ).format("DD/MM/YYYY")
                    : null,
                },
                quickSearch: true,
                customerServiceEntitlements: res?.data?.data,
              });
              setFullEntilementData({
                clientId:
                  quickSearchData?.data?.customerEntitlement[
                    activeEntitlementIndex
                  ]?.clientId,
                clientName: searchPayload?.client,
                vin: quickSearchData?.data?.customerEntitlement[
                  activeEntitlementIndex
                ]?.vin,
                vehicleRegistrationNumber:
                  quickSearchData?.data?.customerEntitlement[
                    activeEntitlementIndex
                  ]?.vehicleRegistrationNumber
                    ?.toString()
                    ?.toLowerCase() !== "null"
                    ? quickSearchData?.data?.customerEntitlement[
                        activeEntitlementIndex
                      ]?.vehicleRegistrationNumber
                    : null,
                policyTypeId:
                  quickSearchData?.data?.customerEntitlement[
                    activeEntitlementIndex
                  ]?.policyTypeId
                    ?.toString()
                    ?.toLowerCase() !== "null"
                    ? quickSearchData?.data?.customerEntitlement[
                        activeEntitlementIndex
                      ]?.policyTypeId
                    : 434,
                policyStartDate:
                  quickSearchData?.data?.customerEntitlement[
                    activeEntitlementIndex
                  ]?.policyStartDate || null,
                policyEndDate:
                  quickSearchData?.data?.customerEntitlement[
                    activeEntitlementIndex
                  ]?.policyEndDate || null,
                extras: {
                  policyDetails: {
                    policyTypeId:
                      quickSearchData?.data?.customerEntitlement[
                        activeEntitlementIndex
                      ]?.policyTypeId
                        ?.toString()
                        ?.toLowerCase() !== "null"
                        ? quickSearchData?.data?.customerEntitlement[
                            activeEntitlementIndex
                          ]?.policyTypeId
                        : 434,
                    policy_number:
                      quickSearchData?.data?.customerEntitlement[
                        activeEntitlementIndex
                      ]?.policyNumber
                        ?.toString()
                        ?.toLowerCase() !== "null"
                        ? quickSearchData?.data?.customerEntitlement[
                            activeEntitlementIndex
                          ]?.policyNumber
                        : null, //nullable
                    membership_type_id:
                      quickSearchData?.data?.customerEntitlement[
                        activeEntitlementIndex
                      ]?.membershipTypeId
                        ?.toString()
                        ?.toLowerCase() !== "null"
                        ? quickSearchData?.data?.customerEntitlement[
                            activeEntitlementIndex
                          ]?.membershipTypeId
                        : null, // policyTypeId rsa means required.
                    start_date: res?.data?.data[activeEntitlementIndex]
                      ?.policyStartDate
                      ? res?.data?.data[activeEntitlementIndex]?.policyStartDate
                      : null,
                    end_date: res?.data?.data[activeEntitlementIndex]
                      ?.policyEndDate
                      ? res?.data?.data[activeEntitlementIndex]?.policyEndDate
                      : null,
                  },
                },
              });
            }
          },
        }
      );
    }
  }, [activeEntitlementIndex]);

  //console.log("Home CallInitiate => ", callInitiateVisible);
  // Handle filter application
  const handleFilterApply = (appliedFilters) => {
    //console.log("appliedFilters",appliedFilters)
    if (appliedFilters.date) {
      setFilters({
        startDate: appliedFilters.date.value[0],
        endDate: appliedFilters.date.value[1],
      });
    } else {
      setFilters({ startDate: null, endDate: null });
    }
  };
  return (
    <div className="page-wrap">
      <div className="page-body d-flex flex-column">
        {/*admin,TL,SME,NH,call center manager,tvs spoc,network head,customer experience head,command center head,call center head , service head,bo head */}
        {[7, 1, 14, 15, 16, 21, 22, 23, 24, 25, 26, 27].includes(
          user?.role?.id
        ) ? null : (
          <CallInitiateForm
            onSearch={handleSearch}
            submitLoading={quickSearchLoading}
            clientOptions={clientOptionsData?.data?.data}
            selectedAccount={selectedAccount}
            onSelectedAccount={setSelectedAccount}
            initialSearchCaseData={initialSearchCaseData}
            showSearchResults={showSearchResults}
            setShowSearchResults={setShowSearchResults}
            hasOpened={hasOpened}
          />
        )}
        {/* Case Dtails Container */}
        {!showSearchResults && (
          <div className="row row-gap-3_4 mt-3_4 h-100">
            <div className="col-md-8 col-sm-12">
              <div className="custom-card h-100 padding">
                <div className="custom-card-header d-flex align-items-center gap">
                  <div>
                    My Ongoing Cases <Badge value="12"></Badge>
                  </div>

                  <Filters
                    className="ms-auto"
                    // onFilterApply={handleFilterApply}
                    filterFields={{
                      filterFields: ["date"],
                      filterData: [],
                    }}
                    // filters={filters}
                    filters={{}}
                  />

                  {/* <button
                    className="btn btn-primary"
                    onClick={()=>{setCallInitiateVisible(true)}}
                  >
                    Call Initiation
                  </button> */}
                </div>
                <div className="custom-card-body case-list mt-2_3">
                  {Cases?.map((item, i) => (
                    <CaseCard
                      caseTitle={item.caseName}
                      caseNo={item.caseNo}
                      date={item.date}
                      description={item.description}
                      statusId={item.statusId}
                      status={item.status}
                      key={i}
                      // caseData={data}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-12 chart-col">
              <CaseChart />
              <ServiceChart />
            </div>
          </div>
        )}
        {/* Case Dtails Container */}

        {/* Search Results */}
        {showSearchResults && (
          <div
            className={`custom-card padding mt-3_4 h-100 ${
              searchResults?.success ? "" : "no-results"
            }`}
          >
            <div className="custom-card-header d-flex align-items-center justify-content-between gap">
              <div>
                Showing results for{" "}
                <span className="search-item">
                  {searchPayload?.vin?.toString()?.toUpperCase() ||
                    searchPayload?.vehicleRegistrationNo
                      ?.toString()
                      ?.toUpperCase() ||
                    searchPayload?.mobileNumber?.toString()?.toUpperCase() ||
                    searchPayload?.policyNumber?.toString()?.toUpperCase() ||
                    searchPayload?.caseNumber?.toString()?.toUpperCase()}
                </span>
              </div>

              {searchPayload?.caseNumber &&
              searchResults?.data?.cases?.length > 0 ? (
                <button
                  type="button"
                  className="btn btn-primary ms-auto"
                  onClick={() =>
                    handleVehicleCaseView(searchResults?.data?.cases[0])
                  }
                >
                  View Case
                </button>
              ) : (
                <>
                  {searchResults?.data && searchResults?.success && (
                    <>
                      {searchResults?.data?.vehicles?.length > 0 ? (
                        <>
                          {searchResults?.data?.vehicles?.length > 1 ? (
                            <>
                              {!quick && (
                                <SplitButton
                                  className="custom-dropdown-btn"
                                  disabled={user?.levelId == 1046}
                                  dropdownIcon={
                                    <div className="d-flex align-items-center gap-2">
                                      <span>Create Case</span>
                                      <span className="pi pi-chevron-down"></span>
                                    </div>
                                  }
                                  model={searchResults?.data?.vehicles?.map(
                                    (item) => {
                                      return {
                                        label:
                                          item?._source
                                            ?.vehicleRegistrationNumber ||
                                          item?._source?.vin,
                                        command: () =>
                                          handleVehicleCreateCase(item),
                                      };
                                    }
                                  )}
                                />
                              )}
                            </>
                          ) : (
                            <>
                              {!quick && (
                                <Button
                                  type="button"
                                  className="btn btn-primary ms-auto"
                                  onClick={() =>
                                    handleVehicleCreateCase(
                                      searchResults?.data?.vehicles[0]
                                    )
                                  }
                                  disabled={user?.levelId == 1046}
                                >
                                  Create Case
                                </Button>
                              )}
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          {!quick && (
                            <button
                              type="button"
                              className="btn btn-primary ms-auto"
                              onClick={() => handleCreateCase()}
                              disabled={user?.levelId == 1046}
                            >
                              Create Case
                            </button>
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
            {searchResults?.data && searchResults?.success ? (
              <>
                <div className="row row-gap-3_4 mt-3_4 d-flex">
                  <>
                    {searchResults?.data?.customer?.length > 0 ? (
                      <div className="col-md-4">
                        <CustomerPreviewCard
                          customerData={{
                            ...searchResults?.data?.customer[0],
                            client: searchPayload?.client,
                          }}
                        />
                      </div>
                    ) : (
                      <div className="col-md-4">
                        <CustomerPreviewCard
                          customerData={{
                            ...searchResults?.data?.customer[0],
                            client: searchPayload?.client,
                          }}
                        />
                      </div>
                    )}

                    {searchResults?.data?.customerEntitlement?.length > 0 ? (
                      <div className="col-md-8">
                        <ServiceDetailCard
                          tabMenu={
                            searchResults?.data?.customerEntitlement?.length > 1
                              ? true
                              : false
                          }
                          tabMenuItems={
                            quickSearchData?.data?.data?.customerEntitlement
                          }
                          companyName={
                            searchResults?.data?.customerEntitlement?.length > 1
                              ? false
                              : true
                          }
                          client={{ name: searchPayload?.client }}
                          entitlementData={entitlementData}
                          setFullEntitlementVisible={setFullEntitlementVisible}
                          setActiveEntitlementIndex={setActiveEntitlementIndex}
                        />
                      </div>
                    ) : (
                      <div className="col-md-8">
                        <ServiceDetailCard
                          companyName={true}
                          client={{ name: searchPayload?.client }}
                          entitlementData={{
                            quickSearch: true,
                          }}
                        />
                      </div>
                    )}
                    {searchResults?.data?.vehicles && (
                      <div className="col-md-12">
                        <TableCard
                          icon={VechicleImage}
                          title={"Vehicles"}
                          columns={VechicleTableColumns}
                          data={searchResults?.data?.vehicles}
                        />
                      </div>
                    )}
                    {searchResults?.data?.policies && (
                      <div className="col-md-12">
                        <TableCard
                          icon={VechicleImage}
                          title={"Policies"}
                          columns={PoliciesTableColumns}
                          data={searchResults?.data?.policies}
                        />
                      </div>
                    )}
                    {searchResults?.data?.cases && (
                      <div className="col-md-12">
                        <TableCard
                          icon={CaseHistoryImage}
                          title={"Case History"}
                          columns={CaseHistoryColumns}
                          data={searchResults?.data?.cases}
                        />
                      </div>
                    )}
                    {/* Contact Info */}
                    {contactInfo && (
                      <div className="col-md-12">
                        <InfoCard title={"CONTACT INFO"} items={ContactInfo} />
                      </div>
                    )}
                    {/* Contact Info */}
                    {/* Vechicle Info */}
                    {vechicleInfo && (
                      <div className="col-md-12">
                        <InfoCard title={"VEHICLE INFO"} items={VehicleInfo} />
                      </div>
                    )}
                    {/* Vechicle Info */}
                    {/* Note */}
                    {(vechicleInfo || contactInfo) && (
                      <div className="col-md-4">
                        <Note type={"info"} icon={true} purpose={"note"}>
                          <div>
                            Contact and vehicle details will be added to
                            database after creating a case.
                          </div>
                        </Note>
                      </div>
                    )}
                    {/* Note */}
                  </>
                </div>
              </>
            ) : (
              <NoDataComponent
                image={NoResultsImage}
                text={"No results found"}
                btntext={quick ? undefined : "Create Case"}
                addbtn={
                  searchPayload?.caseNumber || user?.levelId == 1046
                    ? false
                    : true
                }
                onClick={handleCreateCase}
              />
            )}
          </div>
        )}
        {/* Search Results */}
      </div>
      {/* <ReminderDialog visible={visible} setVisible={setVisible} /> */}
      {callInitiateVisible && (
        <CallInitiateDialog
          callinitiateVisible={callInitiateVisible}
          setCallInitiateVisible={setCallInitiateVisible}
        />
      )}
      <FullEntitlementSidebar
        visible={fullEntitlementVisible}
        setVisible={setFullEntitlementVisible}
        caseData={fullEntilementData}
      />
    </div>
  );
};

export default Home;
