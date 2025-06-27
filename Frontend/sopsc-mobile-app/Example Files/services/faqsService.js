import axios from 'axios';
import * as helper from '../services/serviceHelpers';

const endpoint = `${helper.API_HOST_PREFIX}/api/faqs`;

const add = (payload) => {
    const config = {
        method: 'POST', //Pay attention to the method
        url: `${endpoint}`,
        data: payload,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const updateFaq = (id, payload) => {
    const config = {
        method: 'PUT', //Pay attention to the method
        url: `${endpoint}/${id}`,
        data: payload,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const getFaqs = () => {
    const config = {
        method: 'GET', //Pay attention to the method
        url: `${endpoint}`,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const getPaginatedFaqs = () => {
    const config = {
        method: 'GET', //Pay attention to the method
        url: `${endpoint}/search/?pageIndex=0&pageSize=15`,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const faqsService = { add, getFaqs, updateFaq, getPaginatedFaqs };
export default faqsService;