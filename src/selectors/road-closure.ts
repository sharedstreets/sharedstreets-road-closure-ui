import { lineString } from '@turf/helpers';
import { getType } from '@turf/invariant';
import { forEach } from 'lodash';
import { RoadClosureFormStateStreet } from 'src/models/RoadClosureFormStateStreet';
import {
    RoadClosureWazeIncidentsItem,
} from 'src/models/RoadClosureWazeIncidentsItem';
// import { RootState } from 'src/store/configureStore';
import { IRoadClosureState } from 'src/store/road-closure';

export const currentRoadClosureItemSelector = (state: IRoadClosureState) => {
    return state.items[state.currentIndex];
};

export const lineStringFromSelectedPoints = (state: IRoadClosureState) => {
    const currentItem = currentRoadClosureItemSelector(state);
    const coords: any = [];
    currentItem.selectedPoints[state.currentSelectionIndex].forEach((v: any) => {
        coords.push([v.lng, v.lat])
    });
    const linestring = lineString(coords);
    return linestring;
};

export const streetnameMatchedStreetIndexMap = (state: IRoadClosureState) => {
    const currentItem = currentRoadClosureItemSelector(state);
    const currentMatchedStreets = currentItem.matchedStreets[state.currentSelectionIndex];
    const output = {};
    if (currentMatchedStreets) {
        forEach(currentMatchedStreets, (featureCollection: any) => {
            forEach(featureCollection.features, (segment, index) => {
                if (getType(segment) === "LineString") {
                    if (!output[segment.properties.streetname]) {
                        output[segment.properties.streetname] = [];
                    }
                    output[segment.properties.streetname].push(index);
                }
            })
        });
    }
    return output;
};

export const streetnameReferenceIdMap = (state: IRoadClosureState) => {
    const currentItem = currentRoadClosureItemSelector(state);
    const currentFormStreets = currentItem.form.street[state.currentSelectionIndex];
    const output = {};
    if (currentFormStreets) {
        forEach(currentFormStreets, (street: RoadClosureFormStateStreet) => {
            if (!output[street.streetname]) {
                output[street.streetname] = [];
            }
            output[street.streetname].push(street.referenceId);
        });
    }
    return output;
};

export function allRoadClosureItemsToGeojson(state: IRoadClosureState) {
    const output = {
        incidents: Array<RoadClosureWazeIncidentsItem>()
    };
    forEach((state.items), (currentItem) => {
        forEach((currentItem.matchedStreets), (currentMatchedStreets) => {
            if (currentMatchedStreets) {
                forEach(currentMatchedStreets, (featureCollection: GeoJSON.FeatureCollection, selectionIndex) => {
                    forEach(featureCollection.features, (segment: GeoJSON.Feature, index) => {
                        if (getType(segment) === "LineString") {
                            const outputItem = new RoadClosureWazeIncidentsItem(segment, currentItem.form);
                            output.incidents.push(outputItem);
                        }
                    })
                });
            }
        });
    });
    return output;
}

export function currentRoadClosureItemToGeojson(state: IRoadClosureState){
    // const streetnameMatchedStreetMap = streetnameMatchedStreetIndexMap(state);
    const currentItem = currentRoadClosureItemSelector(state);
    const currentMatchedStreets = currentItem.matchedStreets[state.currentSelectionIndex];
    // const currentFormStreets = currentItem.form.street[state.currentSelectionIndex];
    const output = {
        incidents: Array<RoadClosureWazeIncidentsItem>()
    };
    if (currentMatchedStreets) {
        forEach(currentMatchedStreets, (featureCollection: GeoJSON.FeatureCollection, selectionIndex) => {
            forEach(featureCollection.features, (segment: GeoJSON.Feature, index) => {
                if (getType(segment) === "LineString") {
                    const outputItem = new RoadClosureWazeIncidentsItem(segment, currentItem.form);
                    output.incidents.push(outputItem);
                }
            })
        });
    }
    return output;
}