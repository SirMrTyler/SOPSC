import axios from "axios";
import debug from "sabio-debug";
import * as helper from '../services/serviceHelpers';

const _logger = debug.extend("TestAnswerService");

const endpoint = `${helper.API_HOST_PREFIX}/api/testinstances`;


const getPaginated = (pageIndex, pageSize) => {
    _logger("Getting paginated test instances");
    const config = {
        method: "GET",
        url: `${endpoint}/paginate/?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        crossdomain: true,
        headers: {"Content-Type": "application/json"}
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
}

export { getPaginated };