import axios from "axios";
import * as helper from "./serviceHelpers";

const fileService = {
  endpoint: `${helper.API_HOST_PREFIX}/api/files`,
};

fileService.uploadFiles = (payload) => {
  const config = {
    method: "POST",
    url: `${fileService.endpoint}/aws/upload`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
  .then((response) => {
    return {
      id: response.data.item, 
      ...payload,
    }
  })
};

export default fileService;
