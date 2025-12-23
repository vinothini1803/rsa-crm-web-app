import React from "react";
import { CloseIcon, TowingVehicleIcon } from "../../../utills/imgConstants";
import ViewGrid from "../../../components/common/ViewGrid";
import CustomBreadCrumb from "../../../components/common/CustomBreadCrumb";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "react-query";
import { viewVehicle } from "../../../../services/adminService";

const ViewVehicleMaster = () => {
  const navigate = useNavigate();
  const { vehicleId } = useParams();

  const { data } = useQuery(["vehicleview", vehicleId], () =>
    viewVehicle({
      ownPatrolVehicleId: vehicleId,
    })
  );

  // console.log("vehicle data", data?.data?.data);
  const MenuItems = [
    {
      label: (
        <div onClick={() => navigate("/admin/vehicle-master")}>
          Vehicle Master
        </div>
      ),
    },
    { label: <div>View Vehicle</div> },
  ];
  const handleClose = () => {
    navigate("/admin/vehicle-master");
  };
  const BasicDetailsData = [
    {
      label: "Vehicle Registration Number",
      value: data?.data?.data?.vehicleRegistrationNumber,
      vlaueClassName: "info-badge info-badge-purple",
    },
    {
      label: "GPS Device ID",
      value: data?.data?.data?.gpsDeviceId
        ? data?.data?.data?.gpsDeviceId
        : "--",
      vlaueClassName: data?.data?.data?.gpsDeviceId
        ? "info-badge info-badge-yellow"
        : "",
    },
    {
      label: "Vehicle Type",
      value: data?.data?.data?.vehicleType?.name,
    },
    {
      label: "Vehicle Make",
      value: data?.data?.data?.vehicleMake?.name || "--",
    },
    {
      label: "Vehicle Model",
      value: data?.data?.data?.vehicleModel?.name || "--",
    },
    /*
    {
      label: "Mapped Axapta Code",
      value: "22543211",
      vlaueClassName: "info-badge info-badge-yellow",
    },
 
    {
      label: "Mapped ASP’s",
      value: "MYSCTS0001",
      vlaueClassName: "info-badge info-badge-yellow",
    }, */
    {
      label: "Mapped Service Organisation",
      value: data?.data?.data?.serviceOrganisation?.name,
    },
    {
      label: "Status",
      value: data?.data?.data?.status,
      vlaueClassName: `info-badge info-badge-${
        data?.data?.data?.status == "Active" ? "green" : "red"
      }`,
    },
  ];
  return (
    <>
      <div className="page-wrap">
        <CustomBreadCrumb items={MenuItems} milestone={false} />
        <div className="page-body">
          <div className="page-content-wrap">
            <div className="page-content-header">
              <div className="d-flex align-items-center justify-content-between">
                <div className="page-content-title-wrap">
                  <div className="page-content-title-icon">
                    <img
                      className="img-fluid"
                      src={TowingVehicleIcon}
                      alt="Title Icon"
                    />
                  </div>
                  <div>
                    <h5 className="page-content-title">Vehicle</h5>
                  </div>
                </div>
                <div className="page-content-header-right">
                  <button className="btn btn-close" onClick={handleClose}>
                    <img className="img-fluid" src={CloseIcon} alt="Close" />
                  </button>
                </div>
              </div>
            </div>
            <div className="page-content-body">
              <div className="border-box bg-white">
                <ViewGrid items={BasicDetailsData} className="grid-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewVehicleMaster;
