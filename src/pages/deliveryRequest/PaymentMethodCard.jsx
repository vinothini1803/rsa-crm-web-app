import { RadioButton } from "primereact/radiobutton";
import { useState } from "react";

const PaymentMethodCard = ({
  id,
  methodType,
  basicPrice,
  methodDesc,
  methodImg,
}) => {
  const [selectPayment, setSelectPayment] = useState(1);
  const handlePaymentSelect = (value) => {
    setSelectPayment(value);
  };
  return (
    <div onClick={() => handlePaymentSelect(id)}>
      <div className="payment-method-card">
        <div className="payment-method-right">
          <div className="payment-method-icon">
            <img src={methodImg} alt="pyment-method-icon" />
          </div>
          <div className="payment-method-title">
            <div>{methodType}</div>
            <div className="d-flex gap-1">
              <p className="payment-method-type">{methodDesc}</p>
              {basicPrice && <p className="payment-amount">₹ {basicPrice} </p>}
            </div>
          </div>
        </div>

        <div className="payment-method-left">
          <RadioButton checked={id == selectPayment} />
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodCard;
