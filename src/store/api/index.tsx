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
    mode = '',
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
    return apiService(endpoint, method, params, body, headers, requestUrl, mode)
    .then(async (response: any) => {
        let text;
        try {
            text = await response.text();
            const data = JSON.parse(text);
            return data;
        } catch (err) {
            return text;
        }
    })
    .then((data: any) => dispatch({
        error: false,
        payload: afterRequest(data),
        type: requested,
    }));
}; 