import React, { useEffect, useState } from "react";
import CustomBreadCrumb from "../../components/common/CustomBreadCrumb";
import { useNavigate, useParams } from "react-router";
import RequestViewCard from "./RequestViewCard";
import RequestInfoCard from "./RequestInfoCard";
import { Dialog } from "primereact/dialog";
import {
  DashCamImage,
  DialogCloseSmallIcon,
  FileBaseUrl,
} from "../../utills/imgConstants";
import AttachmentsDialog from "../../components/common/AttachmentsDialog";
import ChangeActivityDialog from "../../components/common/ChangeActivityDialog";
import SendNotificationSidebar from "../../components/common/SendNotificationSidebar";
import { useMutation, useQueries, useQuery } from "react-query";
import {
  agentUser,
  caseDetail,
} from "../../../services/deliveryRequestViewService";
import { aspData } from "../../../services/assignServiceProvider";
import { attachments } from "../../../services/inventoryViewService";
import Loader from "../../components/common/Loader";

const DeliveryRequestView = () => {
  const navigate = useNavigate();
  const { caseId } = useParams();
  // console.log("caseId", caseId);
  const [camVisible, setCamVisible] = useState(false);
  const [activityVisible, setActivityVisible] = useState(false);
  const [attachmentDialogVisible, setAttachmentDialogVisible] = useState(false);
  const [sendNotificationVisible, setSendNoticationVisible] = useState(false);
  const [activityId, setActivityIds] = useState(null);

  const {
    data,
    refetch: caseDetailrefetch,
    isLoading: caseDetailLoading,
  } = useQuery(
    ["casedetail"],
    () =>
      caseDetail({
        caseDetailId: caseId,
      }),
    {
      onSuccess: (res) => {
        setActivityIds(
          res?.data?.data[0]?.activityDetails?.map((item) => {
            return {
              id: item.id,
            };
          })
        );
      },
    }
  );
  // console.log("data delivery request view", data);
  const { data: attachmentData } = useQuery(
    ["requestAttachment"],
    () =>
      attachments({
        entityId: caseId,
        attachmentOfId: 101,
      }),
    {
      enabled: data !== undefined && data?.data?.data[0]?.hasDocuments,
    }
  );

  // console.log("attachmentData", attachmentData);
  // Agent Detail Api call
  const { data: agentDetailData, refetch } = useQuery(
    ["agentdetail", data?.data?.data[0]?.agentId],
    () =>
      agentUser({
        id: data?.data?.data[0]?.agentId,
      }),
    {
      enabled: !!data?.data?.data[0]?.agentId,
      onSuccess: () => {
        // console.log("agentDetailData?.data", agentDetailData?.data);
      },
    }
  );
  //service provider Api call
  // console.log("ticketInfo", data?.data?.data[0]?.activityDetails);
  // console.log("activityId", activityId);
  const result = useQueries(
    activityId
      ? activityId?.map((activity, i) => {
          return {
            queryKey: [`servieprovider${i}`],
            queryFn: () =>
              aspData({
                activityId: activity.id,
              }),
            enabled: activityId?.length > 0 ? true : false,
          };
        })
      : []
  );
  // console.log("results", result);
  const MenuItems = [
    {
      label: (
        <div onClick={() => navigate("/delivery-request")}>
          Delivery Requests
        </div>
      ),
    },
    {
      label: <div>{data?.data?.data[0]?.caseNumber ?? "--"}</div>,
    },
  ];
  const Details = [
    { title: "VIN Number", info: "ANICS329870CG93" },
    {
      title: "Vehicle No",
      info: "TN70AM2694",
    },
    {
      title: "Description",
      info: "Starting Problem, Black Smoke when tried to start vehicle, Loud sound from engine.",
    },
    {
      title: "Dealer",
      info: "Tata Motors",
    },
  ];
  // const attachments = [
  //   {
  //     name: "Fircopy.pdf",
  //     url: "https://source.unsplash.com/snNHKZ-mGfE",
  //   },
  //   {
  //     name: "Insurance.pdf",
  //     url: "https://source.unsplash.com/snNHKZ-mGfE",
  //   },
  // ];

  return (
    <div className="page-wrap">
      <CustomBreadCrumb items={MenuItems} milestone={false} />
      <div className="page-body">
        {caseDetailLoading ? (
          <Loader />
        ) : (
          <div className="row row-gap-3_4 h-100">
            <div className="col-md-12 col-lg-4">
              <RequestViewCard
                setSendNoticationVisible={setSendNoticationVisible}
                dealerDetails={{
                  name:
                    data?.data.data[0]?.locationTypeId == 451
                      ? data?.data.data[0]?.deliveryRequestCreatedDealer?.name
                      : data?.data?.data[0]?.dealer,
                  email:
                    data?.data.data[0]?.locationTypeId == 451
                      ? data?.data.data[0]?.deliveryRequestCreatedDealer?.email
                      : data?.data?.data[0]?.dealerEmail,
                  remarks: data?.data.data[0]?.description,
                  createdAt: data?.data.data[0]?.createdAt,
                  createdDealerId:
                    data?.data.data[0]?.deliveryRequestCreatedDealerId,
                  createdAtInMilliSeconds:
                    data?.data.data[0]?.createdAtInMilliSeconds,
                }}
                refetch={caseDetailrefetch}
                caseNumber={data?.data?.data[0]?.caseNumber}
                agentDetails={agentDetailData?.data?.user}
                agentId={data?.data?.data[0]?.agentId}
                caseStatusId={data?.data?.data[0]?.caseStatusId}
                activityDetails={data?.data?.data[0]?.activityDetails}
                caseData={data?.data?.data[0]}
                slaTime={data?.data?.data[0]?.extras?.slaSettings}
              />
            </div>
            <div className="col-md-12 col-lg-8">
              <RequestInfoCard
                requestId={data?.data?.data[0]?.caseNumber}
                setCamVisible={setCamVisible}
                setAttachmentDialogVisible={setAttachmentDialogVisible}
                setActivityVisible={setActivityVisible}
                ticketInfo={data?.data?.data[0]}
                serviceproviders={
                  result ? result?.map((asp) => asp?.data?.data?.data[0]) : []
                }
                aspRefetch={result}
                caseDetailrefetch={caseDetailrefetch}
              />
            </div>
          </div>
        )}
      </div>
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title">Dash-cam</div>
          </div>
        }
        closeIcon={<img src={DialogCloseSmallIcon} />}
        className="w-576"
        visible={camVisible}
        position={"bottom-right"}
        modal={false}
        onHide={() => setCamVisible(false)}
      >
        <div className="dialog-main-content">
          <img src={DashCamImage} alt={"dash-cam-img"} />
        </div>
      </Dialog>
      <AttachmentsDialog
        visible={attachmentDialogVisible}
        setVisible={setAttachmentDialogVisible}
        attachments={attachmentData?.data?.data?.map((item) => {
          return {
            name: item?.fileName,
            url: `${FileBaseUrl}${item?.fileName}`,
          };
        })}
        title={"Documents"}
        download={true}
      />
      <ChangeActivityDialog
        visible={activityVisible}
        setVisible={setActivityVisible}
      />
      <SendNotificationSidebar
        Details={Details}
        visible={sendNotificationVisible}
        setVisible={setSendNoticationVisible}
      />
    </div>
  );
};

export default DeliveryRequestView;
