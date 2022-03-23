export const API_CALL_REQUEST = 'API_CALL_REQUEST';
export const API_CALL_SUCCESS = 'API_CALL_SUCCESS';
export const API_CALL_FAILURE = 'API_CALL_FAILURE';

export const requestAction = (data) => {
    return { type: API_CALL_REQUEST, params: data, route: 'quote' };
};

export const failureAction = (error) => {
    return { type: API_CALL_FAILURE, error };
};