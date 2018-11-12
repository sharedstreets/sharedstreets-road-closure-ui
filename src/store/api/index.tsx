import { Dispatch } from 'redux';
import api from 'src/services/api';

export const fetchAction = ({
    requesting = '',
    requested = '',
    endpoint = '',
    method = 'get',
    body = {},
    params = {},
    afterRequest = (e: any) => e
}) => (dispatch: Dispatch<any>) => {
    if (requesting) {
        dispatch({
            type: requesting
        });
    }

    return api(endpoint, method, params, body)
    .then((response: any) => {
        return response.json()
    })
    .then((data: any) => dispatch({
        error: false,
        payload: afterRequest(data),
        type: requested,
    }));
}; 