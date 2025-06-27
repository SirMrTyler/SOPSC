import axios from 'axios';
import * as helper from '../services/serviceHelpers';

const endpoint = `${helper.API_HOST_PREFIX}/api/lookups`;

const getTypes = (types) => {
    const config = {
        method: 'POST', //Pay attention to the method
        url: `${endpoint}`,
        data: types,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const getTypes3Col = (types) => {
    const config = {
        method: 'GET', //Pay attention to the method
        url: `${endpoint}`,
        data: types,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};
const lookUpService = { getTypes, getTypes3Col };
export default lookUpService;
