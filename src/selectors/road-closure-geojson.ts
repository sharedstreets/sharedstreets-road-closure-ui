import {
    // forEach,
    isEmpty,
    // isEqual,
    omit,
    reverse,
    uniq,
} from 'lodash';
import { SharedStreetsMatchGeomPath } from '../models/SharedStreets/SharedStreetsMatchGeomPath';
import { IRoadClosureState } from '../store/road-closure';

export const currentItemToGeojson = (state: IRoadClosureState) => {
    return {
        ...state.currentItem,
        features: state.currentItem.features.filter((feature) => feature instanceof SharedStreetsMatchGeomPath)
                .filter((path: SharedStreetsMatchGeomPath) => {
                    return state.currentItem.properties.geometryIdDirectionFilter[path.properties.geometryId][path.properties.direction]
                })
                .map((path: SharedStreetsMatchGeomPath) => {
                    path.properties.streetname = state.currentItem.properties.street[path.properties.geometryId][path.properties.direction].streetname;
                    return omit(path, ['color']);
                }),
        properties: omit(state.currentItem.properties, ['geometryIdDirectionFilter', 'street'])
    }
}

export const getReferenceIdFeatureMap = (state: IRoadClosureState) => {
    const referenceIdFeatureMap: { [refId: string]: SharedStreetsMatchGeomPath } = {};
    state.currentItem.features.map((feature) => {
        if (feature instanceof SharedStreetsMatchGeomPath) {
            referenceIdFeatureMap[feature.properties.referenceId] = feature;
        }
    });
    return referenceIdFeatureMap;
};

export const getGeometryIdPathMap = (state: IRoadClosureState) => {
    const geometryIdPathMap: { [geomId: string]: { [direction: string] : SharedStreetsMatchGeomPath} } = {};
    state.currentItem.features.map((feature) => {
        if (feature instanceof SharedStreetsMatchGeomPath) {
            if (!geometryIdPathMap[feature.properties.geometryId]) {
                geometryIdPathMap[feature.properties.geometryId] = {};
            }   
            geometryIdPathMap[feature.properties.geometryId][feature.properties.direction] = feature;
        }
    });
    return geometryIdPathMap;
};

export const arePathsAdjacent = (thisPath: SharedStreetsMatchGeomPath, thatPath: SharedStreetsMatchGeomPath) => {
    // returns true if thisPath and thatPath are adjacent, as defined by:
    //     - don't have different streetname values 
    //     - don't have the same geometry ID (to avoid 2-ways)
    //     - have either the same from/to or to/from intersections
    // returns false otherwise
    if (thisPath.properties.streetname !== thatPath.properties.streetname) {
        return false;
    }
    if (thisPath.properties.geometryId === thatPath.properties.geometryId) {
        return false;
    }
    return (
        thatPath.properties.toIntersectionId === thisPath.properties.fromIntersectionId
        || thatPath.properties.fromIntersectionId === thisPath.properties.toIntersectionId
        // || thatPath.properties.toIntersectionId === thisPath.properties.toIntersectionId
        // || thatPath.properties.fromIntersectionId === thisPath.properties.fromIntersectionId
    )
};

export const getAdjacencyListFromState = (state: IRoadClosureState) => {
    const output: {
        [refId: string]: string[]
    } = {};
    state.currentItem.features.forEach((feature) => {
        if (feature instanceof SharedStreetsMatchGeomPath) {
            output[feature.properties.referenceId] = [];
            state.currentItem.features.forEach((innerFeature) => {
                if (innerFeature instanceof SharedStreetsMatchGeomPath) {
                    if (arePathsAdjacent(feature, innerFeature)) {
                        output[feature.properties.referenceId].push(innerFeature.properties.referenceId);
                    }
                }
            });
            output[feature.properties.referenceId] = uniq(output[feature.properties.referenceId]);
        }
    });
    return output;
}

export const groupPathsByContiguitySplitByIntersection = (state: IRoadClosureState) => {
    const output: SharedStreetsMatchGeomPath[][] = [];
    const groups = groupPathsByContiguity(state);
    groups.forEach((group) => {
        const intersections = {};
        group.forEach((outputValue) => {
            if (!intersections[outputValue.properties.toIntersectionId]) {
                intersections[outputValue.properties.toIntersectionId] = 0;
            }
            intersections[outputValue.properties.toIntersectionId]++;
            if (!intersections[outputValue.properties.fromIntersectionId]) {
                intersections[outputValue.properties.fromIntersectionId] = 0;
            }
            intersections[outputValue.properties.fromIntersectionId]++;
        });
        // tslint:disable-next-line
        // console.log("intersections", intersections);
        if (Object.values(intersections).filter(count => count > 2).length > 0) {
            // if there's a >2 way intersection in a group, do not group these togther 
            group.forEach((out) => {
                output.push([out]);
            });
        } else {
            output.push(group);
        }
    });
    return output;
}


export const groupPathsByContiguity = (state: IRoadClosureState) => {
    const output: SharedStreetsMatchGeomPath[][] = [];
    let forwardOutput: SharedStreetsMatchGeomPath[] = [];
    let backwardOutput: SharedStreetsMatchGeomPath[] = [];
    const referenceIdFeatureMap = getReferenceIdFeatureMap(state);
    const refIdStack = Object.keys(referenceIdFeatureMap).map((refId, index) => {
        return {
            refId,
            visited: false,
        }
    });
    const adjacencyList = getAdjacencyListFromState(state);

    const depthFirstSearch = (refId: string) => {
        // for each adjacent to refId
        // tslint:disable-next-line
        // console.log("adjacents for,", refId);
        // adjacencyList[refId].map((val) => {
        //     // tslint:disable-next-line
        //     console.log(val.substr(0,4));
        // })
        adjacencyList[refId].forEach((adjacentRefId) => {
            const adjacentRefIdStackItem = refIdStack.find((val) => val.refId === adjacentRefId);
            if (adjacentRefIdStackItem && !adjacentRefIdStackItem.visited) {
                adjacentRefIdStackItem.visited = true;
                
                // tslint:disable-next-line
                // console.log(refIdStack.map((i) => [i.refId.substr(0,4), i.visited, referenceIdFeatureMap[i.refId].properties.streetname]));
                // add to group
                const currFeature = referenceIdFeatureMap[adjacentRefIdStackItem.refId];
                if (currFeature.properties.direction === "forward") {
                    if (!isEmpty(forwardOutput)) {
                        let spliceIndex = 0;
                        forwardOutput.forEach((path, index) => {
                            if (arePathsAdjacent(currFeature, path)) {
                                spliceIndex = index;
                            }
                        });
                        forwardOutput.splice(spliceIndex, 0, currFeature);
                    } else {
                        forwardOutput.push(currFeature);
                    }
                } else {
                    if (!isEmpty(backwardOutput)) {
                        let spliceIndex = 0;
                        backwardOutput.forEach((path, index) => {
                            if (arePathsAdjacent(currFeature, path)) {
                                spliceIndex = index;
                            }
                        });
                        backwardOutput.splice(spliceIndex, 0, currFeature);
                    } else {
                        backwardOutput.push(currFeature);
                    }
                }
                depthFirstSearch(adjacentRefId);
            }
        });
    }

    // outer loop of depth first search
    refIdStack.forEach((refIdItem) => {
        if (!refIdItem.visited) {
            refIdItem.visited = true;
            // tslint:disable-next-line
            // console.log(refIdStack.map((i) => [i.refId.substr(0,4), i.visited, referenceIdFeatureMap[i.refId].properties.streetname]));
            // add to group
            const currFeature = referenceIdFeatureMap[refIdItem.refId];
            if (currFeature.properties.direction === "forward") {
                if (!isEmpty(forwardOutput)) {
                    let spliceIndex = 0;
                    forwardOutput.forEach((path, index) => {
                        if (arePathsAdjacent(currFeature, path)) {
                            spliceIndex = index;
                        }
                    });
                    forwardOutput.splice(spliceIndex, 0, currFeature);
                } else {
                    forwardOutput.push(currFeature);
                }
            } else {
                if (!isEmpty(backwardOutput)) {
                    let spliceIndex = 0;
                    backwardOutput.forEach((path, index) => {
                        if (arePathsAdjacent(currFeature, path)) {
                            spliceIndex = index;
                        }
                    });
                    backwardOutput.splice(spliceIndex, 0, currFeature);
                } else {
                    backwardOutput.push(currFeature);
                }
            }
            // tslint:disable-next-line
            // console.log(currFeature.properties.streetname, ":", currFeature.properties.referenceId);
            // dfs
            depthFirstSearch(refIdItem.refId);
            const combinedOutput = (forwardOutput.concat(backwardOutput));
            if (!isEmpty(combinedOutput)) {
                // tslint:disable-next-line
                // console.log("group:", combinedOutput.map((o) => o.properties.streetname));
                output.unshift(reverse(combinedOutput));
            }
            forwardOutput = [];
            backwardOutput = [];
        }
    });

    // tslint:disable-next-line
    // console.log("output", output.length);
    return output;
}

export const getContiguousFeatureGroups = (state: IRoadClosureState) => {
    return groupPathsByContiguitySplitByIntersection(state);
}

export const getContiguousFeatureGroupsDirections = (state: IRoadClosureState) => {
    const output: Array<{ forward: boolean, backward: boolean }> = [];
    const groups = getContiguousFeatureGroups(state);
    groups.forEach((group) => {
        const directions = uniq(group.filter((feature) => feature instanceof SharedStreetsMatchGeomPath)
                    .map((feature: SharedStreetsMatchGeomPath) => feature.properties.direction));
                    
        output.push({
            backward: directions.indexOf("backward") >= 0 ? true : false,
            forward: directions.indexOf("forward") >= 0 ? true : false,
        })
    });

    return output;
}

