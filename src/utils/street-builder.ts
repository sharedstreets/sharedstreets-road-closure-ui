import {
    ISharedStreetsMatchGeomPathProperties,
    SharedStreetsMatchGeomPath,
} from '../models/SharedStreets/SharedStreetsMatchGeomPath';

import { randomPoint } from '@turf/random';

import { v4 as uuid } from 'uuid'

import { coordAll } from '@turf/meta';

import { lineString } from '@turf/helpers';

// export class StreetBuilder {
//     public isOneWay: boolean;
//     public isTwoWay: boolean;
//     public features: SharedStreetsMatchPath[];
//     public path: SharedStreetsMatchPath | {
//         backward: SharedStreetsMatchPath,
//         forward: SharedStreetsMatchPath
//     } ;

//     // public constructor(direction: string) {
//     //     this.oneWay = true;
//     //     this.twoWay = false;

//     //     const path = createOneWayStreet(direction);
//     //     this.path = path;
//     //     this.features.push(path);
//     // }

//     public oneWayForward() {
//         const path = createOneWayStreet("forward");
//         this.path = path;
//         this.features.push(path);
//         this.isOneWay = true;
//         this.isTwoWay = false;
//     }

//     public oneWayBackward() {
//         const path = createOneWayStreet("backward");
//         this.path = path;
//         this.features.push(path);
//         this.isOneWay = true;
//         this.isTwoWay = false;
//     }

//     public twoWay() {
//         const path = createTwoWayStreet();
//         this.path = path;
//         this.features.push(path.forward, path.backward);
//         this.isOneWay = false;
//         this.isTwoWay = true;
//     }

//     public addOneWayFrom(direction: string) {
//         if (this.isOneWay) {
//             const thisPath = this.path as SharedStreetsMatchPath;
//             const oneWayFrom = createOneWayStreetFromStreet(direction, thisPath);
//             this.features.push(oneWayFrom);
//             this.path = oneWayFrom;
//         } else if (this.isTwoWay) {

//         }
//     }
//     public addOneWayTo(direction: string) {
//         const oneWayTo = createOneWayStreetToStreet(direction, this.path);
//         this.features.push(oneWayTo);
//         this.path = oneWayTo;
//     }

// }

export const createOneWayStreet = (direction: string) : SharedStreetsMatchGeomPath => {
    const points = randomPoint(2);
    const geometryId = uuid();
    const referenceId = uuid();
    const fromIntersectionId = uuid();
    const toIntersectionId = uuid();

    const pathProperties: ISharedStreetsMatchGeomPathProperties = {
        direction,
        fromIntersectionId,
        fromStreetnames: ['street-'+referenceId],
        geometryId,
        originalFeature: {
            geometry: {
                coordinates: coordAll(points),
                type: "LineString",
            },
            properties: {},
            type: "Feature"
        },
        point: 1,
        referenceId,
        referenceLength: 1,
        roadClass: '',
        section: [1],
        side: '',
        streetname: 'street-'+referenceId,
        toIntersectionId,
        toStreetnames: ['street-'+toIntersectionId]
    };
    const path = new SharedStreetsMatchGeomPath(
        lineString(coordAll(points), pathProperties)
    );

    return path;
}

export const createTwoWayStreet = () : { forward: SharedStreetsMatchGeomPath, backward: SharedStreetsMatchGeomPath} => {
    const points = randomPoint(2);
    const geometryId = uuid();
    const fromIntersectionId = uuid();
    const toIntersectionId = uuid();
    
    const forwardReferenceId = uuid();

    const forwardPathProperties: ISharedStreetsMatchGeomPathProperties = {
        direction: "forward",
        fromIntersectionId,
        fromStreetnames: ['street-'+forwardReferenceId],
        geometryId,
        originalFeature: {
            geometry: {
                coordinates: coordAll(points),
                type: "LineString",
            },
            properties: {},
            type: "Feature"
        },
        point: 1,
        referenceId: forwardReferenceId,
        referenceLength: 1,
        roadClass: '',
        section: [1],
        side: '',
        streetname: 'street-'+forwardReferenceId,
        toIntersectionId,
        toStreetnames: ['street-'+toIntersectionId]
    };
    const forwardPath = new SharedStreetsMatchGeomPath(
        lineString(coordAll(points), forwardPathProperties)
    );

    const backwardReferenceId = uuid();
    
    const backwardPathProperties: ISharedStreetsMatchGeomPathProperties = {
        direction: "backward",
        fromIntersectionId: toIntersectionId,
        fromStreetnames: ['street-'+backwardReferenceId],
        geometryId,
        originalFeature: {
            geometry: {
                coordinates: coordAll(points),
                type: "LineString",
            },
            properties: {},
            type: "Feature"
        },
        point: 1,
        referenceId: backwardReferenceId,
        referenceLength: 1,
        roadClass: '',
        section: [1],
        side: '',
        streetname: 'street-'+backwardReferenceId,
        toIntersectionId: fromIntersectionId,
        toStreetnames: ['street-'+toIntersectionId]
    };
    const backwardPath = new SharedStreetsMatchGeomPath(
        lineString(coordAll(points), backwardPathProperties)
    );

    return {
        backward: backwardPath,
        forward: forwardPath,
    }
}

export const createTwoWayStreetFromIntersection = (intersectionId: string) : { forward: SharedStreetsMatchGeomPath, backward: SharedStreetsMatchGeomPath} => {
    const points = randomPoint(2);
    const geometryId = uuid();
    const fromIntersectionId = intersectionId;
    const toIntersectionId = uuid();
    
    const forwardReferenceId = uuid();

    const forwardPathProperties: ISharedStreetsMatchGeomPathProperties = {
        direction: "forward",
        fromIntersectionId,
        fromStreetnames: ['street-'+forwardReferenceId],
        geometryId,
        originalFeature: {
            geometry: {
                coordinates: coordAll(points),
                type: "LineString",
            },
            properties: {},
            type: "Feature"
        },
        point: 1,
        referenceId: forwardReferenceId,
        referenceLength: 1,
        roadClass: '',
        section: [1],
        side: '',
        streetname: 'street-'+forwardReferenceId,
        toIntersectionId,
        toStreetnames: ['street-'+toIntersectionId]
    };
    const forwardPath = new SharedStreetsMatchGeomPath(
        lineString(coordAll(points), forwardPathProperties)
    );

    const backwardReferenceId = uuid();
    
    const backwardPathProperties: ISharedStreetsMatchGeomPathProperties = {
        direction: "backward",
        fromIntersectionId: toIntersectionId,
        fromStreetnames: ['street-'+backwardReferenceId],
        geometryId,
        originalFeature: {
            geometry: {
                coordinates: coordAll(points),
                type: "LineString",
            },
            properties: {},
            type: "Feature"
        },
        point: 1,
        referenceId: backwardReferenceId,
        referenceLength: 1,
        roadClass: '',
        section: [1],
        side: '',
        streetname: 'street-'+backwardReferenceId,
        toIntersectionId: fromIntersectionId,
        toStreetnames: ['street-'+toIntersectionId]
    };
    const backwardPath = new SharedStreetsMatchGeomPath(
        lineString(coordAll(points), backwardPathProperties)
    );

    return {
        backward: backwardPath,
        forward: forwardPath,
    }
}

export const createTwoWayStreetToIntersection = (intersectionId: string) : { forward: SharedStreetsMatchGeomPath, backward: SharedStreetsMatchGeomPath} => {
    const points = randomPoint(2);
    const geometryId = uuid();
    const fromIntersectionId = uuid();
    const toIntersectionId = intersectionId;
    
    const forwardReferenceId = uuid();

    const forwardPathProperties: ISharedStreetsMatchGeomPathProperties = {
        direction: "forward",
        fromIntersectionId,
        fromStreetnames: ['street-'+forwardReferenceId],
        geometryId,
        originalFeature: {
            geometry: {
                coordinates: coordAll(points),
                type: "LineString",
            },
            properties: {},
            type: "Feature"
        },
        point: 1,
        referenceId: forwardReferenceId,
        referenceLength: 1,
        roadClass: '',
        section: [1],
        side: '',
        streetname: 'street-'+forwardReferenceId,
        toIntersectionId,
        toStreetnames: ['street-'+toIntersectionId]
    };
    const forwardPath = new SharedStreetsMatchGeomPath(
        lineString(coordAll(points), forwardPathProperties)
    );

    const backwardReferenceId = uuid();
    
    const backwardPathProperties: ISharedStreetsMatchGeomPathProperties = {
        direction: "backward",
        fromIntersectionId: toIntersectionId,
        fromStreetnames: ['street-'+backwardReferenceId],
        geometryId,
        originalFeature: {
            geometry: {
                coordinates: coordAll(points),
                type: "LineString",
            },
            properties: {},
            type: "Feature"
        },
        point: 1,
        referenceId: backwardReferenceId,
        referenceLength: 1,
        roadClass: '',
        section: [1],
        side: '',
        streetname: 'street-'+backwardReferenceId,
        toIntersectionId: fromIntersectionId,
        toStreetnames: ['street-'+toIntersectionId]
    };
    const backwardPath = new SharedStreetsMatchGeomPath(
        lineString(coordAll(points), backwardPathProperties)
    );

    return {
        backward: backwardPath,
        forward: forwardPath,
    }
}

export const createOneWayStreetFromIntersection = (direction: string, intersectionId: string) : SharedStreetsMatchGeomPath => {
    const points = randomPoint(2);
    const geometryId = uuid();
    const referenceId = uuid();
    const toIntersectionId = uuid();
    const fromIntersectionId = intersectionId;

    const pathProperties: ISharedStreetsMatchGeomPathProperties = {
        direction,
        fromIntersectionId,
        fromStreetnames: ['street-'+referenceId],
        geometryId,
        originalFeature: {
            geometry: {
                coordinates: coordAll(points),
                type: "LineString",
            },
            properties: {},
            type: "Feature"
        },
        point: 1,
        referenceId,
        referenceLength: 1,
        roadClass: '',
        section: [1],
        side: '',
        streetname: 'street-'+referenceId,
        toIntersectionId,
        toStreetnames: ['street-'+toIntersectionId]
    };
    const path = new SharedStreetsMatchGeomPath(
        lineString(coordAll(points), pathProperties)
    );

    return path;
}

export const createOneWayStreetToIntersection = (direction: string, intersectionId: string) : SharedStreetsMatchGeomPath => {
    const points = randomPoint(2);
    const geometryId = uuid();
    const referenceId = uuid();
    const toIntersectionId = intersectionId;
    const fromIntersectionId = uuid();

    const pathProperties: ISharedStreetsMatchGeomPathProperties = {
        direction,
        fromIntersectionId,
        fromStreetnames: ['street-'+referenceId],
        geometryId,
        originalFeature: {
            geometry: {
                coordinates: coordAll(points),
                type: "LineString",
            },
            properties: {},
            type: "Feature"
        },
        point: 1,
        referenceId,
        referenceLength: 1,
        roadClass: '',
        section: [1],
        side: '',
        streetname: 'street-'+referenceId,
        toIntersectionId,
        toStreetnames: ['street-'+toIntersectionId]
    };
    const path = new SharedStreetsMatchGeomPath(
        lineString(coordAll(points), pathProperties)
    );

    return path;
}

// export const createOneWayStreetFromStreet = (direction: string, fromStreet: SharedStreetsMatchPath) : SharedStreetsMatchPath => {
//     const points = randomPoint(2);
//     const geometryId = uuid();
//     const referenceId = uuid();
//     const fromIntersectionId = fromStreet.properties.referenceId;
//     const toIntersectionId = fromStreet.properties.referenceId;

//     const pathProperties: ISharedStreetsMatchPathProperties = {
//         direction,
//         fromIntersectionId,
//         fromStreetnames: ['street-'+referenceId],
//         geometryId,
//         originalFeature: {
//             geometry: {
//                 coordinates: coordAll(points),
//                 type: "LineString",
//             },
//             properties: {},
//             type: "Feature"
//         },
//         point: 1,
//         referenceId,
//         referenceLength: 1,
//         roadClass: '',
//         section: [1],
//         side: '',
//         streetname: 'street-'+referenceId,
//         toIntersectionId,
//         toStreetnames: ['street-'+toIntersectionId]
//     };
//     const path = new SharedStreetsMatchPath(
//         lineString(coordAll(points), pathProperties)
//     );

//     return path;
// }

// export const createOneWayStreetToStreet = (direction: string, toStreet: SharedStreetsMatchPath) : SharedStreetsMatchPath => {
//     const points = randomPoint(2);
//     const geometryId = uuid();
//     const referenceId = uuid();
//     const fromIntersectionId = toStreet.properties.referenceId;
//     const toIntersectionId = toStreet.properties.referenceId;

//     const pathProperties: ISharedStreetsMatchPathProperties = {
//         direction,
//         fromIntersectionId,
//         fromStreetnames: ['street-'+referenceId],
//         geometryId,
//         originalFeature: {
//             geometry: {
//                 coordinates: coordAll(points),
//                 type: "LineString",
//             },
//             properties: {},
//             type: "Feature"
//         },
//         point: 1,
//         referenceId,
//         referenceLength: 1,
//         roadClass: '',
//         section: [1],
//         side: '',
//         streetname: 'street-'+referenceId,
//         toIntersectionId,
//         toStreetnames: ['street-'+toIntersectionId]
//     };
//     const path = new SharedStreetsMatchPath(
//         lineString(coordAll(points), pathProperties)
//     );

//     return path;
// }
