import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

const onGlobalSuccess = response => {
    return response.data;
}

const onGlobalError = err => {
    if (err?.response?.status === 404) {
        // Handle not found error
        Alert.alert('Resource not found...');
    } else {
        console.error('[Service Error]', err?.response?.data || err);
    }
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