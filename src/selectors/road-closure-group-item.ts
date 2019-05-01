import { SharedStreetsMatchPath } from 'src/models/SharedStreets/SharedStreetsMatchPath';

export const selectMatchedStreetsGroupFilteredByDirection = (
    matchedStreetsGroup: SharedStreetsMatchPath[],
    geometryIdDirectionFilter: { [ geometryId: string] : { forward: boolean, backward: boolean } },
) => {
    return matchedStreetsGroup.filter((path: SharedStreetsMatchPath) => {
        const directionFilter = geometryIdDirectionFilter[path.properties.geometryId];
        if (directionFilter && directionFilter.forward) {
            if (path.properties.direction === "forward") {
                return true;
            } else { return false; }
        }
        else if (directionFilter && directionFilter.backward) {
            if (path.properties.direction === "backward") {
                return true;
            } else { return false; }
        } 
        else {
            return false
        }
    });
}