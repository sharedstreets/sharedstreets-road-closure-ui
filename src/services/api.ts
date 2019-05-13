import {
    isEmpty,
    omit
} from 'lodash';
const API_URL = "https://api.sharedstreets.io/v0.1.0/";

const paramStringBuilder = (obj: {}) => {
    let output = '';
    
    if (!obj) {
        return output;
    }

    Object.keys(obj).forEach((key) => {
        output += key + '=' + obj[key] + '&';
    });

    return output.slice(0, -1); // remove trailing &
}

const getRequestURLBuilder = (endpoint: string, queryParams: {}) => {
    return API_URL + endpoint + '?' + paramStringBuilder(queryParams);
}

// TODO -  add requestUrl optional param, use to override getRequestURLBuilder
const apiService = (endpoint: string, method: string, queryParams: {} = { authKey: '' }, payload: {}, headers: {}, requestUrl: string, mode: string = '', signal: AbortSignal) => {
    if (isEmpty(requestUrl)) {
        requestUrl = getRequestURLBuilder(endpoint, queryParams);
    }
    let fetchOptions = {
        body: JSON.stringify(payload),
        headers: new Headers(headers),
        method,
        signal,
    };
    if (!signal) {
        fetchOptions = omit(fetchOptions, ["signal"]);
    }

    if (method === "get") {
        fetchOptions = omit(fetchOptions, ["body"]);
    }
    if (!isEmpty(mode)) {
        fetchOptions = Object.assign({}, fetchOptions, { mode });
    }

    return fetch(requestUrl, fetchOptions);
};

export default apiService;