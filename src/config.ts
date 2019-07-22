// tslint:disable-next-line
const config = require('./config.json');

export const isAppRunningLocally = () => {
    // TODO - check NODE_ENV
    return config && config.directory;
}

export const AppStorageDirectory = config.directory;
export const AppExtent = config.extent;
export const AppPort = config.server_port ? config.server_port : 3001;
export const AppBaseServerURL = config.base_server_url ? config.base_server_url : 'http://localhost';