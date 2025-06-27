import axios from "axios";
import * as helper from "./serviceHelpers";

const endpoint = `${helper.API_HOST_PREFIX}/api/lectures`;

const Add = (values) => {
  const config = {
    method: "POST",
    url: endpoint,
    crossdomain: true,
    data: values,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

export {Add};