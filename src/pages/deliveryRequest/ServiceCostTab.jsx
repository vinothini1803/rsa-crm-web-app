import React, { useRef, useState } from "react";
import PaymentNote from "./PaymentNote";
import { OverlayPanel } from "primereact/overlaypanel";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import TimerChip from "../../components/common/TimerChip";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { useMutation, useQuery } from "react-query";
import { updateActivityCharge } from "../../../services/assignServiceProvider";
import { Calendar } from "primereact/calendar";
import { toast } from "react-toastify";
import moment from "moment";
import {
  additionalCharges,
  dealerData,
  paymentMethod,
} from "../../../services/masterServices";
import {
  makePayment,
  payBalanceAmount,
  updateActualKM,
  walletBalance,
} from "../../../services/deliveryRequestViewService";
import { useSelector } from "react-redux";
import { CurrentUser } from "../../../store/slices/userSlice";
import { Dialog } from "primereact/dialog";
import PaymentMethodCard from "./PaymentMethodCard";
import {
  DialogCloseSmallIcon,
  WalletIcon,
  CalendarTimeIcon,
  InfoDarkIcon,
} from "../../utills/imgConstants";

import { acceptAndPay } from "../../../services/deliveryRequestViewService";
import CurrencyFormat from "../../components/common/CurrencyFormat";
import {
  aspRejectedCcDetailReason,
  slaViolateReasons,
} from "../../../services/masterServices";
const ServiceCostTab = ({
  activityDetail,
  aspRefetch,
  caseStatusId,
  advancePay,
}) => {
  // console.log("ServiceCostTab caseStatusId", caseStatusId);
  const TotalKMpanel = useRef(null);
  const kmpanel = useRef(null);
  const chargePanel = useRef(null);
  const AddChargeMenu = useRef(null);
  const { userTypeId } = useSelector(CurrentUser);
  const [items, setItems] = useState();
  const [selectedOption, setSelectedOption] = useState([]);
  const user = useSelector(CurrentUser);
  const [selectPayment, setSelectPayment] = useState(1);
  const [slaViolateReasonId, setSlaViolationReasonId] = useState(null);
  const [paymentVisible, setPaymentVisible] = useState(false);
  const [paymenttype, setPaymentType] = useState("");
  const [isExceededSla, setIsExceededSla] = useState(null);
  const slaTime = activityDetail?.extras?.slaSettings;
  const [isChargeSubmitting, setIsChargeSubmitting] = useState(false);
  const [isKmSubmitting, setIsKmSubmitting] = useState(false);

  // console.log("ServiceCostTab activityDetail =>", activityDetail, user?.code);

  const { mutate, isLoading } = useMutation(updateActualKM);
  const defaultValues = {
    totalKm: "",
    aspWaitingTime: "",
    totalKmReason: "",
    isAspAcceptedCcDetail: undefined,
    aspRejectedCcDetailReasonId: "",
  };

  //KM Form
  const {
    handleSubmit: handleKMSubmit,
    setValue,
    control: kmControl,
    formState: kmFormState,
  } = useForm();
  //charge Form
  const {
    handleSubmit,
    control,
    setValue: setChargeValue,
    formState: { errors },
  } = useForm();

  //sla form
  const {
    handleSubmit: handleSlaSubmit,
    control: slaControl,
    setValue: setSlaReasonValue,
    formState: { errors: errorSla },
  } = useForm({
    defaultValues: {
      slaViolateReasonId: "",
    },
  });

  const selectedIsAspAcceptedCcDetail = useWatch({
    control: kmControl,
    name: "isAspAcceptedCcDetail",
  });
  // console.log("selectedIsAspAcceptedCcDetail", selectedIsAspAcceptedCcDetail);

  const { data: paymentMethodListData } = useQuery(["paymentmethod"], () =>
    paymentMethod()
  );
  const { data: reasons = [] } = useQuery(
    ["reasonList", user?.role.id],
    () => slaViolateReasons({ apiType: "dropdown", roleId: user?.role.id }),
    {
      enabled: paymentVisible,
    }
  );
  // console.log("ActivityDetail", activityDetail?.sentApprovalAt);
  const {
    mutate: makepaymentMutate,
    data: paymentDetailsData,
    isLoading: paymentLoading,
  } = useMutation(makePayment);
  const { fields, remove, append } = useFieldArray({
    control,
    name: "chargesData",
  });
  const {
    mutate: walletBalanceMutate,
    isLoading: walletBalanceLoading,
    data: walletDetails,
  } = useMutation(walletBalance);
  const {
    mutate: addChargeMutate,
    isLoading: addChargeLoading,
    data: chargesData,
  } = useMutation(updateActivityCharge);

  const { mutate: paymentMethodMutate, isLoading: paymentMethodMutateLoading } =
    useMutation(acceptAndPay);
  const { mutate: balanceMutate, isLoading: balanceMutateLoading } =
    useMutation(payBalanceAmount);
  const { data: additinalChargeList } = useQuery(
    ["addtinalCharge"],
    () =>
      additionalCharges({
        limit: 10,
        offset: 0,
      }),
    {
      onSuccess: (res) => {
        // console.log("addtinal charge res", res, res?.data?.data);
        setItems(
          res?.data?.data?.map((item) => {
            return {
              key: Number(item.id),
              label: item.name,
              name: item.name,
              command: handleSelectedOptions,
            };
          })
        );
      },
      refetchOnWindowFocus: false, //To avoid again charge add on window focus
    }
  );

  const { data: aspRejectedCcDetailReasonData } = useQuery(
    ["aspRejectedCcDetailReasonDropdown"],
    () =>
      aspRejectedCcDetailReason({
        apiType: "dropdown",
        offset: 0,
        limit: 10,
      })
  );

  // console.log(
  //   "aspRejectedCcDetailReasonData => ",
  //   aspRejectedCcDetailReasonData?.data
  // );

  const handleApprove = () => {
    const isExceeded = isSlaExceeded();
    setIsExceededSla(isExceeded);
    walletBalanceMutate(
      {
        dealerCode: user?.code,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            setPaymentVisible(true);
            setPaymentType("advance");
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
  // console.log("user", user);
  const handleSelectedOptions = ({ originalEvent, item }) => {
    // console.log("handleSelectedOptions", item);
    append({ amount: "" });
    setSelectedOption((prev) => [
      ...prev,
      { key: item.key, label: item.label, name: item.name },
    ]);
    // console.log("selected item", item);

    // console.log(
    //   "handleSelectedOptions items",
    //   items?.filter((menu) => menu.key !== item.key)
    // );
    // console.log("items", items);

    setItems((prev) => prev?.filter((el) => item.key !== el.key));
  };

  const handleRemove = (e, item, i) => {
    remove(i); //To remove from Field array
    // console.log("Removed Item => ", item);
    const removeoption = selectedOption.filter(
      (option) => option?.key !== item?.key
    );
    // console.log("removeoption", removeoption);
    setSelectedOption(removeoption);
    setItems([
      {
        key: item?.key,
        label: item?.label,
        name: item?.name,
        command: handleSelectedOptions,
      },
      ...items,
    ]);
  };

  const handlePayBalance = () => {
    walletBalanceMutate(
      {
        dealerCode: user?.code,
      },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            setPaymentVisible(true);
            setPaymentType("balance");
          } else {
            if (res?.data?.error) {
              toast.error(res?.data?.error);
            } else {
              res?.data?.errors.forEach((err) => toast.error(err));
            }
          }
        },
      }
    );
  };

  // const {handleSubmit:handle,control,}

  const ChargeCard = ({
    chargeType,
    serviceCharge,
    addtionalCharges,
    actualClientWaitingCharge,
    totalAmount,
  }) => (
    <div className="charge-detail-card">
      <div className="charge-detail-card-body">
        <div className="charges-main-detail">
          <div className="charge-title">Service Charges</div>
          <div className="charge-info">
            <div className="charge-sub-title">Service Cost</div>
            <div className="charge-amount">
              {serviceCharge ? <CurrencyFormat amount={serviceCharge} /> : "--"}
            </div>
          </div>
        </div>
        {(addtionalCharges?.length > 0 ||
          (chargeType == "actual" && actualClientWaitingCharge)) && (
          <div className="charges-main-detail">
            <div className="charge-title">Additional Charges</div>
            {addtionalCharges?.map((charge) => (
              <div className="charge-info">
                <div className="charge-sub-title"> {charge?.chargeName}</div>
                <div className="charge-amount">
                  <CurrencyFormat amount={charge?.amount} />
                </div>
              </div>
            ))}
            {chargeType == "actual" && actualClientWaitingCharge && (
              <div className="charge-info">
                <div className="charge-sub-title">Waiting Charges</div>
                <div className="charge-amount">
                  <CurrencyFormat amount={actualClientWaitingCharge} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="charge-detail-card-footer">
        <div className="total-amount-title">Total Amount</div>
        <div className="total-amount-value">
          {totalAmount ? <CurrencyFormat amount={totalAmount} /> : "--"}{" "}
        </div>
      </div>
    </div>
  );

  const handleKMFormSubmit = (values) => {
    if (isKmSubmitting) {
      return; // Prevent Multiple Submissions
    }
    setIsKmSubmitting(true); // Disable the button
    // console.log("KM values", values);
    const inputDateString = values?.aspWaitingTime
      ? moment(values?.aspWaitingTime)
      : undefined;
    const startOfDayMoment = inputDateString
      ? inputDateString.clone().startOf("day")
      : undefined;
    // console.log('newTimeMoment', inputDateString);
    // console.log('newTimeMoment', startOfDayMoment);
    // console.log('newTimeMoment', inputDateString.diff(startOfDayMoment, 'minutes'));
    setTimeout(() => {
      mutate(
        {
          activityId: activityDetail?.activityId,
          caseDetailId: activityDetail?.caseDetail?.id || null,
          aspId: activityDetail?.asp?.id,
          aspCode: activityDetail?.asp?.code,
          clientId: activityDetail?.caseDetail?.clientId,
          totalKm: String(values?.totalKm),
          totalKmReason: values?.totalKmReason ? values?.totalKmReason : "",
          subServiceId: activityDetail?.caseDetail?.subServiceId,
          subServiceName: activityDetail?.caseDetail?.subService,
          createdDate: activityDetail?.caseDetail?.createdDate,
          caseTypeId: activityDetail?.caseDetail?.typeId,
          logTypeId: 240,
          // isAspAcceptedCcDetail: values.isAspAcceptedCcDetail == 'true' ? 1 : 0,
          isAspAcceptedCcDetail: 1,
          aspRejectedCcDetailReasonId:
            values.isAspAcceptedCcDetail == "false"
              ? values?.aspRejectedCcDetailReasonId
              : null,
          ...(inputDateString && {
            aspWaitingTimeInMinutes: inputDateString.diff(
              startOfDayMoment,
              "minutes"
            ),
          }),
        },
        {
          onSuccess: (res) => {
            if (res?.data?.success) {
              kmpanel.current.hide();
              toast.success(res?.data?.message);
              setIsKmSubmitting(false); // Re-enable the button
              aspRefetch.refetch();
            } else {
              setIsKmSubmitting(false); // Re-enable the button
              if (res?.data?.error) {
                toast.error(res?.data?.error);
              } else {
                res?.data?.errors?.forEach((el) => toast.error(el));
              }
            }
          },
        }
      );
    }, 1000);
  };
  // Add charges function
  const handleAddChargeSubmit = (values) => {
    // console.log("charge submit values", values.chargesData);
    if (isChargeSubmitting) {
      return; // Prevent multiple submissions
    }
    setIsChargeSubmitting(true); // Disable the button

    if (values) {
      setTimeout(() => {
        addChargeMutate(
          {
            ...values,
            chargesData: values?.chargesData?.map((data, i) => {
              return {
                ...data,
                chargeId: selectedOption[i].key,
              };
            }),
            totalAdditionalCharges: String(
              values?.chargesData?.reduce((a, item) => {
                return Number(item.amount) + a;
              }, 0)
            ),
            activityId: activityDetail?.activityId,
            caseDetailId: activityDetail?.caseDetail?.id || null,
            aspId: activityDetail?.asp?.id,
            typeId: 151,
            logTypeId: 240,
          },
          {
            onSuccess: (res) => {
              // console.log("response", res?.data.chargesData);

              if (res?.data?.success) {
                chargePanel.current.hide();
                toast.success(res?.data?.message);

                if (activityDetail?.actualTotalKm) {
                  mutate(
                    {
                      activityId: activityDetail?.activityId,
                      caseDetailId: activityDetail?.caseDetail?.id || null,
                      aspId: activityDetail?.asp?.id,
                      aspCode: activityDetail?.asp?.code,
                      clientId: activityDetail?.caseDetail?.clientId,
                      totalKmReason: activityDetail?.actualTotalKmReason
                        ? activityDetail?.actualTotalKmReason
                        : "",
                      totalKm: activityDetail?.actualTotalKm,
                      subServiceId: activityDetail?.caseDetail?.subServiceId,
                      subServiceName: activityDetail?.caseDetail?.subService,
                      createdDate: activityDetail?.caseDetail?.createdDate,
                      caseTypeId: activityDetail?.caseDetail?.typeId,
                      logTypeId: 240,
                      isAspAcceptedCcDetail:
                        activityDetail?.isAspAcceptedCcDetail == true ? 1 : 0,
                      aspRejectedCcDetailReasonId:
                        activityDetail?.aspRejectedCcDetailReasonId,
                      ...(activityDetail?.aspWaitingTime && {
                        aspWaitingTimeInMinutes: activityDetail?.aspWaitingTime,
                      }),
                    },
                    {
                      onSuccess: (res) => {
                        setIsChargeSubmitting(false); // Re-enable the button
                        if (res?.data?.success) {
                          aspRefetch?.refetch();
                        } else {
                          if (res?.data?.error) {
                            toast.error(res?.data?.error);
                          } else {
                            res?.data?.errors?.forEach((err) =>
                              toast.error(err)
                            );
                          }
                        }
                      },
                    }
                  );
                } else {
                  setIsChargeSubmitting(false); // Re-enable the button
                  aspRefetch.refetch();
                }
              } else {
                setIsChargeSubmitting(false); // Re-enable the button
                if (res?.data?.error) {
                  toast.error(res?.data?.error);
                } else {
                  res?.data?.errors?.forEach((el) => toast.error(el));
                }
              }
            },
          }
        );
      }, 2000);
    } else {
      setIsChargeSubmitting(false); // Re-enable the button
    }
  };

  /* Cancel charge function*/
  const handleCancleCharge = () => {
    chargePanel.current.hide();
    setSelectedOption([]);
    setItems(
      additinalChargeList?.data?.data?.map((item) => {
        return {
          key: Number(item.id),
          label: item.name,
          name: item.name,
          command: handleSelectedOptions,
        };
      })
    );
    // addChargeReset({
    //   chargesData: [],
    // });
  };
  const handleAddEditCharge = (e, type) => {
    chargePanel.current.show(e);
    if (type == "Edit") {
      // console.log("edit mode");
      //To Add Dynamic Field on Edit
      setSelectedOption(
        activityDetail?.chargesDetail
          ?.filter((charge) => charge.typeId == 151)
          ?.map((chargeData) => {
            return {
              key: Number(chargeData.chargeId),
              label: chargeData.chargeName,
              name: chargeData.chargeName,
            };
          })
      );
      //To Fill Field on Edit Charges
      setChargeValue(
        "chargesData",
        activityDetail?.chargesDetail
          ?.filter((charge) => charge.typeId == 151)
          ?.map((element, i) => {
            return { amount: element?.amount };
          })
      );

      //To set for chargees Menu on Edit
      setItems(
        additinalChargeList?.data?.data
          ?.filter(
            (el) =>
              !activityDetail?.chargesDetail
                ?.filter((charge) => charge.typeId == 151)
                ?.some((charge) => el.id == charge?.chargeId)
          )
          ?.map((charge) => {
            return {
              key: Number(charge.id),
              label: charge.name,
              name: charge.name,
              command: handleSelectedOptions,
            };
          })
      );
    }
  };

  const AvailablePaymentMethods = paymentMethodListData?.data?.data
    ?.slice(0, 1)
    ?.map((item) => {
      return {
        ...item,
        MethodImg: WalletIcon,
        basicPrice: walletDetails?.data.dealer?.wallet_balance_amount
          ? walletDetails?.data.dealer?.wallet_balance_amount
          : "--",
        MethodDesc: "Wallet Balance",
      };
    });

  const handleBack = () => {
    setPaymentVisible(false);
    setVisible(true);
  };
  //  PaymentDetail based on the "paymentTypeId" paymentTypeId-->170:advancepaid 171:balance 172:excess
  const AdvanceDetail = activityDetail?.transactions?.find(
    (a, i) => a?.paymentTypeId == 170
  );
  const BalanceDetail = activityDetail?.transactions?.find(
    (a, i) => a?.paymentTypeId == 171
  );

  const ExcessDetail = activityDetail?.transactions?.find(
    (a, i) => a?.paymentTypeId == 172
  );
  // console.log("payment Detail", AdvanceDetail, BalanceDetail, ExcessDetail);
  // console.log("activityDetail", activityDetail);

  const onPayment = () => {
    const isExceeded = isSlaExceeded();
    setIsExceededSla(isExceeded);
    if (isExceededSla) {
      handleSlaSubmit(handlePay)();
    } else {
      handlePay({});
    }
  };
  const handlePay = (value) => {
    if (selectPayment) {
      if (paymenttype == "balance") {
        /* makepaymentMutate(
          {
            dealerCode: user?.code,
            amount:
              paymenttype == "balance"
                ? BalanceDetail?.amount
                : activityDetail?.estimatedTotalAmount,
            vin: activityDetail?.caseDetail?.vin,
            type: paymenttype,
            requestId: activityDetail?.caseDetail?.caseNumber,
          },
          {
            onSuccess: (res) => {
              if (res?.data?.success) {
                toast.success(res?.data?.message);

                balanceMutate(
                  {
                    activityId: activityDetail?.activityId, //service provider activity Id
                    paymentMethodId: selectPayment,
                    paidByDealerId: user?.entityId,
                  },
                  {
                    onSuccess: (res) => {
                      if (res) {
                        console.log("method response", res);
                        toast.success(res.data.message);
                        setPaymentVisible(false);
                        aspRefetch.refetch();
                      } else {
                        toast.success(res.data.error);
                      }
                    },
                  }
                );
              } else {
                toast.error(res?.data?.error);
              }
            },
          }
        ); */
        balanceMutate(
          {
            activityId: activityDetail?.activityId, //service provider activity Id
            paymentMethodId: selectPayment,
            paidByDealerId: user?.entityId,
          },
          {
            onSuccess: (res) => {
              if (res?.data?.success) {
                // console.log("method response", res);
                toast.success(res.data.message);
                setPaymentVisible(false);
                aspRefetch?.refetch();
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
      } else {
        paymentMethodMutate(
          {
            activityId: activityDetail?.activityId, //service provider activity Id
            paymentMethodId: selectPayment,
            paidByDealerId: user?.entityId,
            ...(isExceededSla && {
              slaViolateReasonId: value?.slaViolateReasonId?.id,
            }),
          },
          {
            onSuccess: (res) => {
              if (res?.data?.success) {
                // console.log("method response", res);
                toast.success(res.data.message);
                setPaymentVisible(false);
                aspRefetch?.refetch();
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
      }
    }
  };

  const paymentNote = {
    // 7---->payment Successful
    ...(user?.entityId == BalanceDetail?.paidByDealerId
      ? {
          7: {
            type: "success",
            description:
              user?.entityId == AdvanceDetail?.paidByDealerId ? (
                <div>
                  You have made an advance payment of
                  <span className="amount-value">
                    {" "}
                    <CurrencyFormat amount={AdvanceDetail?.amount} />
                  </span>{" "}
                  on {AdvanceDetail?.updatedAt} using your wallet. As actual
                  spending is more than estimated, you have made a payment of{" "}
                  <span className="amount-value">
                    {" "}
                    <CurrencyFormat amount={BalanceDetail?.amount} />
                  </span>{" "}
                  on {BalanceDetail?.updatedAt} using your wallet.
                </div>
              ) : (
                <div>
                  The advance payment of
                  <span className="amount-value">
                    {" "}
                    <CurrencyFormat amount={AdvanceDetail?.amount} />
                  </span>{" "}
                  on {AdvanceDetail?.updatedAt} using wallet. As actual spending
                  is more than estimated, you have made a payment of{" "}
                  <span className="amount-value">
                    {" "}
                    <CurrencyFormat amount={BalanceDetail?.amount} />
                  </span>{" "}
                  on {BalanceDetail?.updatedAt} using your wallet.
                </div>
              ),
          },
        }
      : {}),

    // 10---->Adavnce Paid
    ...(user?.entityId == AdvanceDetail?.paidByDealerId
      ? {
          10: {
            type: "info",
            description: (
              <div>
                You have made an advance payment of{" "}
                <span className="amount-value">
                  <CurrencyFormat amount={AdvanceDetail?.amount} />
                </span>{" "}
                on {AdvanceDetail?.updatedAt} using your wallet.
              </div>
            ),
          },
        }
      : {}),

    //11---->Balance payment pending

    11: {
      type: "warning",
      description:
        user?.entityId == AdvanceDetail?.paidByDealerId ? (
          <div>
            You have made an advance payment of{" "}
            <span className="amount-value">
              <CurrencyFormat amount={AdvanceDetail?.amount} />
            </span>{" "}
            on {AdvanceDetail?.updatedAt} using your wallet. As actual spending
            is more than estimated,you have to make a payment of{" "}
            <span className="amount-value">
              <CurrencyFormat amount={BalanceDetail?.amount} />
            </span>
            .
          </div>
        ) : (
          <div>
            The advance payment of{" "}
            <span className="amount-value">
              <CurrencyFormat amount={AdvanceDetail?.amount} />
            </span>{" "}
            on {AdvanceDetail?.updatedAt} using wallet. As actual spending is
            more than estimated,the dealer who paid the advance has to make a
            payment of{" "}
            <span className="amount-value">
              <CurrencyFormat amount={BalanceDetail?.amount} />
            </span>
            .
          </div>
        ),
    },
    //12--->Excess Amount Credit pending
    ...(user?.entityId == AdvanceDetail?.paidByDealerId
      ? {
          12: {
            type: "info",
            description: (
              <div>
                You have made an advance payment of{" "}
                <span className="amount-value">
                  <CurrencyFormat amount={AdvanceDetail?.amount} />
                </span>{" "}
                on {AdvanceDetail?.updatedAt} using your wallet. As actual
                spending is less than estimated, we will credit the excess
                amount to your wallet on or before 7 working days.
              </div>
            ),
          },
        }
      : {}),
  };

  const validatePositiveNumber = (value) => {
    if (value > 0) {
      return true;
    }
    return "Please enter a KM greater than 0";
  };

  //SLA Deadline
  const isSlaExceeded = () => {
    const slaForTypeId363 = slaTime?.find(
      (item) => item.typeId === 363
    )?.timeInMilliSeconds;
    const createdAt = activityDetail?.sentApprovalAtInMilliSeconds;
    const slaTimeMilliSeconds = slaForTypeId363;

    // If createdAt or slaTime is not valid, return false
    if (!createdAt || !slaTimeMilliSeconds) {
      console.error("Invalid createdAt or slaTimeMilliSeconds");
      return false;
    }

    // Create the SLA deadline by adding the SLA time to the createdAt timestamp
    const slaDeadline = new Date(createdAt + slaTimeMilliSeconds);

    // Get the current time
    const currentTime = new Date();

    return currentTime > slaDeadline;
  };

  return (
    <div className="service-cost-main-container">
      <div className="service-cost-tab-container">
        <div className="cost-container">
          <div className="cost-detail">
            <div className="cost-title">Estimated Cost</div>
            <div className="cost-value">
              <CurrencyFormat amount={activityDetail?.estimatedTotalAmount} />{" "}
              <span className="include-gst">Incl.GST</span>
            </div>
          </div>
          <div className="cost-detail">
            <div className="d-flex align-items-cnter gap-1">
              <div className="cost-title">Estimated KM</div>
              {userTypeId == 140 ? null : (
                <img
                  src={InfoDarkIcon}
                  style={{ cursor: "pointer" }}
                  onClick={(e) => TotalKMpanel.current.toggle(e)}
                />
              )}
            </div>
            <div className="cost-value-km">
              {activityDetail?.estimatedTotalKm} KM
            </div>
            <OverlayPanel ref={TotalKMpanel} className="form-overlay-panel">
              <div className="towing-charges-content px-2_3">
                <div className="towing-charges-title">
                  ASP To Pickup Distance
                </div>
                <div className="towing-charges-amount">
                  {activityDetail?.estimatedAspToPickupKm} KM
                </div>
              </div>
              <div className="towing-charges-content px-2_3">
                <div className="towing-charges-title">
                  Pickup To Drop Distance
                </div>
                <div className="towing-charges-amount">
                  {activityDetail?.estimatedPickupToDropKm} KM
                </div>
              </div>
              <div className="towing-charges-content px-2_3">
                <div className="towing-charges-title">Drop To ASP Distance</div>
                <div className="towing-charges-amount">
                  {activityDetail?.estimatedDropToAspKm} KM
                </div>
              </div>

              {activityDetail?.estimatedRouteDeviationKm ? (
                <div className="towing-charges-content px-2_3">
                  <div className="towing-charges-title">
                    Route Deviation Distance
                  </div>
                  <div className="towing-charges-amount">
                    {activityDetail?.estimatedRouteDeviationKm} KM
                  </div>
                </div>
              ) : null}
            </OverlayPanel>
          </div>

          {AdvanceDetail && AdvanceDetail?.paymentStatusId == 191 && (
            <div className="cost-detail">
              <div className="cost-title">Estimated Amount Paid</div>
              <div className="cost-value">
                {AdvanceDetail ? (
                  <>
                    <CurrencyFormat amount={AdvanceDetail?.amount} />{" "}
                    <span className="include-gst">Incl.GST</span>
                  </>
                ) : (
                  "--"
                )}
              </div>
            </div>
          )}

          <div className="cost-detail">
            <div className="cost-title">Actual Cost</div>
            <div className="cost-value">
              {" "}
              {activityDetail?.actualTotalAmount ? (
                <>
                  <CurrencyFormat amount={activityDetail?.actualTotalAmount} />{" "}
                  <span className="include-gst">Incl.GST</span>
                </>
              ) : (
                "--"
              )}
            </div>
          </div>
          <div className="cost-detail">
            <div className="cost-title">Actual KM</div>

            <div className="cost-value-km">
              {activityDetail?.actualTotalKm ? (
                `${activityDetail?.actualTotalKm} KM`
              ) : user?.userTypeId == 141 &&
                caseStatusId == 2 &&
                activityDetail?.chargesDetail?.some(
                  (charge) => charge.typeId == 151
                ) &&
                ((activityDetail?.activityStatusId == 3 &&
                  // [16, 17, 18].includes(activityDetail?.activityAppStatusId)) ||
                  [16, 18].includes(activityDetail?.activityAppStatusId)) ||
                  (activityDetail?.activityStatusId == 4 &&
                    activityDetail?.financeStatusId == 2)) ? (
                <a
                  className="text-blue text-decoration-underline"
                  onClick={(e) => kmpanel.current.show(e)}
                >
                  Add KM
                </a>
              ) : (
                "--"
              )}
              {user?.userTypeId == 141 &&
                caseStatusId == 2 &&
                activityDetail?.chargesDetail?.some(
                  (charge) => charge.typeId == 151
                ) &&
                activityDetail?.actualTotalKm &&
                (activityDetail?.activityStatusId == 13 ||
                  activityDetail?.activityStatusId == 11 ||
                  activityDetail?.activityStatusId == 12) && (
                  <a
                    className="text-blue text-decoration-underline"
                    onClick={(e) => {
                      kmpanel.current.show(e);
                      setValue(
                        "totalKm",
                        Number(activityDetail?.actualTotalKm)
                      );
                      //  setValue(
                      //   "totalKmReason",
                      //   activityDetail?.actualTotalKmReason
                      // );
                      setValue(
                        "isAspAcceptedCcDetail",
                        activityDetail?.isAspAcceptedCcDetail == true
                          ? "true"
                          : "false"
                      );
                      if (activityDetail?.aspRejectedCcDetailReasonId) {
                        setValue(
                          "aspRejectedCcDetailReasonId",
                          activityDetail?.aspRejectedCcDetailReasonId
                        );
                      }
                      if (activityDetail?.aspWaitingTime) {
                        const inputMoment = moment();
                        const startOfDayMoment = inputMoment
                          .clone()
                          .startOf("day");
                        const newTimeMoment = startOfDayMoment.add(
                          Number(activityDetail?.aspWaitingTime),
                          "minutes"
                        );
                        // console.log('newTimeMoment', inputMoment?._d);
                        // console.log('newTimeMoment', startOfDayMoment?._d);
                        // console.log('newTimeMoment', newTimeMoment?._d);
                        setValue("aspWaitingTime", newTimeMoment?._d);
                      }
                    }}
                  >
                    Edit KM
                  </a>
                )}
            </div>
          </div>
        </div>
        <div className="estimation-container">
          <div className="charge-type">
            <div className="estimation-title">Estimated</div>
            <ChargeCard
              chargeType="estimated"
              serviceCharge={activityDetail?.estimatedServiceCost}
              addtionalCharges={activityDetail?.chargesDetail?.filter(
                (charge) => charge.typeId == 150
              )}
              totalAmount={activityDetail?.estimatedTotalAmount}
            />
          </div>

          <div className="charge-type">
            <div className="d-flex">
              <div className="estimation-title">Actual</div>
              {user?.userTypeId == 141 &&
                caseStatusId == 2 &&
                !activityDetail?.chargesDetail?.some(
                  (charge) => charge.typeId == 151
                ) &&
                ((activityDetail?.activityStatusId == 3 &&
                  (activityDetail?.activityAppStatusId == 16 ||
                    activityDetail?.activityAppStatusId == 18)) ||
                  (activityDetail?.activityStatusId == 4 &&
                    activityDetail?.financeStatusId == 2) ||
                  activityDetail?.activityStatusId == 13 ||
                  activityDetail?.activityStatusId == 11 ||
                  activityDetail?.activityStatusId == 12) && (
                  <a
                    className="ms-auto text-blue text-decoration-underline"
                    onClick={(e) => handleAddEditCharge(e, "Add")}
                  >
                    Add Charge
                  </a>
                )}

              {user?.userTypeId == 141 &&
                caseStatusId == 2 &&
                activityDetail?.chargesDetail?.some(
                  (charge) => charge.typeId == 151
                ) &&
                ((activityDetail?.activityStatusId == 3 &&
                  (activityDetail?.activityAppStatusId == 16 ||
                    activityDetail?.activityAppStatusId == 18)) ||
                  (activityDetail?.activityStatusId == 4 &&
                    activityDetail?.financeStatusId == 2) ||
                  activityDetail?.activityStatusId == 13 ||
                  activityDetail?.activityStatusId == 11 ||
                  activityDetail?.activityStatusId == 12) && (
                  <a
                    className="ms-auto text-blue text-decoration-underline"
                    onClick={(e) => handleAddEditCharge(e, "Edit")}
                  >
                    Edit Charge
                  </a>
                )}
            </div>

            <ChargeCard
              chargeType="actual"
              serviceCharge={activityDetail?.actualServiceCost}
              addtionalCharges={activityDetail?.chargesDetail?.filter(
                (charge) => charge.typeId == 151
              )}
              actualClientWaitingCharge={
                activityDetail?.actualClientWaitingCharge
              }
              totalAmount={activityDetail?.actualTotalAmount}
            />
          </div>
        </div>
      </div>

      {user?.userTypeId == 140 &&
        Object.keys(paymentNote)?.includes(
          String(activityDetail?.activityStatusId)
        ) &&
        AdvanceDetail &&
        (BalanceDetail !== undefined ||
          ExcessDetail !== undefined ||
          activityDetail?.activityStatusId == 10 ||
          activityDetail?.activityStatusId == 14) && (
          <div className="payment-info-note-container">
            <PaymentNote
              description={
                paymentNote[activityDetail?.activityStatusId]?.description
              }
              type={paymentNote[activityDetail?.activityStatusId]?.type}
            />
          </div>
        )}

      {user?.userTypeId == 140 && (
        <div className="service-cost-tab-footer">
          {(caseStatusId == 1 || caseStatusId == 2) &&
            activityDetail?.activityStatusId == 9 &&
            advancePay && (
              <Button
                className="btn btn-success"
                onClick={handleApprove}
                loading={walletBalanceLoading}
              >
                Accept & Pay
              </Button>
            )}

          {activityDetail?.activityStatusId == 11 &&
            AdvanceDetail?.paidByDealerId == user?.entityId && (
              <Button
                className="btn btn-success"
                onClick={handlePayBalance}
                loading={walletBalanceLoading}
              >
                Pay Balance Amount
              </Button>
            )}
        </div>
      )}
      <OverlayPanel ref={kmpanel} className="form-overlay-panel">
        <div className="cost-overlay-header">Travelled KM</div>
        <form onSubmit={handleKMSubmit(handleKMFormSubmit)}>
          <div className="d-flex flex-column gap-3_4">
            <div className="form-group">
              <label className="form-label required filter-label">
                Actual KM
              </label>
              <Controller
                name="totalKm"
                control={kmControl}
                rules={{
                  required: "Actual KM is required.",
                  validate: validatePositiveNumber,
                }}
                render={({ field, fieldState }) => (
                  <>
                    <InputText
                      {...field}
                      value={field.value}
                      placeholder="Enter KM"
                      //keyfilter={/^[1-9][0-9]*$/}
                      keyfilter={"pnum"}
                    />
                    <div className="p-error">
                      {kmFormState.errors[field.name]?.message}
                    </div>
                  </>
                )}
              />
            </div>
            <div className="form-group">
              <label className="form-label filter-label">Reason</label>
              <Controller
                name="totalKmReason"
                control={kmControl}
                // rules={{
                //   required: "Reason is required.",
                // }}
                render={({ field, fieldState }) => (
                  <>
                    <InputText
                      {...field}
                      value={field.value}
                      placeholder="Enter Reason"
                      keyfilter={/^[a-zA-Z\s]*$/}
                    />
                    <div className="p-error">
                      {kmFormState.errors[field.name]?.message}
                    </div>
                  </>
                )}
              />
            </div>
            {/*  {activityDetail?.enableAspWaitingTimeInApp && ( */}
            <div className="form-group">
              <label className="form-label required filter-label">
                ASP Waiting Time
              </label>
              <Controller
                name="aspWaitingTime"
                control={kmControl}
                rules={{ required: "Waiting Time is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <Calendar
                      inputId={field.name}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                      timeOnly
                      showIcon
                      iconPos={"left"}
                      placeholder="Select Waiting Time"
                      icon={<img src={CalendarTimeIcon} />}
                      pt={{
                        input: {
                          className: "border-right-hidden",
                        },
                      }}
                    />
                    <div className="p-error">
                      {kmFormState.errors &&
                        kmFormState.errors[field.name]?.message}
                    </div>
                  </>
                )}
              />
            </div>
            {/*  )} */}
            {/* <div className="form-group radio-form-group">
              <label className="form-label required filter-label">Is ASP Accepted CC Detail</label>
              <Controller
                name="isAspAcceptedCcDetail"
                control={kmControl}
                rules={{ required: "Is Accepted CC Detail is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <div className="common-radio-group">
                      <div className="common-radio-item">
                        <RadioButton
                          inputId="isAspAcceptedCcDetailAccepted"
                          {...field}
                          value={'true'}
                          checked={field?.value == 'true'}
                        />
                        <label
                          htmlFor="isAspAcceptedCcDetailAccepted"
                          className="common-radio-label"
                        >
                          Accepted
                        </label>
                      </div>
                      <div className="common-radio-item">
                        <RadioButton
                          inputId="isAspAcceptedCcDetailNotAccepted"
                          {...field}
                          value={'false'}
                          checked={field?.value === 'false'}
                        />
                        <label
                          htmlFor="isAspAcceptedCcDetailNotAccepted"
                          className="common-radio-label"
                        >
                          Rejected
                        </label>
                      </div>
                    </div>
                    <div className="p-error">
                      {kmFormState.errors && kmFormState.errors[field.name]?.message}
                    </div>
                  </>
                )}
              />
            </div>
            {selectedIsAspAcceptedCcDetail == 'false' && 
              <div className="form-group">
                <label className="form-label required filter-label">Rejected CC Detail Reason</label>
                <Controller
                  name="aspRejectedCcDetailReasonId"
                  control={kmControl}
                  rules={{ required: "Rejected CC Detail Reason is required." }}
                  render={({ field, fieldState }) => (
                    <>
                      <Dropdown
                        value={field.value}
                        placeholder="Select"
                        filter
                        options={aspRejectedCcDetailReasonData?.data?.data?.map(
                          ({ name, id }) => {
                            return {
                              label: name,
                              value: id,
                            };
                          }
                        )}
                        optionLabel="label"
                        onChange={(e) => field.onChange(e.value)}
                      />
                      <div className="p-error">
                        {kmFormState.errors && kmFormState.errors[field.name]?.message}
                      </div>
                    </>
                  )}
                />
              </div>
            } */}

            <div className="d-flex ms-auto gap">
              <Button
                className="btn btn-white"
                onClick={(e) => kmpanel.current.hide(e)}
                type="button"
              >
                Cancel
              </Button>
              <Button
                className="btn btn-primary"
                type="submit"
                loading={isLoading}
                disabled={isKmSubmitting}
              >
                Save
              </Button>
            </div>
          </div>
        </form>
      </OverlayPanel>
      <OverlayPanel ref={chargePanel} className="form-overlay-panel">
        <div className="cost-overlay-header">Additional Charges</div>
        <form onSubmit={handleSubmit(handleAddChargeSubmit)}>
          <div className="d-flex flex-column gap-3_4">
            {fields?.map((field, i) => (
              <div className="form-group" key={field.id}>
                <div className="d-flex gap-2">
                  <label className="form-label filter-label">
                    {selectedOption[i]?.label}
                  </label>
                  <div
                    className="remove-text ms-auto"
                    onClick={(e) => handleRemove(e, selectedOption[i], i)}
                  >
                    Remove
                  </div>
                </div>

                <Controller
                  name={`chargesData.${i}.amount`} //Tp update as array of Charges using useFieldArray hook
                  control={control}
                  rules={{
                    required: `${selectedOption[i]?.label} Required`,
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <InputText
                        {...field}
                        placeholder="Enter"
                        keyfilter="pnum"
                      />
                      <div className="p-error">
                        {errors &&
                          errors?.chargesData &&
                          errors?.chargesData[i]?.amount?.message}
                      </div>
                    </>
                  )}
                />
              </div>
            ))}
            {items?.length > 0 && (
              <button
                className="btn btn-blue btn-brder-blue"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  AddChargeMenu.current.show(e);
                }}
              >
                Add new charges
              </button>
            )}

            <div className="d-flex gap-2 ms-auto">
              <Button
                className="btn btn-white  gap-3_4"
                onClick={handleCancleCharge}
                type="button"
              >
                Cancel
              </Button>
              <Button
                className="btn btn-primary gap-3_4"
                type="submit"
                loading={addChargeLoading}
                disabled={isChargeSubmitting}
              >
                Save
              </Button>
            </div>
          </div>
        </form>
        <Menu
          model={items}
          popup
          ref={AddChargeMenu}
          popupAlignment={"top"}
        ></Menu>
      </OverlayPanel>
      <Dialog
        header={
          <>
            <div className="dialog-header">
              <div className="dialog-header-title">Payment Method</div>
            </div>
            {isExceededSla && paymenttype != "balance" ? (
              <div>
                {" "}
                <TimerChip label="SLA Violated" type="red" />
              </div>
            ) : null}
          </>
        }
        visible={paymentVisible}
        position={"bottom"}
        className="w-460"
        onHide={() => setPaymentVisible(false)}
        draggable={false}
        resizable={false}
        closeIcon={<img src={DialogCloseSmallIcon} />}
      >
        <div className="payment-method">
          <form id="sla-reason-form">
            <div className="row row-gap-3_4 mt-2">
              {AvailablePaymentMethods?.map((method, i) => (
                <div key={i}>
                  <PaymentMethodCard
                    id={method?.id}
                    methodType={method?.name}
                    basicPrice={method?.basicPrice}
                    methodDesc={method?.MethodDesc}
                    methodImg={method?.MethodImg}
                  />
                </div>
              ))}
              {isExceededSla && paymenttype != "balance" ? (
                <>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label className="form-label required">
                        SLA Violated Reason
                      </label>
                      <Controller
                        name="slaViolateReasonId"
                        control={slaControl}
                        rules={{ required: "SLA Violated Reason is required." }}
                        render={({ field, fieldState }) => (
                          <>
                            <Dropdown
                              value={field.value}
                              filter
                              placeholder="Select SLA Violated Reason"
                              options={reasons?.data?.data}
                              optionLabel="name"
                              onChange={(e) => {
                                field.onChange(e.value);
                                setSlaViolationReasonId(e.value.id);
                              }}
                            />
                            <div className="p-error">
                              {errorSla && errorSla[field.name]?.message}
                            </div>
                          </>
                        )}
                      />
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </form>

          <div className="payment-method-btn">
            <button className="btn btn-white gap-3_4" onClick={handleBack}>
              Back
            </button>
            <Button
              className="btn btn-primary gap-3_4"
              onClick={onPayment}
              loading={
                paymentLoading ||
                balanceMutateLoading ||
                paymentMethodMutateLoading
              }
            >
              Pay Now
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ServiceCostTab;
