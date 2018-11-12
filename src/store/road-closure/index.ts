import { Dispatch } from 'redux';
import { RoadClosureStateItem } from 'src/models/road-closure';
import { linestringSelector } from 'src/selectors/road-closure';
 import {
     ActionType,
     createAsyncAction,
     createStandardAction,
    //  StateType
} from 'typesafe-actions';
import { fetchAction } from '../api';


// actions
export type RoadClosureAction = ActionType<typeof ACTIONS>;
export interface IFetchSharedstreetGeomsSuccessResponse {
    matched: object,
    invalid: object,
    unmatched: object
}

export const ACTIONS = {
    FETCH_SHAREDSTREET_GEOMS: createAsyncAction(
        'ROAD_CLOSURE_MAP/FETCH_SHAREDSTREET_GEOMS_REQUEST',
        'ROAD_CLOSURE_MAP/FETCH_SHAREDSTREET_GEOMS_SUCCESS',
        'ROAD_CLOSURE_MAP/FETCH_SHAREDSTREET_GEOMS_FAILURE'
    )<void, IFetchSharedstreetGeomsSuccessResponse, Error>(),
    POINT_SELECTED: createStandardAction('ROAD_CLOSURE_MAP/POINT_SELECTED')<number[]>(),
    VIEWPORT_CHANGED: createStandardAction('ROAD_CLOSURE_MAP/VIEWPORT_CHANGED'),
};
// side effects
export const findMatchedStreet = () => (dispatch: Dispatch<any>, getState: any) => {
    return dispatch(fetchAction({
        afterRequest: (data) => {
            return data;
        },
        body: linestringSelector(getState()),
        endpoint: 'match/geoms',
        method: 'post',
        params: {
            authKey: "bdd23fa1-7ac5-4158-b354-22ec946bb575",
            bearingTolerance: 35,
            ignoreDirection: true,
            lengthTolerance: 0.25,
            searchRadius: 25,
            snapTopology: true,
        },
        requested: 'ROAD_CLOSURE_MAP/FETCH_SHAREDSTREET_GEOMS_SUCCESS',
        requesting: 'ROAD_CLOSURE_MAP/FETCH_SHAREDSTREET_GEOMS_REQUEST',
    }));
};

// reducer
export interface IRoadClosureState {
    currentIndex: number,
    isFetchingMatchedStreets: boolean,
    items: RoadClosureStateItem[],
};

const defaultState: IRoadClosureState = {
    currentIndex: 0,
    isFetchingMatchedStreets: false,
    items: [ new RoadClosureStateItem() ],
};

export const roadClosureReducer = (state: IRoadClosureState = defaultState, action: RoadClosureAction) => {
    let updatedItems;
    switch (action.type) {
        case "ROAD_CLOSURE_MAP/POINT_SELECTED":
            updatedItems = [
                ...state.items
            ];
            updatedItems[state.currentIndex].selectedPoints.push(action.payload)
            updatedItems[state.currentIndex].invalidStreets = [];
            updatedItems[state.currentIndex].matchedStreets = [];
            updatedItems[state.currentIndex].unmatchedStreets = [];
            
            return {
                ...state,
                items: updatedItems
            };
        case "ROAD_CLOSURE_MAP/FETCH_SHAREDSTREET_GEOMS_REQUEST":
            return {
                ...state,
                isFetchingMatchedStreets: true,
            };
        case "ROAD_CLOSURE_MAP/FETCH_SHAREDSTREET_GEOMS_SUCCESS":
            updatedItems = [
                ...state.items
            ];
            updatedItems[state.currentIndex].invalidStreets = [action.payload.invalid];
            updatedItems[state.currentIndex].matchedStreets = [action.payload.matched];
            updatedItems[state.currentIndex].unmatchedStreets = [action.payload.unmatched];
            return {
                ...state,
                isFetchingMatchedStreets: false,
                items: updatedItems,
            }
        default:
            return state;
    }
};