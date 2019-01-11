import {
    concat,
    // dropRight,
    forEach
} from 'lodash';
import { Dispatch } from 'redux';
import { RoadClosureFormStateStreet } from 'src/models/RoadClosureFormStateStreet';
import { RoadClosureStateItem } from "src/models/RoadClosureStateItem";
import { SharedStreetsMatchFeatureCollection } from 'src/models/SharedStreets/SharedStreetsMatchFeatureCollection';
import { SharedStreetsMatchPath } from 'src/models/SharedStreets/SharedStreetsMatchPath';
import { SharedStreetsMatchPoint } from 'src/models/SharedStreets/SharedStreetsMatchPoint';
import {
    allRoadClosureItemsToGeojson, 
    // lineStringFromSelectedPoints
} from 'src/selectors/road-closure';
 import {
     ActionType,
     createAsyncAction,
     createStandardAction,
    //  StateType
} from 'typesafe-actions';
import { fetchAction } from '../api';
// import { RootState } from '../configureStore';


// actions
export type RoadClosureAction = ActionType<typeof ACTIONS>;
export interface IFetchSharedstreetGeomsSuccessResponse {
    matched: SharedStreetsMatchFeatureCollection,
    invalid: GeoJSON.FeatureCollection,
    unmatched: GeoJSON.FeatureCollection
}

export interface IRoadClosureMapboxDrawLineString extends GeoJSON.Feature {
    id: number;
}
export interface IRoadClosureFormInputChangedPayload {
    key: string,
    street?: string,
    referenceId: string,
    geometryId: string,
    referenceIds?: string[],
    startTime?: string,
    endTime?: string,
    description?: string,
    reference?: string,
    subtype?: string,
}

export interface IRoadClosureStateItemToggleDirectionPayload {
    geometryId: string,
    direction: { forward?: boolean, backward?: boolean }
}

export const ACTIONS = {
    // ADD_NEW_SELECTION: createStandardAction('ROAD_CLOSURE/ADD_NEW_SELECTION')<void>(),
    DELETE_STREET_SEGMENT: createStandardAction('ROAD_CLOSURE/DELETE_STREET_SEGMENT')<RoadClosureFormStateStreet>(),
    FETCH_SHAREDSTREET_GEOMS: createAsyncAction(
        'ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_REQUEST',
        'ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_SUCCESS',
        'ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_FAILURE'
    )<void, IFetchSharedstreetGeomsSuccessResponse, Error>(),
    INPUT_CHANGED: createStandardAction('ROAD_CLOSURE/INPUT_CHANGED')<IRoadClosureFormInputChangedPayload>(),
    // LINE_CREATED: createStandardAction('ROAD_CLOSURE/LINE_CREATED')<IRoadClosureMapboxDrawLineString>(),
    // LINE_DELETED: createStandardAction('ROAD_CLOSURE/LINE_DELETED')<IRoadClosureMapboxDrawLineString>(),
    // LINE_EDITED: createStandardAction('ROAD_CLOSURE/LINE_EDITED')<IRoadClosureMapboxDrawLineString>(),
    // NEXT_SELECTION: createStandardAction('ROAD_CLOSURE/NEXT_SELECTION')<void>(),
    // POINT_REMOVED: createStandardAction('ROAD_CLOSURE/POINT_REMOVED')<void>(),
    // POINT_SELECTED: createStandardAction('ROAD_CLOSURE/POINT_SELECTED')<number[]>(),
    // PREVIOUS_SELECTION: createStandardAction('ROAD_CLOSURE/PREVIOUS_SELECTION')<void>(),
    // ROAD_CLOSURE_CREATED: createStandardAction('ROAD_CLOSURE/ROAD_CLOSURE_CREATED')<void>(),
    // ROAD_CLOSURE_DESELECTED: createStandardAction('ROAD_CLOSURE/ROAD_CLOSURE_DESELECTED')<void>(),
    ROAD_CLOSURE_HIDE_OUTPUT: createStandardAction('ROAD_CLOSURE/ROAD_CLOSURE_HIDE_OUTPUT')<void>(),
    // ROAD_CLOSURE_SELECTED: createStandardAction('ROAD_CLOSURE/ROAD_CLOSURE_SELECTED')<number>(),
    ROAD_CLOSURE_VIEW_OUTPUT: createStandardAction('ROAD_CLOSURE/ROAD_CLOSURE_VIEW_OUTPUT')<void>(),
    TOGGLE_DIRECTION_STREET_SEGMENT: createStandardAction('ROAD_CLOSURE/TOGGLE_DIRECTION_STREET_SEGMENT')<IRoadClosureStateItemToggleDirectionPayload[]>(),
    VIEWPORT_CHANGED: createStandardAction('ROAD_CLOSURE/VIEWPORT_CHANGED'),
};
// side effects
// export const lineCreated = (features: IRoadClosureMapboxDrawLineString[]) => (dispatch: Dispatch<any>, getState: any) => {
//     // const state = getState();
//     // // const updatedItems = [
//     // //     ...state.items
//     // // ];
//     const output: any = [];
//     forEach(features, (feature: IRoadClosureMapboxDrawLineString) => {
//         // if (!updatedItems[state.currentIndex].linesDrawn[state.currentIndex][feature.id]) {
//         //     updatedItems[state.currentIndex].linesDrawn[state.currentIndex][feature.id] = {};    
//         // }
//         // updatedItems[state.currentIndex].linesDrawn[state.currentIndex][feature.id] = feature;
//         // output[feature.id] = feature;
//         output.push(findMatchedStreet(feature));
//     });
//     return dispatch(Promise.all(output));
// };

export const findMatchedStreet = (linestring: IRoadClosureMapboxDrawLineString) => (dispatch: Dispatch<any>, getState: any) => {
    // const {
    //     roadClosure,
    // } = getState() as RootState;

    return dispatch(fetchAction({
        afterRequest: (data) => {
            return data;
        },
        // body: lineStringFromSelectedPoints(roadClosure),
        body: linestring,
        endpoint: 'match/geoms',
        method: 'post',
        params: {
            authKey: "bdd23fa1-7ac5-4158-b354-22ec946bb575",
            bearingTolerance: 35,
            ignoreDirection: true,
            includeIntersections: true,
            includeStreetnames: true,
            lengthTolerance: 0.25,
            searchRadius: 25,
            snapTopology: true,
        },
        requested: 'ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_SUCCESS',
        requesting: 'ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_REQUEST',
    }));
};

// reducer
export interface IRoadClosureState {
    currentIndex: number,
    currentSelectionIndex: number,
    isFetchingMatchedStreets: boolean,
    isShowingRoadClosureList: boolean,
    isShowingRoadClosureOutputViewer: boolean,
    items: RoadClosureStateItem[],
    output: any,
};

const defaultState: IRoadClosureState = {
    currentIndex: 0,
    currentSelectionIndex: 0,
    isFetchingMatchedStreets: false,
    isShowingRoadClosureList: false,
    isShowingRoadClosureOutputViewer: false,
    items: [ new RoadClosureStateItem() ],
    output: {
        incidents: []
    },
};

export const roadClosureReducer = (state: IRoadClosureState = defaultState, action: RoadClosureAction) => {
    let updatedItems: RoadClosureStateItem[];
    switch (action.type) {
        // case "ROAD_CLOSURE/ROAD_CLOSURE_CREATED":
        //     updatedItems = [
        //         ...state.items
        //     ];
        //     const newItemIndex = state.items.length;
        //     updatedItems[newItemIndex] = new RoadClosureStateItem();
            
        //     return {
        //         ...state,
        //         currentIndex: newItemIndex,
        //         items: updatedItems
        //     };
        // case "ROAD_CLOSURE/ROAD_CLOSURE_SELECTED":
        //     return {
        //         ...state,
        //         isShowingRoadClosureList: false,
        //     };
        // case "ROAD_CLOSURE/ROAD_CLOSURE_DESELECTED":
        //     return {
        //         ...state,
        //         isShowingRoadClosureList: true,
        //         isShowingRoadClosureOutputViewer: false,
        //     };
        case "ROAD_CLOSURE/ROAD_CLOSURE_HIDE_OUTPUT":
            return {
                ...state,
                isShowingRoadClosureOutputViewer: false,
                output: null,
            };
        case "ROAD_CLOSURE/ROAD_CLOSURE_VIEW_OUTPUT":
            return {
                ...state,
                isShowingRoadClosureOutputViewer: true,
                output: allRoadClosureItemsToGeojson(state),
            };
        // case "ROAD_CLOSURE/PREVIOUS_SELECTION":
        //     return {
        //         ...state,
        //         currentSelectionIndex: state.currentSelectionIndex - 1,
        //     };

        // case "ROAD_CLOSURE/NEXT_SELECTION":
        //     return {
        //         ...state,
        //         currentSelectionIndex: state.currentSelectionIndex + 1,
        //     };

        // case "ROAD_CLOSURE/ADD_NEW_SELECTION":
        //     updatedItems = [
        //         ...state.items
        //     ];

        //     const newSelectionIndex = updatedItems[state.currentIndex].selectedPoints.length;
        //     updatedItems[state.currentIndex].selectedPoints[newSelectionIndex] = [];

        //     updatedItems[state.currentIndex].form.street[newSelectionIndex] = {};

        //     return {
        //         ...state,
        //         currentSelectionIndex: newSelectionIndex,
        //         items: updatedItems,
        //     }
        // case "ROAD_CLOSURE/POINT_REMOVED": 
        //     updatedItems = [
        //         ...state.items
        //     ];
        //     updatedItems[state.currentIndex].selectedPoints[state.currentSelectionIndex] = dropRight(updatedItems[state.currentIndex].selectedPoints[state.currentSelectionIndex]);
        //     updatedItems[state.currentIndex].invalidStreets[state.currentSelectionIndex] = [];
        //     updatedItems[state.currentIndex].matchedStreets[state.currentSelectionIndex] = [];
        //     updatedItems[state.currentIndex].unmatchedStreets[state.currentSelectionIndex] = [];
            
        //     return {
        //         ...state,
        //         items: updatedItems
        //     };
        // case "ROAD_CLOSURE/POINT_SELECTED":
        //     updatedItems = [
        //         ...state.items
        //     ];
        //     updatedItems[state.currentIndex].selectedPoints[state.currentSelectionIndex].push(action.payload)
        //     updatedItems[state.currentIndex].invalidStreets[state.currentSelectionIndex] = [];
        //     updatedItems[state.currentIndex].matchedStreets[state.currentSelectionIndex] = [];
        //     updatedItems[state.currentIndex].unmatchedStreets[state.currentSelectionIndex] = [];
            
        //     return {
        //         ...state,
        //         items: updatedItems
        //     };
        // case "ROAD_CLOSURE/LINE_CREATED":
        // case "ROAD_CLOSURE/LINE_EDITED":
        //     updatedItems = [
        //         ...state.items
        //     ];
        //     // forEach(action.payload, (feature: IRoadClosureMapboxDrawLineString) => {
        //     //     if (!updatedItems[state.currentIndex].linesDrawn[state.currentIndex][feature.id]) {
        //     //         updatedItems[state.currentIndex].linesDrawn[state.currentIndex][feature.id] = {};    
        //     //     }
        //     //     updatedItems[state.currentIndex].linesDrawn[state.currentIndex][feature.id] = feature;
        //     // });
        //     updatedItems[state.currentIndex].linesDrawn[state.currentIndex][action.payload.id] = action.payload;
        //     return {
        //         ...state,
        //         items: updatedItems,
        //     };
        // case "ROAD_CLOSURE/LINE_DELETED":
        //     updatedItems = [
        //         ...state.items
        //     ];
        //     // forEach(action.payload, (feature: IRoadClosureMapboxDrawLineString) => {
        //     //     if (updatedItems[state.currentIndex].linesDrawn[state.currentIndex][feature.id]) {
        //     //         delete updatedItems[state.currentIndex].linesDrawn[state.currentIndex][feature.id];
        //     //     }
        //     // });
        //     delete updatedItems[state.currentIndex].linesDrawn[state.currentIndex][action.payload.id];
        //     return {
        //         ...state,
        //         items: updatedItems,
        //     };

        
        case "ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_REQUEST":
            return {
                ...state,
                isFetchingMatchedStreets: true,
            };
        case "ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_SUCCESS":
            updatedItems = [
                ...state.items
            ];
            updatedItems[state.currentIndex].invalidStreets[state.currentIndex][state.currentSelectionIndex].features = concat(updatedItems[state.currentIndex].invalidStreets[state.currentIndex][state.currentSelectionIndex].features, action.payload.invalid.features);
            updatedItems[state.currentIndex].matchedStreets[state.currentIndex][state.currentSelectionIndex].addFeaturesFromGeojson(action.payload.matched.features);
            updatedItems[state.currentIndex].unmatchedStreets[state.currentIndex][state.currentSelectionIndex].features = concat(updatedItems[state.currentIndex].unmatchedStreets[state.currentIndex][state.currentSelectionIndex].features, action.payload.unmatched.features);

            // update geometryIdDirectionMap

            // update form.street
            const output = {};
            const newGeometryIdDirectionFilter = {};
            forEach(updatedItems[state.currentIndex].matchedStreets[state.currentSelectionIndex], (featureCollection: SharedStreetsMatchFeatureCollection) => {
                forEach(featureCollection.features, (segment: SharedStreetsMatchPath|SharedStreetsMatchPoint, index: number) => {
                    if (segment instanceof SharedStreetsMatchPath) {
                        if (!output[segment.properties.geometryId]) {
                            output[segment.properties.geometryId] = {};
                        }
                        if (!newGeometryIdDirectionFilter[segment.properties.geometryId]) {
                            newGeometryIdDirectionFilter[segment.properties.geometryId] = {
                                backward: false,
                                forward: false,
                            };
                        }

                        if (segment.properties.direction === "forward") {
                            output[segment.properties.geometryId].forward = new RoadClosureFormStateStreet(index, segment.properties.streetname, segment.properties.referenceId, segment.properties.geometryId);
                        }
                        if (segment.properties.direction === "backward") {
                            output[segment.properties.geometryId].backward = new RoadClosureFormStateStreet(index, segment.properties.streetname, segment.properties.referenceId, segment.properties.geometryId);
                        }
                        
                        if (!newGeometryIdDirectionFilter[segment.properties.geometryId].forward && segment.properties.direction === "forward") {
                            newGeometryIdDirectionFilter[segment.properties.geometryId].forward = true;
                        }
                        if (!newGeometryIdDirectionFilter[segment.properties.geometryId].backward && segment.properties.direction === "backward") {
                            newGeometryIdDirectionFilter[segment.properties.geometryId].backward = true;
                        }
                    }
                });
            });
            updatedItems[state.currentIndex].geometryIdDirectionFilter = newGeometryIdDirectionFilter;
            updatedItems[state.currentIndex].form.street[state.currentSelectionIndex] = output;

            return {
                ...state,
                isFetchingMatchedStreets: false,
                items: updatedItems,
            };

        case "ROAD_CLOSURE/DELETE_STREET_SEGMENT":
            updatedItems = [ ...state.items ];

            updatedItems[state.currentIndex].matchedStreets[state.currentSelectionIndex][0].features = 
                updatedItems[state.currentIndex].matchedStreets[state.currentSelectionIndex][0].features.filter((feature: any) => {
                    return feature.properties.geometryId !== action.payload;
                });

            const deletedStreetOutput = {};
            forEach(updatedItems[state.currentIndex].matchedStreets[state.currentSelectionIndex], (featureCollection: SharedStreetsMatchFeatureCollection) => {
                forEach(featureCollection.features, (segment: SharedStreetsMatchPath|SharedStreetsMatchPoint, index: number) => {
                    if (segment instanceof SharedStreetsMatchPath) {
                        deletedStreetOutput[segment.properties.referenceId] = new RoadClosureFormStateStreet(index, segment.properties.streetname, segment.properties.referenceId, segment.properties.geometryId);
                    }
                });
            });
            updatedItems[state.currentIndex].form.street[state.currentSelectionIndex] = deletedStreetOutput;

            return {
                ...state,
                items: updatedItems
            };
        case "ROAD_CLOSURE/TOGGLE_DIRECTION_STREET_SEGMENT":
            updatedItems = [ ...state.items ];

            forEach((action.payload), (payload: IRoadClosureStateItemToggleDirectionPayload) => {
                updatedItems[state.currentIndex].geometryIdDirectionFilter[payload.geometryId] =  Object.assign({}, 
                    updatedItems[state.currentIndex].geometryIdDirectionFilter[payload.geometryId],
                    payload.direction
                );
            });

            return {
                ...state,
                items: updatedItems,
            }
        case "ROAD_CLOSURE/INPUT_CHANGED":
            const key = action.payload.key;
            updatedItems = [
                ...state.items,
            ];
            if (key === "street") {
                forEach(Object.keys(updatedItems[state.currentIndex].form[key][state.currentSelectionIndex][action.payload.geometryId]), (refId: string) => {
                    updatedItems[state.currentIndex].form[key][state.currentSelectionIndex][action.payload.geometryId][refId].streetname = action.payload.street;
                });
            } else {
                updatedItems[state.currentIndex].form[key] = action.payload[key];
            }
            
            return {
                ...state,
                items: updatedItems,
            }
        default:
            return state;
    }
};