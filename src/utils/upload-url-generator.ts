export interface IRoadClosureUploadUrls {
    stateUploadUrl: string,
    geojsonUploadUrl: string,
    wazeUploadUrl: string,
}

export const generateUploadUrlsFromHash = (urlHash: string) : IRoadClosureUploadUrls => {
    return {
        geojsonUploadUrl: `https://sharedstreets-public-data.s3.amazonaws.com/road-closures/${urlHash}/geojson`,
        stateUploadUrl: `https://sharedstreets-public-data.s3.amazonaws.com/road-closures/${urlHash}/state`,
        wazeUploadUrl: `https://sharedstreets-public-data.s3.amazonaws.com/road-closures/${urlHash}/waze`,
    };
}