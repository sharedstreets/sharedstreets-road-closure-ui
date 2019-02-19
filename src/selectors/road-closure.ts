import { forEach } from 'lodash';
import { RoadClosureOutputStateItem } from 'src/models/RoadClosureOutputStateItem';
import {
    RoadClosureWazeIncidentsItem,
} from 'src/models/RoadClosureWazeIncidentsItem';
import { SharedStreetsMatchPath } from 'src/models/SharedStreets/SharedStreetsMatchPath';
import { IRoadClosureState } from 'src/store/road-closure';

export const currentRoadClosureItemSelector = (state: IRoadClosureState) => {
    return state.currentItem;
};

export const currentRoadClosureItemOutput = (state: IRoadClosureState) : RoadClosureOutputStateItem => {
    const output = new RoadClosureOutputStateItem(state.output.outputFormat);
    switch(state.output.outputFormat) {
        case 'waze':
            output.incidents = currentRoadClosureItemToWaze(state);
            return output;
        case 'geojson':
        default:
            const fc = state.currentItem.matchedStreets.getFeatureCollectionOfPaths();
            output.features = fc.features;
            output.type = fc.type;
            return output;
    }
};

export function currentRoadClosureItemToWaze(state: IRoadClosureState){
    const currentItem = currentRoadClosureItemSelector(state);
    const incidents: RoadClosureWazeIncidentsItem[] = [];
    if (currentItem.matchedStreets) {
        forEach(currentItem.matchedStreets.features, (segment: SharedStreetsMatchPath|SharedStreetsMatchPath, index) => {
            if (segment instanceof SharedStreetsMatchPath) {
                if (currentItem.geometryIdDirectionFilter[segment.properties.geometryId].forward && 
                    currentItem.geometryIdDirectionFilter[segment.properties.geometryId].backward) {
                        // if both, use forward reference
                        if (segment.properties.direction === "forward") {
                            const outputItem = new RoadClosureWazeIncidentsItem(segment, currentItem.form, true);
                            incidents.push(outputItem);
                        }
                } else if (currentItem.geometryIdDirectionFilter[segment.properties.geometryId].forward && 
                    !currentItem.geometryIdDirectionFilter[segment.properties.geometryId].backward) {
                        if (segment.properties.direction === "forward") {
                            const outputItem = new RoadClosureWazeIncidentsItem(segment, currentItem.form, false);
                            incidents.push(outputItem);
                        }
                } else {
                    if (segment.properties.direction === "backward") {
                        const outputItem = new RoadClosureWazeIncidentsItem(segment, currentItem.form, false);
                        incidents.push(outputItem);
                    }
                }
            }
        });
    }
    return incidents;
}