import React, { useRef, useState, useEffect } from "react";
import { useQuery, useQueries } from "react-query";
import SubServiceStatusCard from "./SubServiceStatusCard";
import SubServiceDetailsCard from "./SubServiceDetailsCard";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { subServiceGrid } from "../../../../services/caseService";
import moment from "moment";
import StatusBadge from "../../../components/common/StatusBadge";
import Avatar from "../../../components/common/Avatar";
import { Menu } from "primereact/menu";
import { Link } from "react-router-dom";
import {
  MoreIcon,
  RescheduleIcon,
  UserGreyIcon,
  phoneGreyIcon,
} from "../../../utills/imgConstants";
import { CurrentUser } from "../../../../store/slices/userSlice";
import { useSelector } from "react-redux";

// const casesCategory = {
//   "Not Picked": {
//     status: "Not Picked",
//     statusId: 1,
//     cases: [
//       {
//         id: "1",
//         caseNo: "F23COROTRPC00280",
//         caseName: "Towing",
//         contactName: "Arul Prakasham",
//       },
//       {
//         id: "2",
//         caseNo: "F23COROTRPC00281",
//         caseName: "Mechanical",
//         contactName: "Balaji Sakthivel",
//       },
//       {
//         id: "3",
//         caseNo: "F23COROTRPC00282",
//         caseName: "Break down",
//         contactName: "Dinesh Kumar Lakshman",
//       },
//     ],
//     avatarbg: "#FFDFDF",
//   },
//   "Un-assigned": {
//     status: "Un-assigned",
//     statusId: 2,
//     cases: [
//       {
//         id: "4",
//         caseNo: "F23COROTRPC00283",
//         caseName: "Mechanical",
//         contactName: "Sakthivel",
//       },
//       {
//         id: "5",
//         caseNo: "F23COROTRPC00284",
//         caseName: "Break down",
//         contactName: "Gopi Krishna",
//       },
//     ],
//     avatarbg: "#DFFFE0",
//   },
//   "In-progress": {
//     status: "In-progress",
//     statusId: 3,
//     cases: [
//       {
//         id: "6",
//         caseNo: "F23COROTRPC00285",
//         caseName: "Break down",
//         contactName: "Raj Kamal",
//         bdStatus: "1",
//       },
//       {
//         id: "7",
//         caseNo: "F23COROTRPC00286",
//         caseName: "Towing",
//         contactName: "Raj Kamal",
//         bdStatus: "2",
//       },
//       {
//         id: "8",
//         caseNo: "F23COROTRPC00286",
//         caseName: "Towing",
//         contactName: "Raj Kamal",
//         bdStatus: "3",
//       },
//     ],
//     avatarbg: "#DFFFFF",
//   },
//   "On-Hold": {
//     status: "On-Hold",
//     statusId: 4,
//     cases: [
//       {
//         id: "9",
//         caseNo: "F23COROTRPC00287",
//         caseName: "Mechanical",
//         contactName: "Guru Prasadh",
//       },
//       {
//         id: "10",
//         caseNo: "F23COROTRPC00288",
//         caseName: "Towing",
//         contactName: "Guru Prasadh",
//       },
//     ],
//     avatarbg: "#DFE6FF",
//   },
//   Closed: {
//     status: "Closed",
//     statusId: 5,
//     cases: [
//       {
//         id: "11",
//         caseNo: "F23COROTRPC00289",
//         caseName: "Break down",
//         contactName: "Guru Prasadh",
//       },
//     ],
//     avatarbg: "#F1DFFF",
//   },
// };

const GridView = ({ activityStatusList }) => {
  const { userTypeId, id, entityId, role } = useSelector(CurrentUser);
  const [statusIds, setStatusIds] = useState();
  const [loading, setLoading] = useState(false);
  const gridRef = useRef(null);
  const [pagination, setPagination] = useState({
    "AGENT UNASSIGNED": { offset: 0, limit: 10 },
    "NOT PICKED": { offset: 0, limit: 10 },
    "ASP NOT ASSIGNED": { offset: 0, limit: 10 },
    "ASP NOT REACHED BEYOND SLA": { offset: 0, limit: 10 },
    INPROGRESS: { offset: 0, limit: 10 },
    CANCELED: { offset: 0, limit: 10 },
    REJECTED: { offset: 0, limit: 10 },
    CLOSED: { offset: 0, limit: 10 },
  });

  //console.log("pagination", pagination)

  const params = {
    //limit: 10,
    //offset: 0,
    //userId: 246,
    // userTypeId: userTypeId,
    search: "",
    startDate: "",
    endDate: "",
    //roleId: role?.id,
    //statusType: 1
  };

  //Calling Grid API
  const result = useQueries(
    activityStatusList
      ? activityStatusList?.map((activity, i) => {
          const currentStatus = activity?.name;
          return {
            queryKey: [
              `subServiceGrid${currentStatus}`,
              pagination[currentStatus]?.offset,
            ],
            queryFn: () =>
              subServiceGrid({
                ...params,
                offset: pagination[currentStatus]?.offset,
                limit: pagination[currentStatus]?.limit,
                userTypeId: userTypeId,
                // userId: userTypeId == 141 ? id : entityId,
                userId: id,
                roleId: role?.id,
                statusType: activity?.id,
                caseStatusId: activity?.id,
              }),
            enabled: activityStatusList?.length > 0 ? true : false,
          };
        })
      : []
  );

  //console.log("results", result);
  // const statusId = result?.map((item,i) => {
  //    item?.map((items) => {
  //      return items?.data?.data?.data?.rows?.[0]?.caseDetail?.statusId
  //   })
  // })
  // const statusIds = result?.map(item => {
  //   Object.keys(item).map((li)=>{
  //     return item[li]
  //   })
  //  })

  //const [columns, setColumns] = useState(casesCategory);

  const onDragEnd = (result) => {
    //if (!result.destination) return;
    //console.log("result", result);
    const [MovedCases] = columns[result.source.droppableId].cases.splice(
      result.source.index,
      1
    );
    //console.log("MovedCases", MovedCases);
    columns[result.destination.droppableId].cases.splice(
      result.destination ? result.destination.index : 0,
      0,
      MovedCases
    );
  };

  const casesCategory = {
    "AGENT UNASSIGNED": {
      status: "AGENT UNASSIGNED",
      statusId: 1,
      cases: result?.[0]?.data?.data?.data?.rows?.map((item, i) => {
        return {
          id: item?.id,
          caseNumber: item?.caseNumber,
          customerContactName: item?.customerContactName,
          customerCurrentContactName: item?.customerCurrentContactName,
          customerMobileNumber: item?.customerMobileNumber,
          subject: item?.subject,
          irateCustomer: item?.customerType?.irateCustomer,
          womenAssist: item?.customerType?.womenAssist,
          createdAt: item?.activityCreatedAt,
          service: item?.service,
          subService: item?.subService,
          caseDetailId: item?.caseDetailId,
        };
      }),
      count: result?.[0]?.data?.data?.data?.count,
      avatarbg: "#F1DFFF",
    },
    "NOT PICKED": {
      status: "NOT PICKED",
      statusId: 2,
      cases: result?.[1]?.data?.data?.data?.rows?.map((item, i) => {
        return {
          id: item?.id,
          caseNumber: item?.caseNumber,
          customerContactName: item?.customerContactName,
          customerCurrentContactName: item?.customerCurrentContactName,
          customerMobileNumber: item?.customerMobileNumber,
          subject: item?.subject,
          irateCustomer: item?.customerType?.irateCustomer,
          womenAssist: item?.customerType?.womenAssist,
          createdAt: item?.activityCreatedAt,
          service: item?.service,
          subService: item?.subService,
          caseDetailId: item?.caseDetailId,
        };
      }),
      count: result?.[1]?.data?.data?.data?.count,
      avatarbg: "#DFFFE0",
    },
    "ASP NOT ASSIGNED": {
      status: "ASP NOT ASSIGNED",
      statusId: 3,
      cases: result?.[2]?.data?.data?.data?.rows?.map((item, i) => {
        return {
          id: item?.id,
          caseNumber: item?.caseNumber,
          customerContactName: item?.customerContactName,
          customerCurrentContactName: item?.customerCurrentContactName,
          customerMobileNumber: item?.customerMobileNumber,
          subject: item?.subject,
          irateCustomer: item?.customerType?.irateCustomer,
          womenAssist: item?.customerType?.womenAssist,
          createdAt: item?.activityCreatedAt,
          service: item?.service,
          subService: item?.subService,
          caseDetailId: item?.caseDetailId,
        };
      }),
      count: result?.[2]?.data?.data?.data?.count,
      avatarbg: "#DFFFFF",
    },
    "ASP NOT REACHED BEYOND SLA": {
      status: "ASP NOT REACHED BEYOND SLA",
      statusId: 9,
      cases: result?.[3]?.data?.data?.data?.rows?.map((item, i) => {
        return {
          id: item?.id,
          caseNumber: item?.caseNumber,
          customerContactName: item?.customerContactName,
          customerCurrentContactName: item?.customerCurrentContactName,
          customerMobileNumber: item?.customerMobileNumber,
          subject: item?.subject,
          irateCustomer: item?.customerType?.irateCustomer,
          womenAssist: item?.customerType?.womenAssist,
          createdAt: item?.activityCreatedAt,
          service: item?.service,
          subService: item?.subService,
          caseDetailId: item?.caseDetailId,
        };
      }),
      count: result?.[3]?.data?.data?.data?.count,
      avatarbg: "#DFFFFF",
    },
    INPROGRESS: {
      status: "INPROGRESS",
      statusId: 4,
      cases: result?.[4]?.data?.data?.data?.rows?.map((item, i) => {
        return {
          id: item?.id,
          caseNumber: item?.caseNumber,
          customerContactName: item?.customerContactName,
          customerCurrentContactName: item?.customerCurrentContactName,
          customerMobileNumber: item?.customerMobileNumber,
          subject: item?.subject,
          irateCustomer: item?.customerType?.irateCustomer,
          womenAssist: item?.customerType?.womenAssist,
          createdAt: item?.activityCreatedAt,
          service: item?.service,
          subService: item?.subService,
          caseDetailId: item?.caseDetailId,
        };
      }),
      count: result?.[4]?.data?.data?.data?.count,
      avatarbg: "#FFDFDF",
    },
    CANCELED: {
      status: "CANCELED",
      statusId: 5,
      cases: result?.[5]?.data?.data?.data?.rows?.map((item, i) => {
        return {
          id: item?.id,
          caseNumber: item?.caseNumber,
          customerContactName: item?.customerContactName,
          customerCurrentContactName: item?.customerCurrentContactName,
          customerMobileNumber: item?.customerMobileNumber,
          subject: item?.subject,
          irateCustomer: item?.customerType?.irateCustomer,
          womenAssist: item?.customerType?.womenAssist,
          createdAt: item?.activityCreatedAt,
          service: item?.service,
          subService: item?.subService,
          caseDetailId: item?.caseDetailId,
        };
      }),
      count: result?.[5]?.data?.data?.data?.count,
      avatarbg: "#FFDFDF",
    },
    REJECTED: {
      status: "REJECTED",
      statusId: 6,
      cases: result?.[6]?.data?.data?.data?.rows?.map((item, i) => {
        return {
          id: item?.id,
          caseNumber: item?.caseNumber,
          customerContactName: item?.customerContactName,
          customerCurrentContactName: item?.customerCurrentContactName,
          customerMobileNumber: item?.customerMobileNumber,
          subject: item?.subject,
          irateCustomer: item?.customerType?.irateCustomer,
          womenAssist: item?.customerType?.womenAssist,
          createdAt: item?.activityCreatedAt,
          service: item?.service,
          subService: item?.subService,
          caseDetailId: item?.caseDetailId,
        };
      }),
      count: result?.[6]?.data?.data?.data?.count,
      avatarbg: "#FFDFDF",
    },
    CLOSED: {
      status: "CLOSED",
      statusId: 7,
      cases: result?.[7]?.data?.data?.data?.rows?.map((item, i) => {
        return {
          id: item?.id,
          caseNumber: item?.caseNumber,
          customerContactName: item?.customerContactName,
          customerCurrentContactName: item?.customerCurrentContactName,
          customerMobileNumber: item?.customerMobileNumber,
          subject: item?.subject,
          irateCustomer: item?.customerType?.irateCustomer,
          womenAssist: item?.customerType?.womenAssist,
          createdAt: item?.activityCreatedAt,
          service: item?.service,
          subService: item?.subService,
          caseDetailId: item?.caseDetailId,
        };
      }),
      count: result?.[7]?.data?.data?.data?.count,
      avatarbg: "#FFDFDF",
    },
  };
  const [columns, setColumns] = useState(casesCategory);
  // console.log("!!!!====>>>>>cases", casesCategory)
  // console.log("!!!!====>>>>>colums", columns)
  const handleShowMore = (status) => {
    setLoading(true); // Show loading state

    // Increment the offset for the selected status
    setPagination((prev) => ({
      ...prev,
      [status]: {
        offset: prev[status].offset + 1,
        limit: prev[status].limit + 10,
      },
    }));
  };
  return (
    <div
      className="d-flex gap"
      ref={gridRef}
      style={{
        //width: "calc(100vw - 125px)",
        overflow: "scroll",
        overflowY: "hidden",
        background: "rgba(245, 247, 249, 1)",
        height: "80vh",
        padding: "5px",
      }}
    >
      {/* Drag and drop */}
      {/* <DragDropContext onDragEnd={onDragEnd}>
        {Object.values(casesCategory)?.map(
          ({ status, statusId, cases, avatarbg }, i) => (
            <Droppable droppableId={status} key={i}>
              {(provided, snapshot) => (
                <div className="case-container">
                  <CaseStatusCard
                    status={status}
                    statusId={statusId}
                    totalCases={cases?.length}
                  />
                  <div
                    className="case-list-container"
                    style={{
                      border: snapshot.isDraggingOver
                        ? "1px dotted black"
                        : "transparent",
                    }}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {cases?.length == 0 ? (
                      <div className="no-case-card">
                        There are no cases yet. Drag them from another list.
                      </div>
                    ) : (
                      cases?.map((caseItem, index) => {
                        console.log("item", caseItem);
                        return (
                          <Draggable
                            draggableId={`${caseItem.id}`}
                            index={index}
                            key={`${caseItem.id}`}
                            isDragDisabled={statusId == 2 ? true : false}
                          >
                            {(provided) => (
                              <CaseDetailsCard
                                statusId={statusId}
                                caseDetails={caseItem}
                                avatarbg={avatarbg}
                                innerRef={provided.innerRef}
                                provided={provided}
                                result={result}
                              />
                            )}
                          </Draggable>
                        );
                      })
                    )}

                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          )
        )}
      </DragDropContext>   */}

      {Object.values(casesCategory)?.map(
        ({ status, statusId, cases, avatarbg, count }, i) => (
          <div className="case-container">
            <SubServiceStatusCard
              status={status}
              statusId={statusId}
              totalCases={count}
            />
            <div className="case-list-container">
              {count == 0 || count == undefined ? (
                <div className="no-case-card">There are no cases yet.</div>
              ) : (
                cases?.map((caseItem, index) => {
                  //console.log("item", caseItem);
                  return (
                    <>
                      <Link
                        style={{ textDecoration: "none", color: "inherit" }}
                        key={caseItem?.caseDetailId}
                        to={`/cases/view/${caseItem?.caseDetailId}`}
                      >
                        <SubServiceDetailsCard
                          statusId={statusId}
                          caseDetails={caseItem}
                          avatarbg={avatarbg}
                        />
                      </Link>
                    </>
                  );
                })
              )}
            </div>
            {count > pagination[status]?.limit && (
              <button
                className="show-more-button"
                onClick={() => handleShowMore(status)}
              >
                Show More
              </button>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default GridView;
// : (
//   <div className="no-case-card">
//     There are no cases yet. Drag them from another list.
//   </div>
// )}
