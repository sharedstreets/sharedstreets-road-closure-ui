import { forEach } from 'lodash';
import {
    RoadClosureWazeIncidentsItem,
} from 'src/models/RoadClosureWazeIncidentsItem';
import { SharedStreetsMatchPath } from 'src/models/SharedStreets/SharedStreetsMatchPath';
import { IRoadClosureState } from 'src/store/road-closure';

export const currentRoadClosureItemSelector = (state: IRoadClosureState) => {
    return state.currentItem;
};


export function currentRoadClosureItemToGeojson(state: IRoadClosureState){
    const currentItem = currentRoadClosureItemSelector(state);
    const output = {
        incidents: Array<RoadClosureWazeIncidentsItem>()
    };
    if (currentItem.matchedStreets) {
        forEach(currentItem.matchedStreets.features, (segment: SharedStreetsMatchPath|SharedStreetsMatchPath, index) => {
            if (segment instanceof SharedStreetsMatchPath) {
                const outputItem = new RoadClosureWazeIncidentsItem(segment, currentItem.form);
                output.incidents.push(outputItem);
            }
        });
    }
    return output;
}