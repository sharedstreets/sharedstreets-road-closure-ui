import * as AWS from 'aws-sdk';
import AWSConfig from '../config/aws-config';
AWS.config.update({
    accessKeyId: AWSConfig.IAM_USER_KEY,
    region: 'us-east-1',
    secretAccessKey: AWSConfig.IAM_USER_SECRET,
})
export const s3 = new AWS.S3();

const URL_EXPIRATION_SECONDS = 60 * 60;
const BUCKET_NAME = 'sharedstreets-public-data';
const PATH_PREFIX = 'road-closures/';

export const getSignedUploadUrl = (filename: string) => {
    return s3.getSignedUrl('putObject', {
        Bucket: BUCKET_NAME,
        Expires: URL_EXPIRATION_SECONDS,
        Key: PATH_PREFIX + filename,
    })
}
export const getListObjectsUrl = () => {
    const url = s3.getSignedUrl('listObjectsV2', {
        Bucket: BUCKET_NAME,
        Expires: URL_EXPIRATION_SECONDS,
    });

    return url;
    // return fetch(url)
    // .then((response) => response)
    // .then((data) => {
    //     // tslint:disable
    //     console.log(data);
    //     // tslint:enable
    // })
    ;
}

export const headObjectUrl = (filename: string = '') => {
    const url = s3.getSignedUrl('headObject', {
        Bucket: BUCKET_NAME,
        Expires: URL_EXPIRATION_SECONDS,
        Key: filename,
    });
    return url;
    // return fetch(url)
    // .then((response) => response)
    // .then((data) => {
    //     // tslint:disable
    //     console.log(data);
    //     // tslint:enable
    // })
    ;
}

export const putObjectUrl = (payload: string = '', filename: string = '') => {
    const url = s3.getSignedUrl('putObject', {
        // Body: payload,
        Bucket: BUCKET_NAME,
        ContentType: "application/json",
        Expires: URL_EXPIRATION_SECONDS,
        Key: PATH_PREFIX + filename,
    });
    return url;
    // return fetch(url);
}