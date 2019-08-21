import { SharedStreetsMatchGeomPath } from 'src/models/SharedStreets/SharedStreetsMatchGeomPath';

const MAX_DISTANCE_FROM_INTERSECTION = 2;

export const getIntersectionValidityForPath = (feature: SharedStreetsMatchGeomPath) => {
    return {
        fromIntersection: (Math.abs(feature.properties.referenceLength-Math.abs(feature.properties.referenceLength-feature.properties.section[0]))) < MAX_DISTANCE_FROM_INTERSECTION,
        toIntersection: (Math.abs(feature.properties.referenceLength-feature.properties.section[1])) < MAX_DISTANCE_FROM_INTERSECTION
    }
};