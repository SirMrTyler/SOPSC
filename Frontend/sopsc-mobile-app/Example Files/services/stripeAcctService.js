import axios from "axios";
import * as helper from "../services/serviceHelpers";
import debug from "sabio-debug";

const _logger = debug.extend("StripeAcct");

const stripeAcctService = {
  endpoint: `${helper.API_HOST_PREFIX}/api/stripeaccounts`,
};

stripeAcctService.newTestAcct = () => {
  const config = {
    method: "POST",
    url: stripeAcctService.endpoint + "/test",
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

stripeAcctService.newAcctLink = (payload) => {
  _logger("Making axios call with account id: ", payload.accountId);
  const config = {
    method: "POST",
    url: `${stripeAcctService.endpoint}/link`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

stripeAcctService.getBalance = (id) => {
  _logger("Making axios call with account id: ", id);
  const config = {
    method: "GET",
    url: `${stripeAcctService.endpoint}/balance?id=${id}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

export default stripeAcctService;
