import along from '@turf/along';
import bearing from '@turf/bearing';
import { featureCollection, point } from '@turf/helpers';
import length from '@turf/length';
import { uniqBy } from 'lodash';
// import midpoint from '@turf/midpoint';
// import { SharedStreetsMatchPath } from 'src/models/SharedStreets/SharedStreetsMatchPath';
import { SharedStreetsMatchGeomPath } from 'src/models/SharedStreets/SharedStreetsMatchGeomPath';
import { IRoadClosureState } from 'src/store/road-closure';
import { currentItemToGeojson, getContiguousFeatureGroups } from './road-closure-geojson';

export const getRoadBlockIconPoints = (state: IRoadClosureState) => {
    const groupedPaths: any = getContiguousFeatureGroups(state);
    if (groupedPaths.length === 0) {
        return featureCollection([]);
    }


    const outputFeatures: any[] = [];
    groupedPaths.forEach((featureGroup: any[]) => {
        // const featureGroupByDirection = featureGroup
        //     .filter((path: SharedStreetsMatchPath) => state.currentItem.properties.geometryIdDirectionFilter[path.properties.geometryId][path.properties.direction]);
        featureGroup.forEach((feature: any) => {
            outputFeatures.push(
                point(feature.geometry.coordinates[0]),
            );
        });
        outputFeatures.push(
            point(featureGroup[featureGroup.length-1].geometry.coordinates[
                featureGroup[featureGroup.length-1].geometry.coordinates.length - 1
            ])
        )
    });

    return featureCollection(outputFeatures);
}

export const getIntersectionPoints = (state: IRoadClosureState) => {
    const currentItem = currentItemToGeojson(state);
    if (currentItem.features.length === 0) {
        return featureCollection([]);
    }

    let outputFeatures: any[] = [];
    currentItem.features.forEach((feature: SharedStreetsMatchGeomPath) => {
        const formStreetForFeature = Object.values(state.currentItem.properties.street[feature.properties.geometryId]).filter((street) => street.referenceId === feature.properties.referenceId);
        const isFromIntersectionClosed = formStreetForFeature[0].intersectionsStatus && formStreetForFeature[0].intersectionsStatus[feature.properties.fromIntersectionId];
        const isToIntersectionClosed = formStreetForFeature[0].intersectionsStatus && formStreetForFeature[0].intersectionsStatus[feature.properties.toIntersectionId];
        outputFeatures.push(
            point(feature.geometry.coordinates[0], {
                closed: isFromIntersectionClosed,
                id: feature.properties.fromIntersectionId,
            }),
        );
        outputFeatures.push(
            point(feature.geometry.coordinates[
                feature.geometry.coordinates.length-1
            ], {
                closed: isToIntersectionClosed,
                id: feature.properties.toIntersectionId,
            })
        );
    });

    outputFeatures = uniqBy(outputFeatures, (o) => o.properties.id);
    return featureCollection(outputFeatures);
}

export const getDirectionIconPoints = (state: IRoadClosureState) => {
    // const groupedPaths: any = getContiguousFeatureGroups(state);
    // if (groupedPaths.length === 0) {
    //     return featureCollection([]);
    // }
        
    const currentItem = currentItemToGeojson(state);
    if (currentItem.features.length === 0) {
        return featureCollection([]);
    }

    const outputFeatures: any[] = [];
    currentItem.features.forEach((feature: any) => {
        const featureLength = length(feature, {units: "meters"});
        const halfwayAlongFeature = along(feature, featureLength/2, {units: "meters"})
        halfwayAlongFeature.properties = {
            bearing: bearing(
                feature.geometry.coordinates[0],
                feature.geometry.coordinates[
                    feature.geometry.coordinates.length-1
                ]
            )
        };
        outputFeatures.push(
            halfwayAlongFeature  
        );
    });

    return featureCollection(outputFeatures);
}
