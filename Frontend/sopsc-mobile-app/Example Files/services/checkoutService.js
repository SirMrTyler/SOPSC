import axios from "axios";
import * as helper from "../services/serviceHelpers";

const checkoutService = {
  endpoint: `${helper.API_HOST_PREFIX}/api/checkouts`,
};

checkoutService.addTestSession = () => {
  const config = {
    method: "POST",
    url: checkoutService.endpoint + "/testsession",
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

export default checkoutService;
