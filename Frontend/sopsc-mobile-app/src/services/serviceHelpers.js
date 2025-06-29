import * as SecureStore from 'expo-secure-store';

const token = await SecureStore.getItemAsync('token');
const deviceId = await SecureStore.getItemAsync('deviceId');

const onGlobalSuccess = response => {
    return response.data;
}

const onGlobalError = err => {
    return Promise.reject(err);
};

const getToken = () => {
    return {...SecureStore.getItemAsync(token)};
}

const getDeviceId = () => {
    return {...SecureStore.getItemAsync(deviceId)};
}

export {
    onGlobalSuccess,
    onGlobalError,
    getToken,
    getDeviceId
};