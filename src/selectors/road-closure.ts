import { forEach } from 'lodash';
import {
    IRoadClosureOutputFormatName,
    RoadClosureOutputStateItem
} from '../models/RoadClosureOutputStateItem';
import {
    RoadClosureWazeIncidentsItem,
} from '../models/RoadClosureWazeIncidentsItem';
import { SharedStreetsMatchPath } from '../models/SharedStreets/SharedStreetsMatchPath';
import { IRoadClosureState } from '../store/road-closure';

export const currentRoadClosureItemSelector = (state: IRoadClosureState) => {
    return state.currentItem;
};

export const currentRoadOutputToItem = (o: any) => {
    return; 
};

export const currentRoadClosureItemOutput = (state: IRoadClosureState, outputFormat?: IRoadClosureOutputFormatName) : RoadClosureOutputStateItem => {
    let outputFormatName = state.output.outputFormat;
    if (outputFormat) {
        outputFormatName = outputFormat;
    }
    const output = new RoadClosureOutputStateItem(outputFormatName);
    switch(outputFormatName) {
        case 'waze':
            output.incidents = currentRoadClosureItemToWaze(state);
            return output;
        case 'geojson':
        default:
            const fc = state.currentItem.matchedStreets.getFeatureCollectionOfPaths();
            output.features = fc.features;
            // TODO - this is a bad hack. need to write an actual geojson output layer
            const tempIncidents = currentRoadClosureItemToWaze(state);
            forEach(output.features, (feature) => {
                feature.properties!.creationtime = tempIncidents[0].creationtime;
                feature.properties!.updatetime = tempIncidents[0].updatetime;
                feature.properties!.starttime = tempIncidents[0].starttime;
                feature.properties!.endtime = tempIncidents[0].endtime;
                feature.properties!.type = tempIncidents[0].type;
                feature.properties!.subtype = tempIncidents[0].subtype;
                feature.properties!.description = tempIncidents[0].description;
            });
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