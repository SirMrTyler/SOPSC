import axios from 'axios';
import * as helper from '../services/serviceHelpers';

const testService = {
    endpoint: `${helper.API_HOST_PREFIX}/api/`
}
testService.login = () => {
    const config = {
        method: 'GET',
        url: `${testService.endpoint}temp/auth/login/9/tyler/cto`,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json'},
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
}

testService.getAllTests = (pageIndex, pageSize) => {
    const config = {
        method: 'GET', 
        url: `${testService.endpoint}tests?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

testService.getTestsByQuery = (query, pageIndex, pageSize) => {
    const config = {
        method: 'GET', //Pay attention to the method
        url: `${testService.endpoint}tests/search/${query}/${pageIndex}/${pageSize}`,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

testService.updateTest = (testId, payload) => {
    const config = {
        method: 'PUT', //Pay attention to the method
        url: `${testService.endpoint}tests/${testId}`,
        data: payload,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
}
testService.deleteTest = (testId) => {
    const config = {
        method: 'DELETE', //Pay attention to the method
        url: `${testService.endpoint}tests/${testId}`,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
}

export default testService;
