import {
    AppBaseServerURL,
    AppPort,
    isAppRunningLocally,
} from '../config';

export interface IRoadClosureUploadUrls {
    geojsonUploadUrl: string,
    wazeUploadUrl: string,
}

export const generateUploadUrlsFromHash = (urlHash: string, orgName: string) : IRoadClosureUploadUrls => {
    return {
        geojsonUploadUrl: (isAppRunningLocally()) ? `${AppBaseServerURL}:${AppPort}/load-file/${orgName}/${urlHash}/geojson`
             : `https://sharedstreets-public-data.s3.amazonaws.com/road-closures/${orgName}/${urlHash}/geojson`,
        wazeUploadUrl: (isAppRunningLocally()) ? `${AppBaseServerURL}:${AppPort}/load-file/${orgName}/${urlHash}/waze.json`
            : `https://sharedstreets-public-data.s3.amazonaws.com/road-closures/${orgName}/${urlHash}/waze`,
    };
}