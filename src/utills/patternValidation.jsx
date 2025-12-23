export const vehiclePatternValidation = (inputValue) => {
  // Regular expressions for different Indian vehicle registration numbers
  const bhRegNumberRegex = /^[0-9]{2}BH[0-9]{4}[A-Z]{2}$/i; // BH series
  const bharatRegNumberRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/i; // Bharat number
  // const otherStateRegNumberRegex = /^[A-Z]{2}[0-9]{1,2}(?: [A-Z])?(?: [0-9]{1,4}){0,2}$/i; // Other state number
  const otherStateRegNumberRegex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}$/i; // Other states
  // Check if the input matches any of the regex patterns
  if (
    bhRegNumberRegex.test(inputValue) ||
    bharatRegNumberRegex.test(inputValue) ||
    otherStateRegNumberRegex.test(inputValue)
  ) {
    return true;
  } else {
    return false;
  }
};

export const vehicleNumberValidation = (inputValue) => {
  const rejex =
    /^(?:[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{1,4}|[0-9]{2}BH[0-9]{4}[A-Z]{2})$/; // BH series

  if (rejex.test(inputValue)) {
    return true;
  } else {
    return false;
  }
};
