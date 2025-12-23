const LorryReceiptPDF = ({ data, receiptRef }) => {
  return (
    <div>
      <div className="lorry-receipt" ref={receiptRef}>
        {/* Inline styles can be moved to a CSS file or use module.scss */}
        <style>
          {`
 
      .container-body{
       font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      color: #333;
      }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .header-title {
      display: flex;
      align-items: center;
    }
    .icon {
      
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px;
    }
    .title {
      font-weight: 700;
      font-size: 14px;
    }
    .copy-type {
      color: #888;
      font-size:10px;
      font-weight: 400;
    }
    .company-info {
      margin-bottom: 20px;
      font-size:10px;
    }
    .company-name {
      font-weight: bold;
      margin-bottom: 5px;
       font-size:10px;
    }
       .company-des{
       font-family: Arial;
        font-weight: 400;
        font-size: 10px;
        line-height: 14px;
        letter-spacing: 0px;
        margin-bottom:5px;

       }
    .divider {
      border-top: 1px solid #00000014;
      margin: 10px 0;
    }
    .consignment-grid {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }
    .consignment-box {
      flex: 1;
      background-color: #F5F7F9;
       border-radius: 4px;
      padding: 12px;
      height: 170px;
    }
      .consignment-box-wrap{
       flex: 1;
      background-color: #F5F7F9;
       border-radius: 4px;
      padding: 12px;
      }
    .consignment-label {
      color: #666;
      margin-bottom: 10px;
     font-weight: 400;
      font-size:10px
    }
    .consignment-details {
      margin-bottom: 5px;
      font-size:10px;
      font-weight: 400;
      line-height: 16px;
    }
    .gstin {
      margin-top: 5px;
      font-size:10px;
    }
    .section-title {
      color: #0370F2;
      font-weight: bold;
      margin: 16px 0 8px 0;
      font-size:10px;

    }
        .transport-title {
      color: #0370F2;
      font-weight: bold;
      margin: 0px 0 8px 0;
      font-size:10px;

    }
      
         .section-title-bottom {
      color:#1A2E35;
      font-weight: bold;
      margin: 16px 0 6px 0;
      font-size:8px;

    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
      font-size:10px;
    }
    th,
    td {
      border: 1px solid #ddd;
      padding: 10px;
      text-align: left;
    }
    th {
      background-color: #f5f5f5;
      font-size:10px
    }
    .value-column {
      text-align: right;
      font-size:10px;
    }
       .value-column-color {
      text-align: right;
      font-size:8px;
      color:#0370F2 !important;
      font-weight:700;
      
    }
    .remarks-box {
      background-color: #F5F7F9;
      padding: 20px;
      min-height: 60px;
      margin-bottom: 60px;
      font-size:10px;
      height:70px;
      border-radius: 4px;
    }
      .remarks-box-wrap{
         background-color: #F5F7F9;
      padding: 20px;
    
      min-height: 60px;
      margin-bottom: 5px;
      font-size:10px;
      height:50px;
      border-radius: 4px;
      }
    .acknowledge-box {
      background-color: #FFF6DC;
      color: #A06218;
      padding: 10px 12px;
      margin: 10px 0;
      border-radius: 8px;
      font-size:10px
     
    }
    .acknowledge-box-pb{
    font-family: Arial;
    font-weight: 700;
    font-size: 10px;
    line-height: 16px;
    letter-spacing: 0%;
    margin-bottom: 5px !important;
    }
    .acknowledge-box-desc{
font-family: Arial;
font-weight: 400;
font-size: 10px;
line-height: 16px;
letter-spacing: 0%;

    }
    .signatures {
      display: flex;
      justify-content: space-between;
      margin-top: 40px;
      font-size:10px;
    }
        .signatures-wrap {
      display: flex;
      justify-content: space-between;
        padding-top: 10px;
     margin-top: 25px;
   
      font-size:10px;
    }
    .signature {
      flex: 1;
      text-align: center;
      border-top: 0.5px solid #ADADAD;
      padding-top: 10px;
      margin: 0 20px;
     
    }
    .signature-right {
    margin-right:0px !important;
}
       .signature-left {
    margin-left:0px !important;
}
    .signature-title {
      font-style: italic;
     font-weight: 700;
      font-size:10px;
    }
        .signature-title-span {
      font-style: italic;
     font-weight: 200;
      font-size:10px;
    }
    .consignment-note-table {
          background-color: #F5F7F9;
      }
      .consignment-note-table th{
                     border: none;
            
            padding: 12px;
    padding-bottom: 2px;
    text-align: left;
    font-size: 8px;

            font-weight: 400;
            color: #6C6C6C;
            background-color: #F5F7F9;
      
      }
       .consignment-note-table td {
          border: none;
    padding: 12px;
    padding-top: 8px;
    text-align: left;
    font-size: 8px;
    font-weight: 700;
    color: #1A2E35;
    background-color: #F5F7F9;
        }
        .consignment-details-table {
            border-collapse: separate;
            border-spacing: 0;
            border: 0.5px solid #ADADAD !important;
            
        }
        .consignment-details-table th {
            background-color: #F5F7F9;
            /* border-color:#ADADAD; */
            border: 0.5px solid #ADADAD !important;
            padding: 6px 10px;
            text-align: left;
            font-size: 8px;
        }
        .consignment-details-table td {
            /* border-color: #ADADAD; */
           border: 0.5px solid #ADADAD !important;
              padding: 6px 10px;
            text-align: left;
             font-size: 8px;
        }
      .value-column {
          text-align: right;
          font-size:10px;
      }
  `}
        </style>
        <div className="container-body">
          <div className="header">
            <div className="header-title">
              <div className="icon">
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="34"
                    height="34"
                    rx="17"
                    fill="#0370F2"
                    fillOpacity="0.14"
                  />
                  <path
                    d="M13.8484 13.85H20.1484M13.8484 17.45H20.1484M12.3184 10.25H21.6784C22.3246 10.25 22.8484 10.8544 22.8484 11.6V23.75L20.8984 22.4L18.9484 23.75L16.9984 22.4L15.0484 23.75L13.0984 22.4L11.1484 23.75V11.6C11.1484 10.8544 11.6723 10.25 12.3184 10.25Z"
                    stroke="#0370F2"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="title">LORRY RECEIPT</div>
            </div>
            <div className="copy-type">Transporter Copy</div>
          </div>
          <div className="transport-title">TRANSPORTER</div>
          <div className="company-info">
            <div className="company-name">{data?.companyName}</div>
            <div className="company-des">{data?.companyAddress}</div>
            <div>GSTIN : {data?.companyGstin}</div>
          </div>

          <div className="divider"></div>

          <div className="consignment-grid">
            <div
              className={` ${
                data?.dropLocation.length > 300 ||
                data?.pickupLocation.length > 300
                  ? "consignment-box-wrap"
                  : "consignment-box"
              }`}
            >
              <div className="consignment-label">
                CONSIGNER : (Pickup location)
              </div>
              {data?.locationTypeId === 451 ? (
                <>
                  <div className="consignment-details">
                    {data?.pickupLocation}
                  </div>
                </>
              ) : (
                <>
                  <div className="consignment-details">
                    <strong>{data?.pickupDealer}</strong>
                  </div>
                  <div className="consignment-details">
                    {data?.pickupLocation}
                  </div>

                  <div className="gstin">GSTIN - {data?.pickupDealerGstin}</div>
                </>
              )}
            </div>
            <div
              className={` ${
                data?.dropLocation.length > 300 ||
                data?.pickupLocation.length > 300
                  ? "consignment-box-wrap"
                  : "consignment-box"
              }`}
            >
              <div className="consignment-label">
                CONSIGNEE : (Drop location)
              </div>
              {data?.locationTypeId === 451 ? (
                <>
                  <div className="consignment-details">
                    {data?.dropLocation}
                  </div>
                </>
              ) : (
                <>
                  <div className="consignment-details">
                    <strong>{data?.dropDealer}</strong>
                  </div>
                  <div className="consignment-details">
                    {data?.dropLocation}
                  </div>

                  <div className="gstin">GSTIN - {data?.dropDealerGstin}</div>
                </>
              )}
            </div>
          </div>

          <div className="section-title">CONSIGNMENT NOTE</div>
          <table className="consignment-note-table">
            <thead>
              <tr>
                <th>Request Date</th>
                <th>Request ID</th>
                <th>Flat Bed Truck No</th>
                <th>Loading Date & Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{data?.aspReachedToPickupDate}</td>
                <td>{data?.caseNumber}</td>
                <td>{data?.aspVehicleRegistrationNumber}</td>
                <td>{data?.aspReachedToPickupAt}</td>
              </tr>
            </tbody>
          </table>

          <div className="section-title">CONSIGNMENT DETAILS</div>
          <table className="consignment-details-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Chassis No</th>
                <th>Model</th>
                {/* <th className="value-column">Value</th> */}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>01</td>
                <td>{data?.vin}</td>
                <td>{data?.vehicleModel}</td>
                {/* <td className="value-column-color">
                  ₹ {data?.approximateVehicleValue}
                </td> */}
              </tr>
            </tbody>
          </table>

          <div className="section-title-bottom">Remarks</div>
          <div
            className={` ${
              data?.dropLocation.length > 300 ||
              data?.pickupLocation.length > 300
                ? "remarks-box-wrap"
                : "remarks-box"
            }`}
          ></div>

          <div className="acknowledge-box">
            <p className="acknowledge-box-pb">Transportation Acknowledgement</p>
            <p className="acknowledge-box-desc">
              Received above said vehicle, along with toolkit, Key & all
              documents. This is subject to terms & condition detailed in our
              agreement with KMS executed separately. All dispute subject to
              city jurisdiction.
            </p>
          </div>

          <div
            className={` ${
              data?.dropLocation?.length > 300 ||
              data?.pickupLocation?.length > 300
                ? "signatures-wrap"
                : "signatures"
            }`}
          >
            <div className="signature signature-left">
              <div className="signature-title">
                Consigner{" "}
                <span className="signature-title-span">(Pickup location)</span>
              </div>
            </div>
            <div className="signature">
              <div className="signature-title">Truck Driver</div>
            </div>
            <div className="signature signature-right">
              <div className="signature-title">
                Consignee{" "}
                <span className="signature-title-span">(Drop Location)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LorryReceiptPDF;
