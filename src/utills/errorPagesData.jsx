/* Error Page Image */
import Error400 from "../assets/img/error-messages/400.svg";
import Error401 from "../assets/img/error-messages/401.svg";
import Error403 from "../assets/img/error-messages/403.svg";
import Error404 from "../assets/img/error-messages/404.svg";
import Error405 from "../assets/img/error-messages/405.svg";
import Error408 from "../assets/img/error-messages/408.svg";
import Error419 from "../assets/img/error-messages/419.svg";
import Error429 from "../assets/img/error-messages/429.svg";
import Error500 from "../assets/img/error-messages/500.svg";
import Error501 from "../assets/img/error-messages/501.svg";
import Error502 from "../assets/img/error-messages/502.svg";
import Error503 from "../assets/img/error-messages/503.svg";

export const errorData = [
  {
    id: 400,
    title: 'Bad Request',
    description: 'Our apologies for our inconvenience. The request you made couldn’t be completed.',
    img: Error400
  },
  {
    id: 401,
    title: 'Unauthorised Error',
    description: 'This server could not verfy that you are authorised to access this page using the credentials that you supplied.',
    img: Error401
  },
  {
    id: 403,
    title: 'Forbidden',
    description: 'The page you’re trying to access has restricted your access. If you feel this is a mistake, contact your admin.',
    img: Error403
  },
  {
    id: 404,
    title: '404 Page Not Found',
    description: 'The page you are trying to access does not exist or has been moved. Try going back to our homepage.',
    img: Error404
  },
  {
    id: 405,
    title: 'Method Not Allowed',
    description: 'The method you are using to access the file is not allowed.',
    img: Error405
  },
  {
    id: 408,
    title: 'Request Timeout ',
    description: 'The server timed out waiting for the request.',
    img: Error408
  },
  {
    id: 419,
    title: 'Page Expired Error',
    description: 'Sorry, your session has expired. Please refresh and try again.',
    img: Error419
  },
  {
    id: 429,
    title: 'Too Many Requests',
    description: 'We are sorry you have sent too many requests to us recently. Please try again later.',
    img: Error429
  },
  {
    id: 500,
    title: 'Internal Server Error',
    description: 'We are facing an internal server error. Our experts are trying to fix the problem. Please try again or wait for some time.',
    img: Error500
  },
  {
    id: 501,
    title: 'Not Implemented',
    description: 'The server either does not recognize the request method, or it lacks the ability to fulfill the request. ',
    img: Error501
  },
  {
    id: 502,
    title: 'Service Temporarily Overloaded',
    description: 'The server Encountered a temporary error and could not complete your request',
    img: Error502
  },
  {
    id: 503,
    title: 'Service Unavailable',
    description: 'This server is temporarily unavailable.Please check back shortly.',
    img: Error503
  }
]