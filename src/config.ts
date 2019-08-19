// tslint:disable-next-line
const config = require('./app.config.json');

export const isAppRunningLocally = () => {
    return process.env.REACT_APP_LOCAL_SERVER;
}

export const AppStorageDirectory = config.directory;
export const AppExtent = config.extent;
export const AppPort = config.server_port;
export const AppBaseServerURL = config.base_server_url ? config.base_server_url : 'http://localhost';
export const AppOrgName = config.org_name ? config.org_name : null;