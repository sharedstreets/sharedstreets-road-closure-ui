const API_URL = "https://api.sharedstreets.io/v0.1.0/";

const paramStringBuilder = (obj: {}) => {
    let output = '';
    
    if (!obj) {
        return output;
    }

    Object.keys(obj).forEach((key) => {
        output += key + '=' + obj[key] + '&';
    })
    return output;
}

const getRequestURLBuilder = (endpoint: string, queryParams: {}) => {
    return API_URL + endpoint + '?' + paramStringBuilder(queryParams);
}

const apiService = (endpoint: string, method: string, queryParams: {} = { authKey: '' }, payload: {}) => {
    const requestUrl = getRequestURLBuilder(endpoint, queryParams);
    return fetch(`${requestUrl}`, {
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': "application/json; charset=UTF-8"
        },
        method,
    });
};

export default apiService;