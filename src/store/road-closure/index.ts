import {
    concat,
    forEach,
    omit,
} from 'lodash';
import { Dispatch } from 'redux';
import { RoadClosureFormStateStreet } from 'src/models/RoadClosureFormStateStreet';
import {
    IRoadClosureOutputFormatName,
    RoadClosureOutputStateItem,
} from 'src/models/RoadClosureOutputStateItem';
import { RoadClosureStateItem } from "src/models/RoadClosureStateItem";
import { SharedStreetsMatchFeatureCollection } from 'src/models/SharedStreets/SharedStreetsMatchFeatureCollection';
import { SharedStreetsMatchPath } from 'src/models/SharedStreets/SharedStreetsMatchPath';
import { SharedStreetsMatchPoint } from 'src/models/SharedStreets/SharedStreetsMatchPoint';
import {
     ActionType,
     createAsyncAction,
     createStandardAction,
} from 'typesafe-actions';
import { fetchAction } from '../api';


// actions
export type RoadClosureAction = ActionType<typeof ACTIONS>;
export interface IFetchSharedstreetGeomsSuccessResponse {
    matched: SharedStreetsMatchFeatureCollection,
    invalid: GeoJSON.FeatureCollection,
    unmatched: GeoJSON.FeatureCollection
}

export interface IFetchQueryStreetnameSuccessResponse {
    score: number,
    streetname: string,
    geometryIds: string[]
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

export interface IMapViewport {
    latitude: number,
    longitude: number,
    zoom: number,
};

export const ACTIONS = {
    DELETE_STREET_SEGMENT: createStandardAction('ROAD_CLOSURE/DELETE_STREET_SEGMENT')<RoadClosureFormStateStreet>(),
    FETCH_QUERY_STREETNAME: createAsyncAction(
        'ROAD_CLOSURE/FETCH_QUERY_STREETNAME_REQUEST',
        'ROAD_CLOSURE/FETCH_QUERY_STREETNAME_SUCCESS',
        'ROAD_CLOSURE/FETCH_QUERY_STREETNAME_FAILURE'
    )<void, IFetchQueryStreetnameSuccessResponse[], Error>(),
    FETCH_SHAREDSTREET_GEOMS: createAsyncAction(
        'ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_REQUEST',
        'ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_SUCCESS',
        'ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_FAILURE'
    )<void, IFetchSharedstreetGeomsSuccessResponse, Error>(),
    INPUT_CHANGED: createStandardAction('ROAD_CLOSURE/INPUT_CHANGED')<IRoadClosureFormInputChangedPayload>(),
    ROAD_CLOSURE_HIDE_OUTPUT: createStandardAction('ROAD_CLOSURE/ROAD_CLOSURE_HIDE_OUTPUT')<void>(),
    ROAD_CLOSURE_VIEW_OUTPUT: createStandardAction('ROAD_CLOSURE/ROAD_CLOSURE_VIEW_OUTPUT')<void>(),
    SELECT_OUTPUT_FORMAT: createStandardAction('ROAD_CLOSURE/SELECT_OUTPUT_FORMAT')<IRoadClosureOutputFormatName>(),
    TOGGLE_DIRECTION_STREET_SEGMENT: createStandardAction('ROAD_CLOSURE/TOGGLE_DIRECTION_STREET_SEGMENT')<IRoadClosureStateItemToggleDirectionPayload>(),
    VIEWPORT_CHANGED: createStandardAction('ROAD_CLOSURE/VIEWPORT_CHANGED')<IMapViewport>(),
};
// side effects

export const findMatchedStreet = (linestring: IRoadClosureMapboxDrawLineString) => (dispatch: Dispatch<any>, getState: any) => {
    return dispatch(fetchAction({
        afterRequest: (data) => {
            return data;
        },
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

export const findStreetname = (streetname: string) => (dispatch: Dispatch<any>, getState: any) => {
    const {
        roadClosure: {
            viewport: {
                latitude,
                longitude,
            }
        }
    } = getState();

    return dispatch(fetchAction({
        afterRequest: (data) => data,
        endpoint: 'query/street',
        method: 'get',
        params: {
            authKey: "bdd23fa1-7ac5-4158-b354-22ec946bb575",
            point: longitude+","+latitude,
            query: streetname
        },
        requested: 'ROAD_CLOSURE/FETCH_QUERY_STREETNAME_SUCCESS',
        requesting: 'ROAD_CLOSURE/FETCH_QUERY_STREETNAME_REQUEST'
    }));
};

// reducer
export interface IRoadClosureState {
    currentItem: RoadClosureStateItem,
    isFetchingQueryStreet: boolean,
    isFetchingMatchedStreets: boolean,
    isShowingRoadClosureOutputViewer: boolean,
    output: RoadClosureOutputStateItem,
    viewport: IMapViewport,
    streetnames: IFetchQueryStreetnameSuccessResponse[]
};

const defaultState: IRoadClosureState = {
    currentItem: new RoadClosureStateItem(),
    isFetchingMatchedStreets: false,
    isFetchingQueryStreet: false,
    isShowingRoadClosureOutputViewer: false,
    output: new RoadClosureOutputStateItem(),
    streetnames: [],
    // TODO - make default location config-driven
    viewport: {
        latitude: 38.5,
        longitude: -98,
        zoom: 3
    }
};

export const roadClosureReducer = (state: IRoadClosureState = defaultState, action: RoadClosureAction) => {
    let updatedItem: RoadClosureStateItem;
    switch (action.type) {
        case 'ROAD_CLOSURE/SELECT_OUTPUT_FORMAT':
            return {
                ...state,
                output: {
                    ...state.output,
                    outputFormat: action.payload
                }
            }
        case "ROAD_CLOSURE/VIEWPORT_CHANGED":
            return {
                ...state,
                viewport: action.payload
            }
        case "ROAD_CLOSURE/ROAD_CLOSURE_HIDE_OUTPUT":
            return {
                ...state,
                isShowingRoadClosureOutputViewer: false,
            };
        case "ROAD_CLOSURE/ROAD_CLOSURE_VIEW_OUTPUT":
            return {
                ...state,
                isShowingRoadClosureOutputViewer: true,
            };
        case "ROAD_CLOSURE/FETCH_QUERY_STREETNAME_REQUEST":
            return {
                ...state,
                isFetchingQueryStreet: true,
                streetnames: []
            }
        case "ROAD_CLOSURE/FETCH_QUERY_STREETNAME_SUCCESS":
            return {
                ...state,
                isFetchingQueryStreet: false,
                streetnames: action.payload
            }
        case "ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_REQUEST":
            return {
                ...state,
                isFetchingMatchedStreets: true,
            };
        case "ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_SUCCESS":
            updatedItem = { ...state.currentItem };

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

            updatedItem.matchedStreets.removePathByGeometryId(action.payload.geometryId);

            const deletedStreetOutput = omit(updatedItem.form.street, action.payload.geometryId);
            const deletedGeometryIdDirectionFilter = omit(updatedItem.geometryIdDirectionFilter, action.payload.geometryId);
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