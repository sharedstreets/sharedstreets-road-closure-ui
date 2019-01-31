import { 
    Feature,
    FeatureCollection,
} from 'geojson';
import {
    // forEach,
    isEmpty,
    isEqual,
    uniq,
} from 'lodash';
import { SharedStreetsMatchPath } from './SharedStreetsMatchPath';
import { SharedStreetsMatchPoint } from './SharedStreetsMatchPoint';

export class SharedStreetsMatchFeatureCollection implements FeatureCollection {
    public type: "FeatureCollection" = "FeatureCollection";
    public features: Array<SharedStreetsMatchPath | SharedStreetsMatchPoint> = [];

    public contiguousFeatureGroups: SharedStreetsMatchPath[][] = [];
    public contiguousFeatureGroupsDirections: Array<{ forward: boolean, backward: boolean }> = [];
    public geometryIdPathMap: { [geomId: string]: { [direction: string] : SharedStreetsMatchPath} } = {};
    protected referenceIdFeatureMap: { [refId: string]: SharedStreetsMatchPath } = {};

    public getFeatureCollection(): FeatureCollection {
        return {
            features: this.features,
            type: this.type,
        }
    }
    
    public getFeatureCollectionOfPaths(): FeatureCollection {
        return {
            type: this.type,
            // disable tslint so type can appear at the top of the output
            // tslint:disable-next-line
            features: this.features.filter((feature) => feature instanceof SharedStreetsMatchPath),
        }
    }

    public addFeatures(newFeatures: Array<SharedStreetsMatchPath | SharedStreetsMatchPoint>) {
        this.features = this.features.concat(newFeatures);
    }

    public addFeaturesFromGeojson(newFeatures: Feature[]) {
        const newFeaturesArray: Array<SharedStreetsMatchPath | SharedStreetsMatchPoint> = newFeatures.map((feature: Feature) => {
            if (feature.geometry.type === "Point") {
                const point = new SharedStreetsMatchPoint(feature);
                // this.referenceIdFeatureMap[point.properties.id] = point;
                return point;
            }
            else {
                const path = new SharedStreetsMatchPath(feature);
                this.referenceIdFeatureMap[path.properties.referenceId] = path; 
                if (!this.geometryIdPathMap[path.properties.geometryId]) {
                    this.geometryIdPathMap[path.properties.geometryId] = {};
                }   
                this.geometryIdPathMap[path.properties.geometryId][path.properties.direction] = path;
                return path;
            }
        });
        this.features = this.features.concat(newFeaturesArray);
        
        this.getContiguousPaths();
    }

    /**
     * getContiguousPaths
     * this does depth-first search on the `features` array on this class to find
     * paths connected by their intersection IDs, grouped by street name. 
     */
    public getContiguousPaths(): void {
        const output: SharedStreetsMatchPath[][] = [];
        const newContiguousFeatureGroupsDirections: Array<{ forward: boolean, backward: boolean }> = []
        let forwardOutput: SharedStreetsMatchPath[] = [];
        let backwardOutput: SharedStreetsMatchPath[] = [];

        const refIdStack = Object.keys(this.referenceIdFeatureMap).map((refId, index) => {
            return {
                refId,
                visited: false,
            }
        });

        while (!isEmpty(refIdStack)) {
            const curr = refIdStack.pop();
            const currFeature = this.referenceIdFeatureMap[curr!.refId];
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
                    const refIdStackItemFeature = this.referenceIdFeatureMap[item.refId];
                    if (isEqual(refIdStackItemFeature, currFeature)) {
                        return false;
                    }
                    if ( !item.visited &&
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
        }
        if (newContiguousFeatureGroupsDirections.length === 0
            && Object.keys(this.referenceIdFeatureMap).length === 1) {
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
        this.contiguousFeatureGroupsDirections = newContiguousFeatureGroupsDirections;
        this.contiguousFeatureGroups = output;
    }

    /**
     * removeFeatureByReferenceId
     */
    public removePathByReferenceId(referenceId: string) {
        this.features = this.features.filter((feature: SharedStreetsMatchPath) => {
            return feature.properties.referenceId !== referenceId;
        });
    }
    /**
     * removePathByGeometryId
     */
    public removePathByGeometryId(geometryId: string) {
        this.features = this.features.filter((feature: SharedStreetsMatchPath) => {
            return feature.properties.geometryId !== geometryId;
        });

        this.getContiguousPaths();
    }
}