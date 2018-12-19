import { getType } from '@turf/invariant';
import { dropRight, forEach } from 'lodash';
import { Dispatch } from 'redux';
import { RoadClosureFormStateStreet } from 'src/models/RoadClosureFormStateStreet';
import { RoadClosureStateItem } from "src/models/RoadClosureStateItem";
import { currentRoadClosureItemToGeojson, lineStringFromSelectedPoints } from 'src/selectors/road-closure';
 import {
     ActionType,
     createAsyncAction,
     createStandardAction,
    //  StateType
} from 'typesafe-actions';
import { fetchAction } from '../api';
import { RootState } from '../configureStore';


// actions
export type RoadClosureAction = ActionType<typeof ACTIONS>;
export interface IFetchSharedstreetGeomsSuccessResponse {
    matched: GeoJSON.FeatureCollection,
    invalid: GeoJSON.FeatureCollection,
    unmatched: GeoJSON.FeatureCollection
}

export interface IRoadClosureFormInputChangedPayload {
    key: string,
    street?: string,
    referenceId: string,
    startTime?: string,
    endTime?: string,
    description?: string,
    reference?: string,
    subtype?: string,
}

export const ACTIONS = {
    ADD_NEW_SELECTION: createStandardAction('ROAD_CLOSURE/ADD_NEW_SELECTION')<void>(),
    FETCH_SHAREDSTREET_GEOMS: createAsyncAction(
        'ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_REQUEST',
        'ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_SUCCESS',
        'ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_FAILURE'
    )<void, IFetchSharedstreetGeomsSuccessResponse, Error>(),
    INPUT_CHANGED: createStandardAction('ROAD_CLOSURE/INPUT_CHANGED')<IRoadClosureFormInputChangedPayload>(),
    NEXT_SELECTION: createStandardAction('ROAD_CLOSURE/NEXT_SELECTION')<void>(),
    POINT_REMOVED: createStandardAction('ROAD_CLOSURE/POINT_REMOVED')<void>(),
    POINT_SELECTED: createStandardAction('ROAD_CLOSURE/POINT_SELECTED')<number[]>(),
    PREVIOUS_SELECTION: createStandardAction('ROAD_CLOSURE/PREVIOUS_SELECTION')<void>(),
    ROAD_CLOSURE_CREATED: createStandardAction('ROAD_CLOSURE/ROAD_CLOSURE_CREATED')<void>(),
    ROAD_CLOSURE_DESELECTED: createStandardAction('ROAD_CLOSURE/ROAD_CLOSURE_DESELECTED')<void>(),
    ROAD_CLOSURE_HIDE_OUTPUT: createStandardAction('ROAD_CLOSURE/ROAD_CLOSURE_HIDE_OUTPUT')<void>(),
    ROAD_CLOSURE_SELECTED: createStandardAction('ROAD_CLOSURE/ROAD_CLOSURE_SELECTED')<number>(),
    ROAD_CLOSURE_VIEW_OUTPUT: createStandardAction('ROAD_CLOSURE/ROAD_CLOSURE_VIEW_OUTPUT')<void>(),
    VIEWPORT_CHANGED: createStandardAction('ROAD_CLOSURE/VIEWPORT_CHANGED'),
};
// side effects
export const findMatchedStreet = () => (dispatch: Dispatch<any>, getState: any) => {
    const {
        roadClosure,
    } = getState() as RootState;

    return dispatch(fetchAction({
        afterRequest: (data) => {
            return data;
        },
        body: lineStringFromSelectedPoints(roadClosure),
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
    let updatedItems;
    switch (action.type) {
        case "ROAD_CLOSURE/ROAD_CLOSURE_CREATED":
            updatedItems = [
                ...state.items
            ];
            const newItemIndex = state.items.length + 1;
            updatedItems[newItemIndex] = new RoadClosureStateItem();
            
            return {
                ...state,
                currentIndex: newItemIndex,
                items: updatedItems
            };
        case "ROAD_CLOSURE/ROAD_CLOSURE_SELECTED":
            return {
                ...state,
                isShowingRoadClosureList: false,
            };
        case "ROAD_CLOSURE/ROAD_CLOSURE_DESELECTED":
            return {
                ...state,
                isShowingRoadClosureList: true,
                isShowingRoadClosureOutputViewer: false,
            };
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
        case "ROAD_CLOSURE/PREVIOUS_SELECTION":
            return {
                ...state,
                currentSelectionIndex: state.currentSelectionIndex - 1,
            };

        case "ROAD_CLOSURE/NEXT_SELECTION":
            return {
                ...state,
                currentSelectionIndex: state.currentSelectionIndex + 1,
            };

        case "ROAD_CLOSURE/ADD_NEW_SELECTION":
            updatedItems = [
                ...state.items
            ];

            const newSelectionIndex = updatedItems[state.currentIndex].selectedPoints.length;
            updatedItems[state.currentIndex].selectedPoints[newSelectionIndex] = [];

            updatedItems[state.currentIndex].form.street[newSelectionIndex] = {};

            return {
                ...state,
                currentSelectionIndex: newSelectionIndex,
                items: updatedItems,
            }
        case "ROAD_CLOSURE/POINT_REMOVED": 
            updatedItems = [
                ...state.items
            ];
            updatedItems[state.currentIndex].selectedPoints[state.currentSelectionIndex] = dropRight(updatedItems[state.currentIndex].selectedPoints[state.currentSelectionIndex]);
            updatedItems[state.currentIndex].invalidStreets[state.currentSelectionIndex] = [];
            updatedItems[state.currentIndex].matchedStreets[state.currentSelectionIndex] = [];
            updatedItems[state.currentIndex].unmatchedStreets[state.currentSelectionIndex] = [];
            
            return {
                ...state,
                items: updatedItems
            };
        case "ROAD_CLOSURE/POINT_SELECTED":
            updatedItems = [
                ...state.items
            ];
            updatedItems[state.currentIndex].selectedPoints[state.currentSelectionIndex].push(action.payload)
            updatedItems[state.currentIndex].invalidStreets[state.currentSelectionIndex] = [];
            updatedItems[state.currentIndex].matchedStreets[state.currentSelectionIndex] = [];
            updatedItems[state.currentIndex].unmatchedStreets[state.currentSelectionIndex] = [];
            
            return {
                ...state,
                items: updatedItems
            };
        case "ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_REQUEST":
            return {
                ...state,
                isFetchingMatchedStreets: true,
            };
        case "ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_SUCCESS":
            updatedItems = [
                ...state.items
            ];
            updatedItems[state.currentIndex].invalidStreets[state.currentSelectionIndex] = [action.payload.invalid];
            updatedItems[state.currentIndex].matchedStreets[state.currentSelectionIndex] = [action.payload.matched];
            updatedItems[state.currentIndex].unmatchedStreets[state.currentSelectionIndex] = [action.payload.unmatched];

            const output = {};
            forEach(updatedItems[state.currentIndex].matchedStreets[state.currentSelectionIndex], (featureCollection: any) => {
                forEach(featureCollection.features, (segment: any, index: number) => {
                    if (getType(segment) === "LineString") {
                        output[segment.properties.referenceId] = new RoadClosureFormStateStreet(index, segment.properties.streetname, segment.properties.referenceId);
                    }
                });
            });
            updatedItems[state.currentIndex].form.street[state.currentSelectionIndex] = output;

            // const newStreetIndexMap = streetnameReferenceIdMap(state);
            // updatedItems[state.currentIndex].streetnameReferenceId[state.currentSelectionIndex] = newStreetIndexMap;

            return {
                ...state,
                isFetchingMatchedStreets: false,
                items: updatedItems,
            };
        case "ROAD_CLOSURE/INPUT_CHANGED":
            const key = action.payload.key;
            updatedItems = [
                ...state.items,
            ];
            if (key === "street") {
                updatedItems[state.currentIndex].form[key][state.currentSelectionIndex][action.payload.referenceId].streetname = action.payload[key];
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