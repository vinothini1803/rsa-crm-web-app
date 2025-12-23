import React from "react";

const CurrencyFormat = ({ amount, color, fontWeight }) => {
  const num = Number(amount);

  const hasFraction = num % 1 !== 0; // Check if amount has a fractional part
  const formattedAmount = new Intl.NumberFormat("en-IN", {
   // maximumFractionDigits: hasFraction ? 2 : 0,
    style: "currency",
    currency: "INR",
  }).format(amount);
  return (
    <span
      style={{
        ...(color && { color: color }),
        ...(fontWeight && { fontWeight: fontWeight }),
      }}
    >
      {formattedAmount}
    </span>
  );
};

export default CurrencyFormat;
