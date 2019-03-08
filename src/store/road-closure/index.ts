import {
    // plainToClass,
    serialize
} from 'class-transformer';
import {
    concat,
    forEach,
    isEmpty,
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
import { getFormattedJSONStringFromOutputItem } from 'src/selectors/road-closure-output-item';
import {
    // putObjectUrl,
    s3,
} from 'src/services/aws';
import {
    ActionType,
    createAsyncAction,
    createStandardAction,
} from 'typesafe-actions';
import { v4 as uuid } from 'uuid';
import { fetchAction } from '../api';
import { RootState } from '../configureStore';


// actions
export type RoadClosureAction = ActionType<typeof ACTIONS>;
export interface IFetchSharedstreetGeomsSuccessResponse {
    matched: SharedStreetsMatchFeatureCollection,
    invalid: GeoJSON.FeatureCollection,
    unmatched: GeoJSON.FeatureCollection
}

export interface IFetchSharedstreetPublicDataSuccessResponse {
    body: string;
}
// export interface IPutSharedstreetPublicDataSuccessResponse {
//     body: string;
// }

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
    FETCH_SHAREDSTREETS_PUBLIC_DATA: createAsyncAction(
        'ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_DATA_REQUEST',
        'ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_DATA_SUCCESS',
        'ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_DATA_FAILURE'
    )<void, RoadClosureStateItem, Error>(),
    FETCH_SHAREDSTREET_GEOMS: createAsyncAction(
        'ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_REQUEST',
        'ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_SUCCESS',
        'ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_FAILURE'
        )<void, IFetchSharedstreetGeomsSuccessResponse, Error>(),
    INPUT_CHANGED: createStandardAction('ROAD_CLOSURE/INPUT_CHANGED')<IRoadClosureFormInputChangedPayload>(),
    LOAD_INPUT: createStandardAction('ROAD_CLOSURE/LOAD_INPUT'),
    PUT_SHAREDSTREETS_PUBLIC_DATA: createAsyncAction(
        'ROAD_CLOSURE/PUT_SHAREDSTREETS_PUBLIC_DATA_REQUEST',
        'ROAD_CLOSURE/PUT_SHAREDSTREETS_PUBLIC_DATA_SUCCESS',
        'ROAD_CLOSURE/PUT_SHAREDSTREETS_PUBLIC_DATA_FAILURE'
    )<void, any, Error>(),
    ROAD_CLOSURE_HIDE_OUTPUT: createStandardAction('ROAD_CLOSURE/ROAD_CLOSURE_HIDE_OUTPUT')<void>(),
    ROAD_CLOSURE_VIEW_OUTPUT: createStandardAction('ROAD_CLOSURE/ROAD_CLOSURE_VIEW_OUTPUT')<void>(),
    SAVE_OUTPUT: createStandardAction('ROAD_CLOSURE/SAVE_OUTPUT'),
    SELECT_OUTPUT_FORMAT: createStandardAction('ROAD_CLOSURE/SELECT_OUTPUT_FORMAT')<IRoadClosureOutputFormatName>(),
    TOGGLE_DIRECTION_STREET_SEGMENT: createStandardAction('ROAD_CLOSURE/TOGGLE_DIRECTION_STREET_SEGMENT')<IRoadClosureStateItemToggleDirectionPayload>(),
    VIEWPORT_CHANGED: createStandardAction('ROAD_CLOSURE/VIEWPORT_CHANGED'),
};

// side effects
export const findMatchedStreet = (linestring: IRoadClosureMapboxDrawLineString) => (dispatch: Dispatch<any>, getState: any) => {
    const endpoint = 'match/geoms';
    const method = 'post';
    const queryParams = {
        authKey: "bdd23fa1-7ac5-4158-b354-22ec946bb575",
        bearingTolerance: 35,
        dataSource: 'osm/planet-181029',
        ignoreDirection: true,
        includeIntersections: true,
        includeStreetnames: true,
        lengthTolerance: 0.25,
        searchRadius: 25,
        snapTopology: true,
    };
    const body = linestring;

    return dispatch(fetchAction({
        afterRequest: (data) => {
            return data;
        },
        body,
        endpoint,
        method,
        params: queryParams,
        // fn: apiService,
        // fnParams: [endpoint, method, queryParams, body], // order matters here
        requested: 'ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_SUCCESS',
        requesting: 'ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_REQUEST',
    }));
};

export const loadRoadClosure = (url: string) => (dispatch: Dispatch<any>, getState: any) => {
    const method = 'get';
    // https://sharedstreets-public-data.s3.amazonaws.com/road-closures/b8818994-9567-4f75-9c29-dd62aecd9259
    const v4 = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);
    let urlHash: string = '';
    forEach(url.split("/"), (part) => {
        if (part.match(v4)) {
            urlHash = part;
        }
    })
    if (isEmpty(urlHash)) {
        return;
    }
    const requestUrl = `https://sharedstreets-public-data.s3.amazonaws.com/road-closures/${urlHash}/state`;


    dispatch(ACTIONS.LOAD_INPUT);
    return dispatch(fetchAction({
        afterRequest: (data) => {
            return data;
        },
        method,
        requestUrl,
        requested: 'ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_DATA_SUCCESS',
        requesting: 'ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_DATA_REQUEST',
    }));
};

export const saveRoadClosure = () => (dispatch: Dispatch<any>, getState: any) => {
    const state = getState() as RootState;
    // const payload = getFormattedJSONStringFromOutputItem(state.roadClosure);
    const filename = uuid();

    // const method = 'post';
    // const requestUrl = putObjectUrl(payload, filename);
    dispatch(ACTIONS.SAVE_OUTPUT);

    // save state 
    s3.upload({
        Body: serialize(state.roadClosure.currentItem),
        Bucket: 'sharedstreets-public-data',
        ContentType: 'application/json',
        Key: 'road-closures/' + filename + '/state',
    }, (err, data) => {
        if (err) {
            dispatch(ACTIONS.PUT_SHAREDSTREETS_PUBLIC_DATA.failure(err));
        } else {
            // tslint:disable-next-line
            console.log(data);
            dispatch({
                payload: data,
                type: ACTIONS.PUT_SHAREDSTREETS_PUBLIC_DATA.success(),
            });
        }
    });
    // save waze
    dispatch(ACTIONS.SAVE_OUTPUT);

    s3.upload({
        Body: getFormattedJSONStringFromOutputItem(state.roadClosure, IRoadClosureOutputFormatName.waze),
        Bucket: 'sharedstreets-public-data',
        ContentType: 'application/json',
        Key: 'road-closures/' + filename + '/' + IRoadClosureOutputFormatName.waze,
    }, (err, data) => {
        if (err) {
            dispatch(ACTIONS.PUT_SHAREDSTREETS_PUBLIC_DATA.failure(err));
        } else {
            // tslint:disable-next-line
            console.log(data);
            dispatch({
                payload: data,
                type: ACTIONS.PUT_SHAREDSTREETS_PUBLIC_DATA.success(),
            });
        }
    });
    // save geojson
    dispatch(ACTIONS.SAVE_OUTPUT);

    s3.upload({
        Body: getFormattedJSONStringFromOutputItem(state.roadClosure, IRoadClosureOutputFormatName.geojson),
        Bucket: 'sharedstreets-public-data',
        ContentType: 'application/json',
        Key: 'road-closures/' + filename + '/' + IRoadClosureOutputFormatName.geojson,
    }, (err, data) => {
        if (err) {
            dispatch(ACTIONS.PUT_SHAREDSTREETS_PUBLIC_DATA.failure(err));
        } else {
            // tslint:disable-next-line
            console.log(data);
            dispatch({
                payload: data,
                type: ACTIONS.PUT_SHAREDSTREETS_PUBLIC_DATA.success(),
            });
        }
    });
    // return dispatch(fetchAction({
    //     afterRequest: (data) => {
    //         return data;
    //     },
    //     body: payload,
    //     method,
    //     requestUrl,
    //     requested: 'ROAD_CLOSURE/PUT_SHAREDSTREETS_PUBLIC_DATA_SUCCESS',
    //     requesting: 'ROAD_CLOSURE/PUT_SHAREDSTREETS_PUBLIC_DATA_REQUEST',
    // }));
};

// reducer
export interface IRoadClosureState {
    currentItem: RoadClosureStateItem,
    isFetchingInput: boolean,
    isFetchingMatchedStreets: boolean,
    isLoadingInput: boolean,
    isPuttingOutput: boolean,
    isSavingOutput: boolean,
    isShowingRoadClosureOutputViewer: boolean,
    output: RoadClosureOutputStateItem,
};

const defaultState: IRoadClosureState = {
    currentItem: new RoadClosureStateItem(),
    isFetchingInput: false,
    isFetchingMatchedStreets: false,
    isLoadingInput: false,
    isPuttingOutput: false,
    isSavingOutput: false,
    isShowingRoadClosureOutputViewer: false,
    output: new RoadClosureOutputStateItem(),
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

        case "ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_DATA_REQUEST":
            return {
                ...state,
                isFetchingInput: true,
            };
        case "ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_DATA_FAILURE":
            return {
                ...state,
                isFetchingInput: false,
                isSavingOutput: false,
            };
        case "ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_DATA_SUCCESS":
            // const loadedStateItem = plainToClass(RoadClosureStateItem, action.payload);
            const loadedStateItem = { ...state.currentItem };
            loadedStateItem.form = action.payload.form;
            loadedStateItem.geometryIdDirectionFilter = action.payload.geometryIdDirectionFilter;
            loadedStateItem.invalidStreets = action.payload.invalidStreets;
            loadedStateItem.unmatchedStreets = action.payload.unmatchedStreets;
            loadedStateItem.matchedStreets.addFeaturesFromGeojson(action.payload.matchedStreets.features);

            // tslint:disable-next-line
            console.log(action.payload, loadedStateItem);
            return {
                ...state,
                currentItem: loadedStateItem,
                isFetchingInput: false,
                isSavingOutput: false,
            };
        
        case "ROAD_CLOSURE/PUT_SHAREDSTREETS_PUBLIC_DATA_REQUEST":
            return {
                ...state,
                isPuttingOutput: true,
            };
        case "ROAD_CLOSURE/PUT_SHAREDSTREETS_PUBLIC_DATA_FAILURE":
        case "ROAD_CLOSURE/PUT_SHAREDSTREETS_PUBLIC_DATA_SUCCESS":
            return {
                ...state,
                isPuttingOutput: false,
                isSavingOutput: false,
            };
        
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