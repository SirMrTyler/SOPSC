import * as SecureStore from 'expo-secure-store';

const onGlobalSuccess = response => {
    return response.data;
}

const onGlobalError = err => {
    return Promise.reject(err);
};

const getToken = async () => { return await SecureStore.getItemAsync('token'); };
const getDeviceId = async () => { return await SecureStore.getItemAsync('deviceId'); };

export {
    onGlobalSuccess,
    onGlobalError,
    getToken,
    getDeviceId
};