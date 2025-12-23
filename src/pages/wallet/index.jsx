import React, { useState } from "react";
import TableWrapper from "../../components/common/TableWrapper/TableWrapper";
import { Button } from "primereact/button";
import StatusBadge from "../../components/common/StatusBadge";
import CurrencyFormat from "../../components/common/CurrencyFormat";
import { Dialog } from "primereact/dialog";
import { DialogCloseSmallIcon } from "../../utills/imgConstants";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useSelector } from "react-redux";
import { CurrentUser } from "../../../store/slices/userSlice";
import { useMutation, useQuery } from "react-query";
import {
  checkStatus,
  orderCreation,
  paymentSuccess,
  walletlogs,
  exportDealerWalletLogs,
} from "../../../services/walletService";
import {
  configtypes,
  dealerData,
  dealer,
} from "../../../services/masterServices";
import moment from "moment";
import { toast } from "react-toastify";
import { walletBalance } from "../../../services/deliveryRequestViewService";
import ExportDialog from "../../components/common/ExportDialog";
import { download } from "../../utills/download";

const Wallet = () => {
  const [filters, setFilters] = useState();
  const [searchValue, setSearchValue] = useState(null);
  const [orderId, setOrderId] = useState();
  const user = useSelector(CurrentUser);
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const [visible, setVisible] = useState(false);
  const { data, isFetching, refetch } = useQuery(
    ["walletlist", pagination, filters, searchValue],
    () =>
      walletlogs({
        ...(user?.role?.id == 2 && { dealerCode: user?.code }),
        ...pagination,
        ...filters,
        ...(searchValue && { searchKey: searchValue }),
      })
  );
  // console.log("user", user);
  const { data: walletBalanceMutate, isLoading: walletBalanceIsLoading } =
    useQuery(["walletbalance"], () =>
      walletBalance(
        {
          ...(user?.role?.id == 2 && { dealerCode: user?.code }),
        },
        {
          onSuccess: () => {
            if (res?.data?.success) {
              // console.log(res);
            } else {
              if (res?.data?.error) {
                toast.error(res?.data?.error);
              } else {
                res?.data?.errors?.forEach((el) => toast.error(el));
              }
            }
          },
        }
      )
    );
  // console.log("walletBalanceMutate", walletBalanceMutate);
  const { mutate, isLoading: checkStatusIsLoading } = useMutation(checkStatus);

  const { mutate: orderCreateMutate, isLoading: orderCreationIsLoading } =
    useMutation(orderCreation);

  const { mutate: paymentSuccessMutate } = useMutation(paymentSuccess);

  const { data: tranactiontypedata } = useQuery(["tranactiontypelist"], () =>
    configtypes({
      typeId: 17,
    })
  );
  const { data: paymentstatusdata } = useQuery(["paymentstatuslist"], () =>
    configtypes({
      typeId: 18,
    })
  );

  const { data: topupDealerData } = useQuery(["dealerlist"], () =>
    dealer({
      apiType: "dropdown",
    })
  );

  // console.log("user", user);
  // console.log("walletlogs data", data);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      dealerCode: "",
      amount: "",
    },
  });
  //handle pagination change
  const handlepageChange = (offset, limit) => {
    // console.log("offset", offset, limit);
    setPagination({
      offset: offset,
      limit: limit,
    });
  };
  //handle Search change
  const handleSearchChange = (value) => {
    setPagination({
      limit: 10,
      offset: 0,
    });
    setSearchValue(value == "" ? null : value);
  };
  const handleCheckStatus = (e, record) => {
    // console.log("check status", record);
    setOrderId(record?.razorpay_order_id);
    mutate(
      {
        orderId: record?.razorpay_order_id,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            refetch();
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

  const handleTopup = () => {
    setVisible(true);
  };
  const columns = [
    {
      title: "Date",
      field: "date",
    },
    {
      title: "Transaction Type",
      field: "transaction_type",
    },
    {
      title: "Description",
      field: "logDescription",
    },
    {
      title: "Amount",
      field: "amount",
      body: (record, field) => `₹ ${record?.amount}`,
    },
    {
      title: "Balance",
      field: "balance",
      body: (record, field) => `₹ ${record?.balance}`,
    },
    {
      title: "Payment Mode",
      field: "payment_mode",
    },
    {
      title: "UTR Number",
      field: "utr_number",
    },
    {
      title: "Remarks",
      field: "remarks",
    },
    {
      title: "Payment Status",
      field: "payment_status",
      body: (record, field) => (
        <StatusBadge
          text={record?.payment_status}
          statusId={record?.payment_status_id}
          statusType={"paymentStatus"}
        />
      ),
    },
    ...(user?.role?.id == 31 ? [{ title: "Dealer", field: "dealer" }] : []),
    ...(user?.role?.id == 2
      ? [
          {
            title: "Actions",
            field: "action",
            body: (record, field) =>
              record?.payment_status_id == 980 ? (
                <Button
                  className="btn btn-text btn-link"
                  onClick={(e) => handleCheckStatus(e, record)}
                  style={{ whiteSpace: "nowrap" }}
                  loading={
                    record?.razorpay_order_id == orderId
                      ? checkStatusIsLoading
                      : false
                  }
                >
                  Check Status
                </Button>
              ) : (
                "--"
              ),
          },
        ]
      : []),
  ];

  const handleFormSubmit = (values) => {
    // console.log("form values", values);
    orderCreateMutate(
      {
        dealerCode: user?.role?.id == 31 ? values.dealerCode.name : user?.code, // IF USER IS DEALER FINANCE ADMIN THEN SELECTED DEALER OTHERWISE LOGGED IN DEALER
        amount: values.amount,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setVisible(false);
            reset();
            // console.log("order creation response", res?.data?.amount);
            const razorpayOptions = {
              key: res?.data.token,
              amount: parseFloat(res?.data?.amount * 100), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
              currency: "INR",
              name: "Ki Mobility Solutions",
              description: res?.data?.razorpayDescription,
              image: res?.data?.image,
              order_id: res?.data?.transaction_id,
              handler: function (response) {
                // console.log("razorpay success response", response);
                paymentSuccessMutate(response, {
                  onSuccess: (res) => {
                    refetch();
                    if (res?.data?.success) {
                      toast.success("Payment Successfull");
                    } else {
                      toast.error(res?.data?.error);
                    }
                  },
                });
              },
              modal: {
                ondismiss: function () {
                  refetch();
                },
              },
              prefill: res?.data?.prefill, //For reference
            };

            const rzp = new Razorpay(razorpayOptions);
            rzp.open();
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

  const handleCancel = () => {
    setVisible(false);
    reset();
  };

  const filterData = {
    transactiontype: tranactiontypedata?.data?.data?.map((type) => {
      return {
        code: type?.id,
        label: type?.name,
      };
    }),
    paymentstauts: paymentstatusdata?.data?.data?.map((type) => {
      return {
        code: type?.id,
        label: type?.name,
      };
    }),
  };
  const handleApplyFilter = (values) => {
    // console.log("filter values", values);
    setPagination({
      limit: 10,
      offset: 0,
    });
    setFilters({
      ...(values?.period && {
        period: `${moment(values?.period?.value[0]).format(
          "DD-MM-YYYY"
        )} - ${moment(values?.period?.value[1]).format("DD-MM-YYYY")}`,
      }),
      ...(values?.transactionTypeId && {
        transactionTypeId: String(values?.transactionTypeId?.code),
      }),
      ...(values?.paymentStatusId && {
        paymentStatusId: String(values?.paymentStatusId?.code),
      }),
      ...(values?.utrNumber && { utrNumber: values?.utrNumber?.value }),
    });
  };
  const validatePositiveNumber = (value) => {
    if (value > 0) {
      return true;
    }
    return "Please enter amount greater than 0";
  };

  const [exportVisible, setExportVisible] = useState(false);

  const handleExport = () => {
    setExportVisible(true);
  };

  const { mutate: exportMutate, isLoading: exportIsLoading } = useMutation(
    exportDealerWalletLogs
  );

  const handleExportSubmit = (values, reset) => {
    exportMutate(
      {
        roleId: user?.role?.id,
        ...(user?.role?.id == 2 && { dealerCode: user?.code }),
        filterPeriod: `${moment(values?.startDate, "YYYY-MM-DD").format(
          "DD-MM-YYYY"
        )} - ${moment(values?.endDate, "YYYY-MM-DD").format("DD-MM-YYYY")}`,
        transactionTypeId: values?.transactionType?.id,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            setExportVisible(false);
            reset();
            if (res?.data?.exportUrl) {
              download(`${res?.data?.exportUrl}`, "walletLogReport");
            }
          } else {
            if (res?.data?.error) {
              toast.error(res?.data?.error);
            } else {
              res?.data?.errors.forEach((el) => toast.error(el));
            }
          }
        },
      }
    );
  };

  return (
    <div className="page-wrap">
      <div className="page-body">
        <TableWrapper
          title={
            <>
              My Wallet - Current Balance :{" "}
              {!walletBalanceIsLoading && walletBalanceMutate?.data?.success ? (
                <CurrencyFormat
                  amount={
                    walletBalanceMutate?.data?.dealer?.wallet_balance_amount ||
                    0
                  }
                  color={"#4DB86B"}
                />
              ) : (
                "--"
              )}
            </>
          }
          onPaginationChange={handlepageChange}
          action={true}
          loading={isFetching}
          columns={columns}
          data={data?.data?.data}
          totalRecords={data?.data?.count}
          addbtn={{ label: "Topup", icon: false, onClick: handleTopup }}
          onSearch={handleSearchChange}
          filterFields={{
            filterFields: [
              "paymentdate",
              "transactiontype",
              "paymentstauts",
              "utrno",
            ],
            filterData: filterData,
          }}
          onFilterApply={handleApplyFilter}
          onExport={handleExport}
        />
        <ExportDialog
          visible={exportVisible}
          setVisible={setExportVisible}
          loading={exportIsLoading}
          onSubmit={handleExportSubmit}
          transactionType={tranactiontypedata?.data?.data}
          formats={["xlsx"]}
        />
      </div>
      <Dialog
        header={
          <div className="dialog-header">
            <div className="dialog-header-title">Wallet Topup</div>
          </div>
        }
        visible={visible}
        position={"bottom"}
        className="w-372"
        onHide={() => {
          setVisible(false);
          reset();
        }}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
      >
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="row row-gap-3_4">
            {user?.role?.id == 31 && (
              <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label filter-label">Dealer Code</label>
                  <Controller
                    name="dealerCode"
                    control={control}
                    rules={{ required: "Dealer Code is required." }}
                    render={({ field, fieldState }) => (
                      <>
                        <Dropdown
                          value={field.value}
                          className="form-control-select"
                          optionLabel="name"
                          placeholder="Select a Dealer Code"
                          onChange={(e) => field.onChange(e.value)}
                          options={topupDealerData?.data?.data?.map((el) => ({
                            name: el?.code,
                            id: el?.code,
                          }))}
                          filter
                          filterBy="name"
                        />
                        <div className="p-error">
                          {errors && errors[field.name]?.message}
                        </div>
                      </>
                    )}
                  />
                </div>
              </div>
            )}
            <div className="col-md-12">
              <div className="form-group">
                <label className="form-label">Amount</label>
                <Controller
                  name="amount"
                  control={control}
                  rules={{
                    required: "Amount is Required",
                    validate: validatePositiveNumber,
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText
                        placeholder="Enter Amount"
                        {...field}
                        keyfilter={"pnum"}
                      />
                      <div className="p-error">
                        {errors && errors[field.name]?.message}
                      </div>
                    </>
                  )}
                />
              </div>
            </div>

            <div className="d-flex gap-2">
              <Button
                className="btn btn-white ms-auto"
                onClick={handleCancel}
                type="button"
              >
                Cancel
              </Button>
              <Button
                className="btn btn-primary gap-3_4"
                type="submit"
                loading={orderCreationIsLoading}
              >
                Pay Now
              </Button>
            </div>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default Wallet;
