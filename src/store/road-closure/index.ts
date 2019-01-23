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
    currentRoadClosureItemToGeojson, 
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
    geometryId?: string,
    geometryIds?: string[],
    direction: { forward: boolean, backward: boolean }
}

export const ACTIONS = {
    DELETE_STREET_SEGMENT: createStandardAction('ROAD_CLOSURE/DELETE_STREET_SEGMENT')<RoadClosureFormStateStreet>(),
    FETCH_SHAREDSTREET_GEOMS: createAsyncAction(
        'ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_REQUEST',
        'ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_SUCCESS',
        'ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_FAILURE'
    )<void, IFetchSharedstreetGeomsSuccessResponse, Error>(),
    INPUT_CHANGED: createStandardAction('ROAD_CLOSURE/INPUT_CHANGED')<IRoadClosureFormInputChangedPayload>(),
    ROAD_CLOSURE_HIDE_OUTPUT: createStandardAction('ROAD_CLOSURE/ROAD_CLOSURE_HIDE_OUTPUT')<void>(),
    ROAD_CLOSURE_VIEW_OUTPUT: createStandardAction('ROAD_CLOSURE/ROAD_CLOSURE_VIEW_OUTPUT')<void>(),
    TOGGLE_DIRECTION_STREET_SEGMENT: createStandardAction('ROAD_CLOSURE/TOGGLE_DIRECTION_STREET_SEGMENT')<IRoadClosureStateItemToggleDirectionPayload>(),
    VIEWPORT_CHANGED: createStandardAction('ROAD_CLOSURE/VIEWPORT_CHANGED'),
};
// side effects

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
            dataSource: 'osm/planet-181029',
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
    // currentIndex: number,
    // currentSelectionIndex: number,
    currentItem: RoadClosureStateItem,
    isFetchingMatchedStreets: boolean,
    isShowingRoadClosureOutputViewer: boolean,
    // items: RoadClosureStateItem[],
    output: any,
};

const defaultState: IRoadClosureState = {
    // currentIndex: 0,
    // currentSelectionIndex: 0,
    currentItem: new RoadClosureStateItem(),
    isFetchingMatchedStreets: false,
    isShowingRoadClosureOutputViewer: false,
    // items: [ new RoadClosureStateItem() ],
    output: {
        incidents: []
    },
};

export const roadClosureReducer = (state: IRoadClosureState = defaultState, action: RoadClosureAction) => {
    let updatedItem: RoadClosureStateItem;
    // let updatedItems: RoadClosureStateItem[];
    switch (action.type) {
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
                output: currentRoadClosureItemToGeojson(state),
            };
        
        case "ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_REQUEST":
            return {
                ...state,
                isFetchingMatchedStreets: true,
            };
        case "ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_SUCCESS":
            updatedItem = { ...state.currentItem };
            // updatedItems[state.currentIndex].invalidStreets[state.currentIndex][state.currentSelectionIndex].features = concat(updatedItems[state.currentIndex].invalidStreets[state.currentIndex][state.currentSelectionIndex].features, action.payload.invalid.features);
            // updatedItems[state.currentIndex].matchedStreets[state.currentIndex][state.currentSelectionIndex].addFeaturesFromGeojson(action.payload.matched.features);
            // updatedItems[state.currentIndex].unmatchedStreets[state.currentIndex][state.currentSelectionIndex].features = concat(updatedItems[state.currentIndex].unmatchedStreets[state.currentIndex][state.currentSelectionIndex].features, action.payload.unmatched.features);
            updatedItem.invalidStreets.features = concat(updatedItem.invalidStreets.features, action.payload.invalid.features);
            updatedItem.matchedStreets.addFeaturesFromGeojson(action.payload.matched.features);
            updatedItem.unmatchedStreets.features = concat(updatedItem.unmatchedStreets.features, action.payload.unmatched.features);


            // update geometryIdDirectionMap

            // update form.street
            const output = {};
            const newGeometryIdDirectionFilter = {};
            forEach(updatedItem.matchedStreets.features, (segment: SharedStreetsMatchPath|SharedStreetsMatchPoint, index: number) => {
                if (segment instanceof SharedStreetsMatchPath) {
                    if (!output[segment.properties.geometryId]) {
                        output[segment.properties.geometryId] = {
                            backward: {},
                            forward: {}
                        };
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
            updatedItem.geometryIdDirectionFilter = newGeometryIdDirectionFilter;
            updatedItem.form.street = output;

            return {
                ...state,
                currentItem: updatedItem,
                isFetchingMatchedStreets: false,
            };

        case "ROAD_CLOSURE/DELETE_STREET_SEGMENT":
            updatedItem = { ...state.currentItem };

            updatedItem.matchedStreets.features = 
                updatedItem.matchedStreets.features.filter((feature: any) => {
                    return feature.properties.geometryId !== action.payload.geometryId;
                });

            const deletedStreetOutput = {};
            const deletedGeometryIdDirectionFilter = {};
            forEach(updatedItem.matchedStreets.features, (segment: SharedStreetsMatchPath, index: number) => {
                if (!deletedStreetOutput[segment.properties.geometryId]) {
                    deletedStreetOutput[segment.properties.geometryId] = {
                        backward: {},
                        forward: {}
                    };
                }
                if (!deletedGeometryIdDirectionFilter[segment.properties.geometryId]) {
                    deletedGeometryIdDirectionFilter[segment.properties.geometryId] = {
                        backward: false,
                        forward: false,
                    };
                }
                if (segment.properties.direction === "forward") {
                    deletedStreetOutput[segment.properties.geometryId].forward = new RoadClosureFormStateStreet(index, segment.properties.streetname, segment.properties.referenceId, segment.properties.geometryId);
                }
                if (segment.properties.direction === "backward") {
                    deletedStreetOutput[segment.properties.geometryId].backward = new RoadClosureFormStateStreet(index, segment.properties.streetname, segment.properties.referenceId, segment.properties.geometryId);
                }
                if (!deletedGeometryIdDirectionFilter[segment.properties.geometryId].forward && segment.properties.direction === "forward") {
                    deletedGeometryIdDirectionFilter[segment.properties.geometryId].forward = true;
                }
                if (!deletedGeometryIdDirectionFilter[segment.properties.geometryId].backward && segment.properties.direction === "backward") {
                    deletedGeometryIdDirectionFilter[segment.properties.geometryId].backward = true;
                }
            });
            updatedItem.form.street = deletedStreetOutput;
            updatedItem.geometryIdDirectionFilter = deletedGeometryIdDirectionFilter;

            return {
                ...state,
                currentItem: updatedItem,
            };
        case "ROAD_CLOSURE/TOGGLE_DIRECTION_STREET_SEGMENT":
            updatedItem = { ...state.currentItem };

            forEach((action.payload.geometryIds), (geometryId: string) => {
                updatedItem.geometryIdDirectionFilter[geometryId] =  Object.assign({}, 
                    updatedItem.geometryIdDirectionFilter[geometryId],
                    action.payload.direction
                );
            });

            return {
                ...state,
                currentItem: updatedItem,
            }
        case "ROAD_CLOSURE/INPUT_CHANGED":
            const key = action.payload.key;
            updatedItem = { ...state.currentItem };

            if (key === "street") {
                forEach(Object.keys(updatedItem.form[key][action.payload.geometryId]), (refId: string) => {
                    updatedItem.form[key][action.payload.geometryId][refId].streetname = action.payload.street;
                });
            } else {
                updatedItem.form[key] = action.payload[key];
            }
            
            return {
                ...state,
                currentItem: updatedItem,
            }
        default:
            return state;
    }
};