import axios from "axios";
import {
  GoogleMapAPIKey,
} from "../src/utills/imgConstants";


export const getToken = (data) =>
  axios({  
    method: "POST",
    url: "https://outpost.mappls.com/api/security/oauth/token",
    data: data,
  });

  export const aspMapSearch = (data) =>  axios({  
    method: "POST",
    url: "case/rsa/asp/overAll/mapView",
    data: data
  });

  export const technicianMapSearch = (data) =>  axios({  
    method: "POST",
    url: "case/rsa/technician/overAll/mapView",
    data: data
  });

  export const caseMapSearch = (data) =>  axios({  
    method: "POST",
    url: "case/rsa/overAllMapCaseView",
    data: data
  });