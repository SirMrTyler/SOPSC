const onGlobalSuccess = response => {
    return response.data;
}

const onGlobalError = err => {
    return Promise.reject(err);
};

export {
    onGlobalSuccess,
    onGlobalError
};