// import Axios from "../AxiosApi";
import axios from "axios";

// Get All Card Details
export const getAllResources = () => {
  return axios({
    method: "post",
    url: process.env.REACT_APP_MODELLER_API_ENDPOINT+"modellerService/getResources",
    data: {
      workspaceName: localStorage.getItem("workspace"),
      miniAppName: localStorage.getItem("appName"),
    }
  })
    .then((response) => {
      // console.log("getAllResources", response);
      return response.data;
    })
    .catch((err) => {
      return err;
    });
};
