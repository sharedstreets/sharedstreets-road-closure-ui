import { lineString } from '@turf/helpers';
import { forEach } from 'lodash';
import { RootState } from 'src/store/configureStore';

export const currentRoadClosureItemSelector = (state: RootState) => {
    return state.roadClosure.items[state.roadClosure.currentIndex];
};

export const lineStringFromSelectedPoints = (state: RootState) => {
    const currentItem = currentRoadClosureItemSelector(state);
    const coords: any = [];
    currentItem.selectedPoints[state.roadClosure.currentSelectionIndex].forEach((v: any) => {
        coords.push([v.lng, v.lat])
    });
    const linestring = lineString(coords);
    return linestring;
};

export const streetnameMatchedStreetIndexMap = (state: RootState) => {
    const currentItem = currentRoadClosureItemSelector(state);
    const currentMatchedStreets = currentItem.matchedStreets[state.roadClosure.currentSelectionIndex];
    const output = {};
    if (currentMatchedStreets) {
        forEach(currentMatchedStreets, (featureCollection: any) => {
            forEach(featureCollection.features, (segment, index) => {
                if (!output[segment.properties.streetname]) {
                    output[segment.properties.streetname] = [];
                }
                output[segment.properties.streetname].push(index);
            })
        });
    }
    return output;
}