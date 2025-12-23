import React, { useRef } from "react";
import CustomBreadCrumb from "../../components/common/CustomBreadCrumb";
import { AlertCircleIcon, ReceiptLineIcon } from "../../utills/imgConstants";
import ViewTable from "../../components/common/ViewTable";
import { useNavigate, useParams } from "react-router";
import { Chip } from "primereact/chip";
import { OverlayPanel } from "primereact/overlaypanel";
import { useQuery } from "react-query";
import { invoiceView } from "../../../services/deliveryRequestService";
import CurrencyFormat from "../../components/common/CurrencyFormat";
import Loader from "../../components/common/Loader";

const InvoiceView = () => {
  const navigate = useNavigate();
  const AddtionChargesView = useRef(null);

  const { invoiceId } = useParams();
  const { data, isFetching } = useQuery(["invoiceView", invoiceId], () =>
    invoiceView({
      id: invoiceId,
    })
  );
  const MenuItems = [
    {
      label: <div onClick={() => navigate("/delivery-request")}>Invoices</div>,
    },

    {
      label: <div>{data?.data?.data?.invoice?.number}</div>,
    },
  ];
  const paymentData = {
    Taxablevalue: "",
    cgst: "",
    sgst: "",
    igst: "",
  };
  const AspDetails = [
    {
      title: "ASP Name",
      content: "Arjun",
    },
    {
      title: "ASP Code",
      content: "TNM6844",
    },
    {
      title: "ASP Type",
      content: "Self",
    },
    {
      title: "ASP has GST",
      content: "Yes",
      classNames: "color-success",
    },
    {
      title: "Auto Invoice",
      content: "No",
      classNames: "color-danger",
    },
    {
      title: "Tier",
      content: "3",
    },
  ];
  const DealerColumns = [
    { title: "S.no", field: "s_no" },
    { title: "Description", field: "description" },
    { title: "Request No", field: "request_no" },
    { title: "service_charges", field: "service_charges", sorter: true },
    { title: "Invoice Amount", field: "invoice_amount" },
  ];
  const Columns = [
    {
      title: "s.no",
      field: "s.no",
      body: (record, field) => {
        // console.log("record", "field", record, field);
        return 1;
      },
    },
    {
      title: "description",
      field: "description",
    },
    {
      title: "quantity",
      field: "qty",
    },
    {
      title: "rate",
      field: "rate",
      body: (record, field) => <CurrencyFormat amount={record.rate} />,
    },
    {
      title: "amount",
      field: "amount",
      body: (record, field) => <CurrencyFormat amount={record.amount} />,
    },
  ];

  const billingFromData = [
    { name: "Invoice Number", data: data?.data?.data?.invoice?.number },
    { name: "Invoice Date", data: data?.data?.data?.invoice?.date },
    { name: "GSTIN", data: data?.data?.data?.fromAddress?.gstin },
    { name: "PAN", data: data?.data?.data?.fromAddress?.pan },
    { name: "CIN", data: data?.data?.data?.fromAddress?.cin },
  ];
  const billingToData = [
    { name: "Dealer Code", data: data?.data?.data?.toAddress?.code },
    { name: "Group Code", data: data?.data?.data?.toAddress?.groupCode },
    { name: "GST Number ", data: data?.data?.data?.toAddress?.gstin },
    { name: "Period", data: data?.data?.data?.invoice?.period },
  ];
  const BankDetail = [
    {
      name: "Bank",
      data: <Chip label="ICICI Bank" className="info-chip light_violet" />,
    },
    {
      name: "Name",
      data: "HIND MOTORS",
    },
    {
      name: "Account Number",
      data: "674905115230",
    },
    {
      name: "Branch",
      data: "SIKAR",
    },
    {
      name: "IFSC",
      data: "ICIC0006730",
    },
  ];
  const handleColse = () => {
    navigate("/delivery-request");
  };

  return isFetching ? (
    <Loader />
  ) : (
    <div className="page-wrap">
      <CustomBreadCrumb
        items={MenuItems}
        milestone={false}
        handleClose={{ onClick: handleColse }}
      />
      <div className="page-body">
        <div className="page-content-wrap form-page">
          <div className="invoice-page-content">
            <div className="d-flex gap-2_3 mb-2_3">
              <img
                src={ReceiptLineIcon}
                alt="receipt-icon"
                className="invoice-page-icon"
              />
              <div>
                <h4 className="invoice-page-title">
                  INV #{data?.data?.data?.invoice?.number}
                </h4>
                <span className="invoice-page-date">
                  Invoiced Date {data?.data?.data?.invoice?.date}
                </span>
              </div>
            </div>
            <div className="invoice-billing-detail dealer-invoice">
              <div className="row">
                <div className="col-md-6 col-sm-6 border-grey d-flex flex-column">
                  <div className="invoice-billing-address mb-3">
                    <div className="invoice-billing-title">BILLING FROM</div>
                    <span className="invoice-billing-company">
                      {data?.data?.data?.fromAddress?.name}
                    </span>
                    <span className="invoice-billiing-company-address">
                      {data?.data?.data?.fromAddress?.address}
                    </span>
                  </div>

                  <div className="invoice-billing-content">
                    {billingFromData?.map((item, i) => (
                      <div className="invoice-billing-data" key={i}>
                        <div className="invoice-billing-data-title">
                          {item?.name}
                        </div>
                        <span>{item?.data}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-md-6 col-sm-6 d-flex flex-column">
                  <div className="invoice-billing-address mb-3">
                    <div className="invoice-billing-title">BILLING TO</div>
                    <span className="invoice-billing-company">
                      {data?.data?.data?.toAddress?.name}
                    </span>
                    <span className="invoice-billiing-company-address">
                      {data?.data?.data?.toAddress?.address}
                    </span>
                  </div>

                  <div className="invoice-billing-content">
                    {billingToData?.map((item, i) => (
                      <div className="invoice-billing-data" key={i}>
                        <div className="invoice-billing-data-title">
                          {item?.name}
                        </div>
                        <span>{item?.data}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <ViewTable
                  Columns={Columns}
                  data={data?.data?.data?.invoice?.invoiceDetails}
                  paginator={false}
                  className={"view-table"}
                  scrollable={false}
                />
              </div>

              <div className="row bank-payment-content justify-content-between">
                <div className="col-sm-12 col-md-6 col-lg-6 col-xl-3">
                  <h4 className="amount-inwords-title">Amount In Words :</h4>
                  <div className="amount-inwords-content">
                    {data?.data?.data?.invoice?.amountInWords}
                  </div>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6 col-xl-3">
                  <div className="payment-detail-card">
                    <div className="payment-detail-container">
                      <h4 className="payment-detail-title">Payment Details</h4>
                      <div className="payment-detail-content">
                        <div className="payment-detail">
                          <span className="payment-detail-name">
                            Taxable Value
                          </span>
                          <CurrencyFormat
                            amount={data?.data?.data?.invoice?.invoiceDetails?.reduce(
                              (acc, tax) => acc + Number(tax.amount),
                              0
                            )}
                            fontWeight={"600"}
                          />
                        </div>
                        {data?.data?.data?.invoice?.invoiceTaxes?.map((tax) => (
                          <div className="payment-detail">
                            <span className="payment-detail-name">
                              {`${tax.name} (${tax.percentage}%)`}
                            </span>
                            <CurrencyFormat
                              amount={tax.amount}
                              fontWeight={"600"}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="payment-detail-total">
                      <span className="payment-detail-total-name">
                        Final Invoiced Amount
                      </span>
                      <CurrencyFormat
                        amount={data?.data?.data?.invoice?.amount}
                        fontWeight={"600"}
                        color={"#FFF"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="invoice-btn">
              {data?.data?.data?.invoice?.invoiceUrl && (
                <a
                  className="btn btn-primary"
                  href={data?.data?.data?.invoice?.invoiceUrl}
                  download
                >
                  Download Invoice
                </a>
              )}
              {data?.data?.data?.invoice?.eInvoiceUrl && (
                <a
                  className="btn btn-primary"
                  href={data?.data?.data?.invoice?.eInvoiceUrl}
                  download
                >
                  Download E-Invoice
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      <OverlayPanel ref={AddtionChargesView} className="overlay-panel-card">
        <div className="towing-charges-card">
          <div className="towing-charges-card-body">
            <div className="towing-charges-content px-2_3">
              <div className="towing-charges-title">Toll</div>
              <div className="towing-charges-amount">₹ 300</div>
            </div>
            <div className="towing-charges-content px-2_3">
              <div className="towing-charges-title">Border</div>
              <div className="towing-charges-amount">₹ 100</div>
            </div>
            <div className="towing-charges-content px-2_3">
              <div className="towing-charges-title">Green Tax</div>
              <div className="towing-charges-amount">₹ 30</div>
            </div>
            <div className="towing-charges-content dark-bg">
              <div className="towing-charges-title color-text">Total</div>
              <div className="towing-charges-amount">₹ 430</div>
            </div>
          </div>
        </div>
      </OverlayPanel>
    </div>
  );
};

export default InvoiceView;
