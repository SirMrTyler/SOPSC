import axios from "axios";
import * as helper from "./serviceHelpers";

var businessProfileServiceEndpoint = {
  endpoint: `${helper.API_HOST_PREFIX}/api/businessprofiles`,
};

const getAllBusinessProfiles = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: businessProfileServiceEndpoint.endpoint + `/?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const getBusinessProfileById = (id) => {
  const config = {
    method: "GET",
    url: businessProfileServiceEndpoint.endpoint + "/" + id,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const friendsService = { getAllBusinessProfiles, getBusinessProfileById };
export default friendsService;
