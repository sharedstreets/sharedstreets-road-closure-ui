export const fetchAction = ({
    requesting = '',
    requested = '',
    endpoint = '',
    method = 'get',
    body = {},
    params = {},
    afterRequest = (e: any) => e
}) => (dispatch: any) => {
    const q: any = null;
    if (requesting) {
        dispatch({
            type: requesting,
        });
    }

    return q.then((result: any) => dispatch({
        error: false,
        payload: afterRequest(result),
        type: requested,
    }), (error: any) => dispatch({
        error: true,
        payload: error.message,
        type: requested,
    }));
};