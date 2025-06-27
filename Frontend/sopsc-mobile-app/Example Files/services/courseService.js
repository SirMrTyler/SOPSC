import axios from "axios";
import * as helper from "../services/serviceHelpers";
import debug from "sabio-debug";
const _logger = debug.extend("courseService");
let { REACT_APP_API_HOST_PREFIX: API } = process.env;
_logger(API);
_logger(process.env.REACT_APP_API_HOST_PREFIX);

var coursesEndpont = {
  endpoint: `${helper.API_HOST_PREFIX}/api/courses`,
};

let getCourses = (pageIndex, pageSize, query) => {
  const config = {
    method: "GET",
    url:
      coursesEndpont.endpoint +
      `/search?pageIndex=${pageIndex}&pageSize=${pageSize}&query=${query}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};
const courseService = { getCourses };
export default courseService;
