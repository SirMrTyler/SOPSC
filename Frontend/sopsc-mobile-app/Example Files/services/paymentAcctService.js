import axios from "axios";
import * as helper from "../services/serviceHelpers";
import debug from "sabio-debug";

const _logger = debug.extend("PaymentAcct/Service");

const paymentAcctService = {
  endpoint: `${helper.API_HOST_PREFIX}/api/paymentaccounts`,
};

paymentAcctService.addAcct = (payload) => {
  _logger("Calling addAcct axios call");
  _logger("endpoint: ", paymentAcctService.endpoint);
  const config = {
    method: "POST",
    url: paymentAcctService.endpoint,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

paymentAcctService.getById = (id) => {
  const config = {
    method: "GET",
    url: `${paymentAcctService.endpoint}/${id}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

export default paymentAcctService;
