import { forEach } from 'lodash';
import {
    RoadClosureWazeIncidentsItem,
} from 'src/models/RoadClosureWazeIncidentsItem';
import { SharedStreetsMatchPath } from 'src/models/SharedStreets/SharedStreetsMatchPath';
import { IRoadClosureState } from 'src/store/road-closure';

export const currentRoadClosureItemSelector = (state: IRoadClosureState) => {
    return state.currentItem;
};

export const currentRoadClosureItemOutput = (state: IRoadClosureState) => {
    switch(state.output.outputFormat) {
        case 'waze':
            return currentRoadClosureItemToWaze(state)
        case 'geojson':
        default:
            return state.currentItem.matchedStreets.getFeatureCollectionOfPaths();
    }
};

export function currentRoadClosureItemToWaze(state: IRoadClosureState){
    const currentItem = currentRoadClosureItemSelector(state);
    const output = {
        incidents: Array<RoadClosureWazeIncidentsItem>()
    };
    if (currentItem.matchedStreets) {
        forEach(currentItem.matchedStreets.features, (segment: SharedStreetsMatchPath|SharedStreetsMatchPath, index) => {
            if (segment instanceof SharedStreetsMatchPath) {
                if (currentItem.geometryIdDirectionFilter[segment.properties.geometryId].forward && 
                    currentItem.geometryIdDirectionFilter[segment.properties.geometryId].backward) {
                        // if both, use forward reference
                        if (segment.properties.direction === "forward") {
                            const outputItem = new RoadClosureWazeIncidentsItem(segment, currentItem.form, true);
                            output.incidents.push(outputItem);
                        }
                } else if (currentItem.geometryIdDirectionFilter[segment.properties.geometryId].forward && 
                    !currentItem.geometryIdDirectionFilter[segment.properties.geometryId].backward) {
                        if (segment.properties.direction === "forward") {
                            const outputItem = new RoadClosureWazeIncidentsItem(segment, currentItem.form, false);
                            output.incidents.push(outputItem);
                        }
                } else {
                    if (segment.properties.direction === "backward") {
                        const outputItem = new RoadClosureWazeIncidentsItem(segment, currentItem.form, false);
                        output.incidents.push(outputItem);
                    }
                }
            }
        });
    }
    return output;
}