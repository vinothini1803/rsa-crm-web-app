import React, { useRef, useState, useEffect } from "react";
import { useQueries } from "react-query";
import CaseStatusCard from "./CaseStatusCard";
import CaseDetailsCard from "./CaseDetailsCard";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { caseGrid } from "../../../../services/caseService";
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

const GridView = ({ activityStatusData }) => {

  const { userTypeId, id, entityId, role } = useSelector(CurrentUser);
  const [loading, setLoading] = useState(false);  // Track loading state for "Show More"


  const gridRef = useRef(null);
  const [pagination, setPagination] = useState({
    Open: { offset: 0, limit: 10 },
    "In Progress": { offset: 0, limit: 10 },
    Cancelled: { offset: 0, limit: 10 },
    Closed: { offset: 0, limit: 10 }
  });
  
  const params = {
    //offset: pagination?.offset,
    //limit: pagination?.limit,
    //userId: 246,
    // userTypeId: userTypeId,
    search: '',
    startDate: '',
    endDate: '',
    //roleId: role?.id,
    //statusType: 1
  };
  //console.log("pagination", pagination)

  //Calling Grid API
  const result = useQueries(
    activityStatusData
      ? activityStatusData?.map((activity, i) => {
        const currentStatus = activity?.name;
        return {
          queryKey: [`caseGrid${currentStatus}`, pagination[currentStatus]?.offset],
          queryFn: () =>
            caseGrid({
              ...params,
              offset: pagination[currentStatus]?.offset,
              limit: pagination[currentStatus]?.limit,
              userTypeId: userTypeId,
              // userId: userTypeId == 141 ? id : entityId,
              userId:id,
              roleId: role?.id,
              statusType: activity.id
            }),
          enabled: activityStatusData?.length > 0 ? true : false,
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
    "Open": {
      status: "Open",
      statusId: 1,
      cases: result?.[0]?.data?.data?.data?.rows?.map((item, i) => {
        return {
          id: item?.id,
          caseNumber: item?.caseDetail?.caseNumber,
          customerContactName: item?.customerContactName,
          customerCurrentContactName: item?.customerCurrentContactName,
          customerMobileNumber: item?.customerMobileNumber,
          subject: item?.caseDetail?.subject,
          irateCustomer: item?.customerType?.irateCustomer,
          womenAssist: item?.customerType?.womenAssist,
          createdAt: item?.caseDetail?.createdAt,
          service: item?.service,
          caseDetailId: item?.caseDetailId,
        }
      }),
      count: result?.[0]?.data?.data?.data?.count,
      avatarbg: "#F1DFFF",
    },
    "In Progress": {
      status: "In Progress",
      statusId: 2,
      cases: result?.[1]?.data?.data?.data?.rows?.map((item, i) => {
        return {
          id: item?.id,
          caseNumber: item?.caseDetail?.caseNumber,
          customerContactName: item?.customerContactName,
          customerCurrentContactName: item?.customerCurrentContactName,
          customerMobileNumber: item?.customerMobileNumber,
          subject: item?.caseDetail?.subject,
          irateCustomer: item?.customerType?.irateCustomer,
          womenAssist: item?.customerType?.womenAssist,
          createdAt: item?.caseDetail?.createdAt,
          service: item?.service,
          caseDetailId: item?.caseDetailId,
        }
      }),
      count: result?.[1]?.data?.data?.data?.count,
      avatarbg: "#DFFFE0",
    },
    "Cancelled": {
      status: "Cancelled",
      statusId: 3,
      cases: result?.[2]?.data?.data?.data?.rows?.map((item, i) => {
        return {
          id: item?.id,
          caseNumber: item?.caseDetail?.caseNumber,
          customerContactName: item?.customerContactName,
          customerCurrentContactName: item?.customerCurrentContactName,
          customerMobileNumber: item?.customerMobileNumber,
          subject: item?.caseDetail?.subject,
          irateCustomer: item?.customerType?.irateCustomer,
          womenAssist: item?.customerType?.womenAssist,
          createdAt: item?.caseDetail?.createdAt,
          service: item?.service,
          caseDetailId: item?.caseDetailId,
        }
      }),
      count: result?.[2]?.data?.data?.data?.count,
      avatarbg: "#DFFFFF",
    },
    Closed: {
      status: "Closed",
      statusId: 4,
      cases: result?.[3]?.data?.data?.data?.rows?.map((item, i) => {
        return {
          id: item?.id,
          caseNumber: item?.caseDetail?.caseNumber,
          customerContactName: item?.customerContactName,
          customerCurrentContactName: item?.customerCurrentContactName,
          customerMobileNumber: item?.customerMobileNumber,
          subject: item?.caseDetail?.subject,
          irateCustomer: item?.customerType?.irateCustomer,
          womenAssist: item?.customerType?.womenAssist,
          createdAt: item?.caseDetail?.createdAt,
          service: item?.service,
          caseDetailId: item?.caseDetailId,
        }
      }),
      count: result?.[3]?.data?.data?.data?.count,
      avatarbg: "#FFDFDF",
    },
  };
  const [columns, setColumns] = useState(casesCategory);
 // console.log("!!!!====>>>>>cases", casesCategory)
  // console.log("!!!!====>>>>>colums", columns)
  

 
  // Handle "Show More" button click to fetch more cases
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
        overflow: "scroll",
        background: "rgba(245, 247, 249, 1)",
        height: "80vh", padding: "5px"
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
      </DragDropContext>  */}

      {Object.values(casesCategory)?.map(
        ({ status, statusId, cases, avatarbg, count }, i) => (
         
          <div className="case-container">
            <CaseStatusCard
              status={status}
              statusId={statusId}
              totalCases={count}
            />
            <div
              className="case-list-container"
            >
              {count == 0 || count == undefined ? (
                <div className="no-case-card">
                  There are no cases yet.
                </div>
              ) : (
                cases?.map((caseItem, index) => {
                  //console.log("item", caseItem);
                  return (
                    <>
                      <Link
                        style={{ textDecoration: 'none', color: 'inherit' }}
                        key={caseItem?.caseDetailId}
                        to={`/cases/view/${caseItem?.caseDetailId}`}
                      >
                        <CaseDetailsCard
                          statusId={statusId}
                          caseDetails={caseItem}
                          avatarbg={avatarbg}
                          result={result}
                        />
                      </Link>

                    </>
                  );
                })
              )}
            </div>
            
            {count > pagination[status]?.limit && (
              <button className="show-more-button" onClick={() => handleShowMore(status)}>
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
