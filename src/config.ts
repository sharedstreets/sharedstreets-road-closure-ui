// tslint:disable
require('dotenv').config();
// tslint:enable


export const isAppRunningLocally = () => {
    return process.env.REACT_APP_LOCAL_SERVER;
}

export const AppStorageDirectory = process.env.REACT_APP_directory;
export const AppExtent = process.env.REACT_APP_extent && JSON.parse( process.env.REACT_APP_extent ).length === 4 ? JSON.parse(process.env.REACT_APP_extent) : [];
export const AppPort = process.env.REACT_APP_server_port;
export const AppBaseServerURL = process.env.REACT_APP_base_server_url ? process.env.REACT_APP_base_server_url : 'http://localhost';
export const AppOrgName = process.env.REACT_APP_org_name ? process.env.REACT_APP_org_name : null;