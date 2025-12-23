import { Sidebar } from "primereact/sidebar";
import React, { useState } from "react";
import { useQuery, useMutation } from "react-query";
import { DialogCloseIcon } from "../../utills/imgConstants";
import { Chip } from "primereact/chip";
import Note from "../../components/common/Note";
import Search from "../../components/common/Search";
import { RadioButton } from "primereact/radiobutton";
import { Divider } from "primereact/divider";
import NoDataComponent from "../../components/common/NoDataComponent";
import { getMembershipRatecard } from "../../../services/caseService";

const RateCardSidebar = ({ visible, setVisible, client, service }) => {
  const [selectedRate, setSelectedRate] = useState(3);
  const [searchValue, setSearchValue] = useState("");
  const handleSearch = (e) => {
    console.log("Search value => ", e?.target?.value);
    setSearchValue(e?.target?.value);
  };

  const { data: ratecardServiceData} = useQuery(["getMembershipRatecard", client, service, searchValue], () => getMembershipRatecard({
    clientName: client?.name,
    serviceName: service?.name,
    searchKey: searchValue,
  }), {
    enabled: (client && service && visible ) ? true : false,
    // refetchOnWindowFocus: false,
  });

  console.log('ratecardServiceData', ratecardServiceData);

  const handleRateSelect = (rateId) => {
    console.log("selected rate id", rateId);
    setSelectedRate(rateId);
  };
  const RateCard = ({ rateType, basicPrice, excessPrice, id }) => (
    <div
      className={`rate-card ${id == selectedRate ? `rate-card-selected` : ``}`}
      onClick={() => handleRateSelect(id)}
    >
      <div className="rate-type-container">
        {/* <RadioButton checked={id == selectedRate} /> */}
        <div className="rate-type-label"> {rateType}</div>
      </div>
      <Divider layout="vertical" />
      <div className="rate-container">
        <div className="rate-type-title">Basic</div>
        <div className="rate-label">{basicPrice}</div>
        <div className="gst-text">+ GST</div>
      </div>
      <Divider layout="vertical" />
      <div className="rate-container">
        <div className="rate-type-title">Excess</div>
        <div className="rate-label">{excessPrice}</div>
        <div className="gst-text">+ GST</div>
      </div>
    </div>
  );

  const AvailableRates = [
    {
      id: 1,
      rateType: "Other minor repair on site",
      basicPrice: "₹ 3000 - ₹ 10000 /40 KM",
      excessPrice: "₹ 30/ KM",
    },
    {
      id: 2,
      rateType: "Mechanic",
      basicPrice: "₹ 3000 - ₹ 10000 /40 KM",
      excessPrice: "₹ 30/ KM",
    },
    {
      id: 3,
      rateType: "Towing",
      basicPrice: "₹ 3000 - ₹ 10000 /40 KM",
      excessPrice: "₹ 30/ KM",
    },
    {
      id: 4,
      rateType: "SCV Mechanic",
      basicPrice: "₹ 3000 - ₹ 10000 /40 KM",
      excessPrice: "₹ 30/ KM",
    },
    {
      id: 5,
      rateType: "Battery Jump Start",
      basicPrice: "₹ 3000 - ₹ 10000 /40 KM",
      excessPrice: "₹ 30/ KM",
    },
  ];

  return (
    <Sidebar
      visible={visible}
      position="right"
      onHide={() => setVisible(false)}
      showCloseIcon={false}
      pt={{
        root: {
          className: "w-564",
        },
        header: {
          className: "rate-card-sidebar-header",
        },
      }}
      icons={
        <>
          <div className="rate-card-title">
            <div className="sidebar-title">Rate Card</div>
            <Chip
              label={client?.name?.toUpperCase()}
              className="info-chip blue reminder-chip"
            />
            <button
              className="p-sidebar-close p-sidebar-icon p-link ms-auto"
              onClick={() => setVisible(false)}
            >
              <DialogCloseIcon />
            </button>
          </div>
          <div className="rate-content-header">
            <Note type={"info"} icon={true} purpose={"note"}>
              <div className="rate-note-content">
                Basic rate is showed for services based on the account.
              </div>
            </Note>
            <Search
              onChange={handleSearch}
              expand={true}
              placeholder={"Search Service"}
            />
          </div>
        </>
      }
    >
      <div className="sidebar-content-wrap">
        <div className="sidebar-content-body">
          {ratecardServiceData?.data?.success ? (
            <div className="rate-card-list-container">
              {ratecardServiceData?.data?.data?.map(
                (ratecard, index) => (
                  <RateCard
                    id={ratecard?.id}
                    rateType={ratecard?.sub_service_name}
                    //basicPrice={`₹ ${ratecard?.above_range_price} - ₹ ${ratecard?.below_range_price}`}
                    basicPrice={`₹ ${ratecard?.below_range_price} / ${ratecard?.range_limit} KM`}
                    excessPrice={`₹ ${ratecard?.above_range_price} / KM`}
                    key={index}
                  />
                )
              )}
            </div>
          ) : (
            <NoDataComponent text={"No Data Found!"}/>
          )}
        </div>
      </div>
    </Sidebar>
  );
};

export default RateCardSidebar;
