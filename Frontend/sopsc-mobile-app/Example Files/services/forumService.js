import axios from "axios";
import * as helper from "../services/serviceHelpers";

const forumService = {
    endpoint: `${helper.API_HOST_PREFIX}/api/forums`,
};

forumService.createForum = (payload) => {

    const config = {
        method: "POST",
        url: forumService.endpoint,
        data: payload,
        crossdomain: true,
        withCredential: true,
        headers: { "Content-Type": "application/json" }
    };
    return axios(config);
};

forumService.GetAllPaginated = (pageIndex, pageSize) => {
    const config = {
        method: "GET",
        url: forumService.endpoint,
        data: pageIndex, pageSize,
        crossdomain: true,
        withCredential: true,
        headers: { "Content-Type": "application/json" }
    };
    return axios(config);
}

export default forumService;