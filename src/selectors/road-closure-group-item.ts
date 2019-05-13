import { SharedStreetsMatchGeomPath } from 'src/models/SharedStreets/SharedStreetsMatchGeomPath';

export const selectMatchedStreetsGroupFilteredByDirection = (
    matchedStreetsGroup: SharedStreetsMatchGeomPath[],
    geometryIdDirectionFilter: { [ geometryId: string] : { forward: boolean, backward: boolean } },
) => {
    return matchedStreetsGroup.filter((path: SharedStreetsMatchGeomPath) => {
        const directionFilter = geometryIdDirectionFilter[path.properties.geometryId];
        if (directionFilter && directionFilter.forward && directionFilter.backward) {
            if (path.properties.direction === "forward" || path.properties.direction === "backward") {
                return true;
            } else {
                return false;
            }
        }
        else if (directionFilter && directionFilter.forward) {
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