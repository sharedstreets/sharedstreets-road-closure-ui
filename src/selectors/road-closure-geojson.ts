import {
    // forEach,
    isEmpty,
    isEqual,
    omit,
    uniq,
} from 'lodash';
import { SharedStreetsMatchPath } from '../models/SharedStreets/SharedStreetsMatchPath';
import { IRoadClosureState } from '../store/road-closure';

export const currentItemToGeojson = (state: IRoadClosureState) => {
    return {
        ...state.currentItem,
        features: state.currentItem.features.filter((feature) => feature instanceof SharedStreetsMatchPath)
                .filter((path: SharedStreetsMatchPath) => {
                    return state.currentItem.properties.geometryIdDirectionFilter[path.properties.geometryId][path.properties.direction]
                })
                .map((path: SharedStreetsMatchPath) => {
                    path.properties.streetname = state.currentItem.properties.street[path.properties.geometryId][path.properties.direction].streetname;
                    return path;
                }),
        properties: omit(state.currentItem.properties, ['geometryIdDirectionFilter', 'street'])
    }
}

export const getReferenceIdFeatureMap = (state: IRoadClosureState) => {
    const referenceIdFeatureMap: { [refId: string]: SharedStreetsMatchPath } = {};
    state.currentItem.features.map((feature) => {
        if (feature instanceof SharedStreetsMatchPath) {
            referenceIdFeatureMap[feature.properties.referenceId] = feature;
        }
    });
    return referenceIdFeatureMap;
};

export const getGeometryIdPathMap = (state: IRoadClosureState) => {
    const geometryIdPathMap: { [geomId: string]: { [direction: string] : SharedStreetsMatchPath} } = {};
    state.currentItem.features.map((feature) => {
        if (feature instanceof SharedStreetsMatchPath) {
            if (!geometryIdPathMap[feature.properties.geometryId]) {
                geometryIdPathMap[feature.properties.geometryId] = {};
            }   
            geometryIdPathMap[feature.properties.geometryId][feature.properties.direction] = feature;
        }
    });
    return geometryIdPathMap;
};


export const groupPathsByContiguity = (state: IRoadClosureState, returnDirections: boolean = false) => {
    const output: SharedStreetsMatchPath[][] = [];
    // const intersectionIdDegreeCount = {};
    const newContiguousFeatureGroupsDirections: Array<{ forward: boolean, backward: boolean }> = []
    let forwardOutput: SharedStreetsMatchPath[] = [];
    let backwardOutput: SharedStreetsMatchPath[] = [];

    const referenceIdFeatureMap = getReferenceIdFeatureMap(state);
    const refIdStack = Object.keys(referenceIdFeatureMap).map((refId, index) => {
        return {
            refId,
            visited: false,
        }
    });

    while (!isEmpty(refIdStack)) {
        const curr = refIdStack.pop();
        const currFeature = referenceIdFeatureMap[curr!.refId];
        if (!curr!.visited) {
            curr!.visited = true;
                        
            // place this feature in the correct linear order
            if (currFeature.properties.direction === "forward") {
                if (!isEmpty(forwardOutput) &&
                    forwardOutput[0].properties.direction === currFeature.properties.direction &&
                    forwardOutput[0].properties.fromIntersectionId === currFeature.properties.toIntersectionId) {
                        forwardOutput.unshift(currFeature);
                } else {
                    forwardOutput.push(currFeature);
                }
            } else {
                if (!isEmpty(backwardOutput) &&
                    backwardOutput[0].properties.direction === currFeature.properties.direction &&
                    backwardOutput[0].properties.fromIntersectionId === currFeature.properties.toIntersectionId) {
                        backwardOutput.unshift(currFeature);
                } else {
                    backwardOutput.push(currFeature);
                }
            }
            
            const adjacentPaths = refIdStack.filter((item) => {
                const refIdStackItemFeature = referenceIdFeatureMap[item.refId];
                if (isEqual(refIdStackItemFeature, currFeature)) {
                    return false;
                }

                if ( !item.visited &&
                    // refIdStackItemFeature.properties.direction === currFeature.properties.direction &&
                    // refIdStackItemFeature.properties.geometryId !== currFeature.properties.geometryId &&
                    refIdStackItemFeature.properties.streetname === currFeature.properties.streetname &&
                    (
                        refIdStackItemFeature.properties.toIntersectionId === currFeature.properties.fromIntersectionId ||
                        refIdStackItemFeature.properties.fromIntersectionId === currFeature.properties.toIntersectionId ||
                        refIdStackItemFeature.properties.toIntersectionId === currFeature.properties.toIntersectionId ||
                        refIdStackItemFeature.properties.fromIntersectionId === currFeature.properties.fromIntersectionId
                    )
                ) {
                    return true;
                }
                else {
                    return false;
                }
            });

            // append them to refIdStack to look at next
            refIdStack.push(...adjacentPaths);
        } 
        else {
            // if visited it's already been accounted for
            // and we're at the end of this connected component
            const combinedOutput = forwardOutput.concat(backwardOutput);
            if (!isEmpty(combinedOutput)) {
                const intersections = {};
                combinedOutput.forEach((outputValue) => {
                    if (!intersections[outputValue.properties.toIntersectionId]) {
                        intersections[outputValue.properties.toIntersectionId] = 0;
                    }
                    intersections[outputValue.properties.toIntersectionId]++;
                    if (!intersections[outputValue.properties.fromIntersectionId]) {
                        intersections[outputValue.properties.fromIntersectionId] = 0;
                    }
                    intersections[outputValue.properties.fromIntersectionId]++;
                });
                if (Object.values(intersections).filter(count => count > 2).length > 0) {
                    // if there's a >2 way intersection, do not group these togther 
                    // except for segments with the same geometryId
                    const splitOutputByGeomId: {
                        [key: string]: SharedStreetsMatchPath[]
                    } = {};
                    combinedOutput.forEach((out) => {
                        if (!splitOutputByGeomId[out.properties.geometryId]) {
                            splitOutputByGeomId[out.properties.geometryId] = [];
                        }
                        splitOutputByGeomId[out.properties.geometryId].push(out);
                    });
                    
                    Object.values(splitOutputByGeomId).forEach((subdivision) => {
                        const directions = uniq(subdivision.filter((feature) => feature instanceof SharedStreetsMatchPath)
                        .map((feature: SharedStreetsMatchPath) => feature.properties.direction));
                    
                        // note use of unshift here — we want to add groups to the visual bottom of the list 
                        newContiguousFeatureGroupsDirections.unshift({
                            backward: directions.indexOf("backward") >= 0 ? true : false,
                            forward: directions.indexOf("forward") >= 0 ? true : false,
                        });
                        output.unshift(subdivision);
                    });
                } else {
                    // first, keep track of directionality
                    const directions = uniq(combinedOutput.filter((feature) => feature instanceof SharedStreetsMatchPath)
                        .map((feature: SharedStreetsMatchPath) => feature.properties.direction));
                    
                    // note use of unshift here — we want to add groups to the visual bottom of the list 
                    newContiguousFeatureGroupsDirections.unshift({
                        backward: directions.indexOf("backward") >= 0 ? true : false,
                        forward: directions.indexOf("forward") >= 0 ? true : false,
                    });
                    output.unshift(combinedOutput);
                }

                forwardOutput = [];
                backwardOutput = [];
            }
        }
    }
    if (newContiguousFeatureGroupsDirections.length === 0
        && Object.keys(referenceIdFeatureMap).length === 1 || 2) {
            // handle edge case: if there is one segment that is entirely within one street segment
            const combinedOutput = forwardOutput.concat(backwardOutput);
            if (!isEmpty(combinedOutput)) {
                // first, keep track of directionality
                const directions = uniq(combinedOutput.filter((feature) => feature instanceof SharedStreetsMatchPath)
                    .map((feature: SharedStreetsMatchPath) => feature.properties.direction));
                
                // note use of unshift here — we want to add groups to the visual bottom of the list 
                newContiguousFeatureGroupsDirections.unshift({
                    backward: directions.indexOf("backward") >= 0 ? true : false,
                    forward: directions.indexOf("forward") >= 0 ? true : false,
                });
                output.unshift(combinedOutput);
                forwardOutput = [];
                backwardOutput = [];
            }
    }

    if (returnDirections) {
        return newContiguousFeatureGroupsDirections;
    } else {
        return output;
    }
}

export const getContiguousFeatureGroups = (state: IRoadClosureState) => {
    return groupPathsByContiguity(state);
}

export const getContiguousFeatureGroupsDirections = (state: IRoadClosureState) => {
    return groupPathsByContiguity(state, true);
}