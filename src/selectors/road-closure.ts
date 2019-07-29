import {
    forEach,
} from 'lodash';
import {
    IRoadClosureOutputFormatName,
} from '../models/RoadClosureOutputStateItem';
import {
    RoadClosureWazeIncidentsItem,
} from '../models/RoadClosureWazeIncidentsItem';
import { SharedStreetsMatchGeomPath } from '../models/SharedStreets/SharedStreetsMatchGeomPath';
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
        forEach(currentItem.features, (segment: SharedStreetsMatchGeomPath|SharedStreetsMatchGeomPath, index) => {
            forEach(currentItem.properties.schedule, (schedule, week) => {
                if (segment instanceof SharedStreetsMatchGeomPath) {
                    if (currentItem.properties.geometryIdDirectionFilter[segment.properties.geometryId].forward && 
                        currentItem.properties.geometryIdDirectionFilter[segment.properties.geometryId].backward) {
                            // if both, use forward reference
                            if (segment.properties.direction === "forward") {
                                const outputItem = new RoadClosureWazeIncidentsItem(segment, currentItem.properties, true, schedule, week);
                                incidents.push(outputItem);
                            }
                    } else if (currentItem.properties.geometryIdDirectionFilter[segment.properties.geometryId].forward && 
                        !currentItem.properties.geometryIdDirectionFilter[segment.properties.geometryId].backward) {
                            if (segment.properties.direction === "forward") {
                                const outputItem = new RoadClosureWazeIncidentsItem(segment, currentItem.properties, false, schedule, week);
                                incidents.push(outputItem);
                            }
                    } else {
                        if (segment.properties.direction === "backward") {
                            const outputItem = new RoadClosureWazeIncidentsItem(segment, currentItem.properties, false, schedule, week);
                            incidents.push(outputItem);
                        }
                    }
                }
            })
        });
    }
    return incidents;
}