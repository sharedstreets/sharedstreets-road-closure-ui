import {
    forEach,
} from 'lodash';
import {
    IRoadClosureOutputFormatName,
} from '../models/RoadClosureOutputStateItem';
import {
    RoadClosureWazeIncidentsItem,
} from '../models/RoadClosureWazeIncidentsItem';
import { SharedStreetsMatchPath } from '../models/SharedStreets/SharedStreetsMatchPath';
import { IRoadClosureState } from '../store/road-closure';
import { currentItemToGeojson } from './road-closure-geojson';

export const currentRoadClosureItemSelector = (state: IRoadClosureState) => {
    return state.currentItem;
};

export const currentRoadClosureItemOutput = (state: IRoadClosureState, outputFormat?: IRoadClosureOutputFormatName): any => {
    let outputFormatName = state.output.outputFormat;
    if (outputFormat) {
        outputFormatName = outputFormat;
    }
    switch(outputFormatName) {
        case 'waze':
            return {
                incidents: currentRoadClosureItemToWaze(state),
            };
        case 'geojson':
        default:
            return currentItemToGeojson(state);
    }
};

export function currentRoadClosureItemToWaze(state: IRoadClosureState){
    const currentItem = currentRoadClosureItemSelector(state);
    const incidents: RoadClosureWazeIncidentsItem[] = [];
    if (currentItem) {
        forEach(currentItem.features, (segment: SharedStreetsMatchPath|SharedStreetsMatchPath, index) => {
            if (segment instanceof SharedStreetsMatchPath) {
                if (currentItem.properties.geometryIdDirectionFilter[segment.properties.geometryId].forward && 
                    currentItem.properties.geometryIdDirectionFilter[segment.properties.geometryId].backward) {
                        // if both, use forward reference
                        if (segment.properties.direction === "forward") {
                            const outputItem = new RoadClosureWazeIncidentsItem(segment, currentItem.properties, true);
                            incidents.push(outputItem);
                        }
                } else if (currentItem.properties.geometryIdDirectionFilter[segment.properties.geometryId].forward && 
                    !currentItem.properties.geometryIdDirectionFilter[segment.properties.geometryId].backward) {
                        if (segment.properties.direction === "forward") {
                            const outputItem = new RoadClosureWazeIncidentsItem(segment, currentItem.properties, false);
                            incidents.push(outputItem);
                        }
                } else {
                    if (segment.properties.direction === "backward") {
                        const outputItem = new RoadClosureWazeIncidentsItem(segment, currentItem.properties, false);
                        incidents.push(outputItem);
                    }
                }
            }
        });
    }
    return incidents;
}