import { forEach } from 'lodash';
import { Dispatch } from 'redux';
import { RoadClosureStateItem } from "src/models/RoadClosureStateItem";
import { lineStringFromSelectedPoints } from 'src/selectors/road-closure';
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
    matched: GeoJSON.FeatureCollection,
    invalid: GeoJSON.FeatureCollection,
    unmatched: GeoJSON.FeatureCollection
}

export interface IRoadClosureFormInputChangedPayload {
    key: string,
    street?: string,
    streetnameIndex: number,
    startTime?: string,
    endTime?: string,
    description?: string,
    reference?: string,
    subtype?: string,
}

export const ACTIONS = {
    ADD_NEW_STREET: createStandardAction('ROAD_CLOSURE/ADD_NEW_STREET')<void>(),
    FETCH_SHAREDSTREET_GEOMS: createAsyncAction(
        'ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_REQUEST',
        'ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_SUCCESS',
        'ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_FAILURE'
    )<void, IFetchSharedstreetGeomsSuccessResponse, Error>(),
    INPUT_CHANGED: createStandardAction('ROAD_CLOSURE/INPUT_CHANGED')<IRoadClosureFormInputChangedPayload>(),
    POINT_SELECTED: createStandardAction('ROAD_CLOSURE/POINT_SELECTED')<number[]>(),
    VIEWPORT_CHANGED: createStandardAction('ROAD_CLOSURE/VIEWPORT_CHANGED'),
};
// side effects
export const findMatchedStreet = () => (dispatch: Dispatch<any>, getState: any) => {
    // const state = getState();

    return dispatch(fetchAction({
        afterRequest: (data) => {
            return data;
        },
        body: lineStringFromSelectedPoints(getState()),
        endpoint: 'match/geoms',
        method: 'post',
        params: {
            authKey: "bdd23fa1-7ac5-4158-b354-22ec946bb575",
            bearingTolerance: 35,
            ignoreDirection: true,
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
    currentStreetIndex: number,
    isFetchingMatchedStreets: boolean,
    items: RoadClosureStateItem[],
};

const defaultState: IRoadClosureState = {
    currentIndex: 0,
    currentStreetIndex: 0,
    isFetchingMatchedStreets: false,
    items: [ new RoadClosureStateItem() ],
};

export const roadClosureReducer = (state: IRoadClosureState = defaultState, action: RoadClosureAction) => {
    let updatedItems;
    switch (action.type) {
        
        case "ROAD_CLOSURE/ADD_NEW_STREET":
            updatedItems = [
                ...state.items
            ];

            const newStreetIndex = state.currentStreetIndex + 1
            updatedItems[state.currentIndex].selectedPoints[newStreetIndex] = [];

            return {
                ...state,
                currentStreetIndex: newStreetIndex,
                items: updatedItems,
            }
        case "ROAD_CLOSURE/POINT_SELECTED":
            updatedItems = [
                ...state.items
            ];
            updatedItems[state.currentIndex].selectedPoints[state.currentStreetIndex].push(action.payload)
            updatedItems[state.currentIndex].invalidStreets[state.currentStreetIndex] = [];
            updatedItems[state.currentIndex].matchedStreets[state.currentStreetIndex] = [];
            updatedItems[state.currentIndex].unmatchedStreets[state.currentStreetIndex] = [];
            
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
            updatedItems[state.currentIndex].invalidStreets[state.currentStreetIndex] = [action.payload.invalid];
            updatedItems[state.currentIndex].matchedStreets[state.currentStreetIndex] = [action.payload.matched];
            updatedItems[state.currentIndex].unmatchedStreets[state.currentStreetIndex] = [action.payload.unmatched];

            const output = {};
            forEach(updatedItems[state.currentIndex].matchedStreets[state.currentStreetIndex], (featureCollection: any) => {
                forEach(featureCollection.features, (segment: any, index) => {
                    if (!output[segment.properties.streetname]) {
                        output[segment.properties.streetname] = [];
                    }
                    output[segment.properties.streetname].push(index);
                });
            })

            updatedItems[state.currentIndex].form.street = [Object.keys(output)]

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
                updatedItems[state.currentIndex].form[key][state.currentStreetIndex][action.payload.streetnameIndex] = action.payload[key] as string;
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