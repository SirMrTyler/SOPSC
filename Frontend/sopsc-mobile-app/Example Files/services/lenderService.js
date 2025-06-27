import axios from "axios";
import debug from "sabio-debug";
import * as helper from '../services/serviceHelpers';


const _logger = debug.extend("LenderService");

const endpoint = `${helper.API_HOST_PREFIX}/api/lenders`;

const getPageSearch = (pageIndex, pageSize, searchTerm) => {
    _logger("Getting paginated Lenders")
    const config = {
        method: "GET",
        url: `${endpoint}/search/?pageIndex=${pageIndex}&pageSize=${pageSize}&searchTerm=${searchTerm}`,
        crossdomain: true,
        headers: {"Content-Type": "application/json"}
    };
    return axios(config);
}

const lendersService = {getPageSearch}
export default lendersService