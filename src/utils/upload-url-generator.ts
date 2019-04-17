export interface IRoadClosureUploadUrls {
    geojsonUploadUrl: string,
    wazeUploadUrl: string,
}

export const generateUploadUrlsFromHash = (urlHash: string, orgName: string) : IRoadClosureUploadUrls => {
    return {
        geojsonUploadUrl: `https://sharedstreets-public-data.s3.amazonaws.com/road-closures/${orgName}/${urlHash}/geojson`,
        wazeUploadUrl: `https://sharedstreets-public-data.s3.amazonaws.com/road-closures/${orgName}/${urlHash}/waze`,
    };
}