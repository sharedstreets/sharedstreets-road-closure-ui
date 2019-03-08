import { Dispatch } from 'redux';
import apiService from 'src/services/api';

export const fetchAction = ({
    requesting = '',
    requested = '',
    endpoint = '',
    method = 'get',
    body = {},
    params = {},
    headers = {},
    requestUrl = '',
    // fn = (...args: any[]) => Promise.resolve(new Response()),
    // fnParams = [] as any[],
    afterRequest = (e: any) => e
}) => (dispatch: Dispatch<any>) => {
    if (requesting) {
        dispatch({
            type: requesting
        });
    }
    // return fn(...fnParams)
    return apiService(endpoint, method, params, body, headers, requestUrl)
    .then((response: any) => {
        return response.json()
    })
    .then((data: any) => dispatch({
        error: false,
        payload: afterRequest(data),
        type: requested,
    }));
}; 