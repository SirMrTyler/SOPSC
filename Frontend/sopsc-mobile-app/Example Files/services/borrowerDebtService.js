import axios from 'axios';
import * as helper from '../services/serviceHelpers';


const endpoint = `${helper.API_HOST_PREFIX}/api/borrowerdebts`;
   

const addBorrowerDebt = (payload) => {
 const config = {
    method: "POST",
    url: `${endpoint}`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json"},
 };
 return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};


export {addBorrowerDebt};

