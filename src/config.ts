// tslint:disable-next-line
const config = require('./app.config.json');

export const isAppRunningLocally = () => {
    // TODO - check NODE_ENV
    return process.env.REACT_APP_LOCAL_SERVER;
    // return config && config.local_server;
}

export const AppStorageDirectory = config.directory;
export const AppExtent = config.extent;
export const AppPort = config.server_port;
export const AppBaseServerURL = config.base_server_url ? config.base_server_url : 'http://localhost';