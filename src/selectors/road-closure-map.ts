import bearing from '@turf/bearing';
import { featureCollection, point } from '@turf/helpers';
import midpoint from '@turf/midpoint';
// import { SharedStreetsMatchPath } from 'src/models/SharedStreets/SharedStreetsMatchPath';
import { IRoadClosureState } from 'src/store/road-closure';
import { getContiguousFeatureGroups } from './road-closure-geojson';

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

export const getDirectionIconPoints = (state: IRoadClosureState) => {
    const groupedPaths: any = getContiguousFeatureGroups(state);
    if (groupedPaths.length === 0) {
        return featureCollection([]);
    }


    const outputFeatures: any[] = [];
    groupedPaths.forEach((featureGroup: any[]) => {
        featureGroup.forEach((feature: any) => {
            const featureMidpoint = midpoint(
                feature.geometry.coordinates[0],
                feature.geometry.coordinates[
                    feature.geometry.coordinates.length-1
                ]
            );
            featureMidpoint.properties = {
                bearing: bearing(
                    feature.geometry.coordinates[0],
                    feature.geometry.coordinates[
                        feature.geometry.coordinates.length-1
                    ]
                )
            };
            outputFeatures.push(
                featureMidpoint  
            );
        });
    });

    return featureCollection(outputFeatures);
}