// import {
//     serialize
// } from 'class-transformer';
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
import { generateUploadUrlsFromHash, IRoadClosureUploadUrls } from 'src/utils/upload-url-generator';
import { v4 } from 'src/utils/uuid-regex';
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
export interface IGenerateSharedstreetsPublicDataUploadUrlSuccessResponse {
    [type: string] : string;
};

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
    CLEAR_LOADED_ROAD_CLOSURE: createStandardAction('ROAD_CLOSURE/CLEAR_LOADED_ROAD_CLOSURE')<void>(),
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
    GENERATE_SHAREDSTREETS_PUBLIC_DATA_UPLOAD_URL: createAsyncAction(
        'ROAD_CLOSURE/GENERATE_SHAREDSTREETS_PUBLIC_DATA_UPLOAD_URL_REQUEST',
        'ROAD_CLOSURE/GENERATE_SHAREDSTREETS_PUBLIC_DATA_UPLOAD_URL_SUCCESS',
        'ROAD_CLOSURE/GENERATE_SHAREDSTREETS_PUBLIC_DATA_UPLOAD_URL_FAILURE'
    )<void, IGenerateSharedstreetsPublicDataUploadUrlSuccessResponse, Error>(),
    INPUT_CHANGED: createStandardAction('ROAD_CLOSURE/INPUT_CHANGED')<IRoadClosureFormInputChangedPayload>(),
    LOAD_INPUT: createStandardAction('ROAD_CLOSURE/LOAD_INPUT')<IRoadClosureUploadUrls>(),
    PUT_SHAREDSTREETS_PUBLIC_DATA: createAsyncAction(
        'ROAD_CLOSURE/PUT_SHAREDSTREETS_PUBLIC_DATA_REQUEST',
        'ROAD_CLOSURE/PUT_SHAREDSTREETS_PUBLIC_DATA_SUCCESS',
        'ROAD_CLOSURE/PUT_SHAREDSTREETS_PUBLIC_DATA_FAILURE'
    )<void, any, Error>(),
    ROAD_CLOSURE_HIDE_OUTPUT: createStandardAction('ROAD_CLOSURE/ROAD_CLOSURE_HIDE_OUTPUT')<void>(),
    ROAD_CLOSURE_VIEW_OUTPUT: createStandardAction('ROAD_CLOSURE/ROAD_CLOSURE_VIEW_OUTPUT')<void>(),
    SAVED_OUTPUT: createStandardAction('ROAD_CLOSURE/SAVED_OUTPUT')<void>(),
    SAVING_OUTPUT: createStandardAction('ROAD_CLOSURE/SAVING_OUTPUT')<void>(),
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
        requested: 'ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_SUCCESS',
        requesting: 'ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_REQUEST',
    }));
}; 

export const loadRoadClosure = (url: string) => (dispatch: Dispatch<any>, getState: any) => {
    const method = 'get';
    let filename: string = '';
    forEach(url.split("/"), (part) => {
        if (part.match(v4)) {
            filename = part;
        }
    })
    if (isEmpty(filename)) {
        return;
    }
    const uploadUrls = generateUploadUrlsFromHash(filename);
    dispatch(ACTIONS.LOAD_INPUT(uploadUrls));

    return dispatch(fetchAction({
        afterRequest: (data) => {
            return data;
        },
        method,
        requestUrl: uploadUrls.stateUploadUrl,
        requested: 'ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_DATA_SUCCESS',
        requesting: 'ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_DATA_REQUEST',
    }));
};

export const saveRoadClosure = () => (dispatch: Dispatch<any>, getState: any) => {
    const state = getState() as RootState;
    let filename = uuid();
    if (!isEmpty(state.roadClosure.uploadUrls.stateUploadUrl)) {
        forEach(state.roadClosure.uploadUrls.stateUploadUrl.split("/"), (part) => {
            if (part.match(v4)) {
                filename = part;
            }
        })   
    }

    dispatch(ACTIONS.SAVING_OUTPUT);
    const stateUploadPayload = state.roadClosure.currentItem;

    const generateStateUploadUrl = async () => {
        dispatch({
            payload: {

            },
            type: "ROAD_CLOSURE/GENERATE_SHAREDSTREETS_PUBLIC_DATA_UPLOAD_URL_REQUEST"
        })
        const response = await fetch(`https://api.sharedstreets.io/v0.1.0/data/upload?contentType=application/json&filePath=road-closures/${filename}/state`);
        const json = await response.json();
        const url = await json.url;
        return url;
    };
    generateStateUploadUrl().then((signedStateUploadUrl) => {
        dispatch({
            payload: {
                stateUrl: signedStateUploadUrl,
            },
            type: 'ROAD_CLOSURE/GENERATE_SHAREDSTREETS_PUBLIC_DATA_UPLOAD_URL_SUCCESS',
        });
        dispatch(fetchAction({
                afterRequest: (data) => {
                    return data;
                },
                body: stateUploadPayload,
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'put',
                requestUrl: signedStateUploadUrl,
                requested: 'ROAD_CLOSURE/PUT_SHAREDSTREETS_PUBLIC_DATA_SUCCESS',
                requesting: 'ROAD_CLOSURE/PUT_SHAREDSTREETS_PUBLIC_DATA_REQUEST',
        }));
    });
       
    const generateGeojsonUploadUrl = async () => {
        const response = await fetch(`https://api.sharedstreets.io/v0.1.0/data/upload?contentType=application/json&filePath=road-closures/${filename}/geojson`);
        const json = await response.json();
        const url = await json.url;
        return url;
    };
    generateGeojsonUploadUrl().then((signedGeojsonUploadUrl) => {
        dispatch(fetchAction({
                afterRequest: (data) => {
                    return data;
                },
                body: JSON.parse(getFormattedJSONStringFromOutputItem(state.roadClosure, IRoadClosureOutputFormatName.geojson)),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'put',
                requestUrl: signedGeojsonUploadUrl,
                requested: 'ROAD_CLOSURE/PUT_SHAREDSTREETS_PUBLIC_DATA_SUCCESS',
                requesting: 'ROAD_CLOSURE/PUT_SHAREDSTREETS_PUBLIC_DATA_REQUEST',
        }));
    });
           
    const generateWazeUploadUrl = async () => {
        const response = await fetch(`https://api.sharedstreets.io/v0.1.0/data/upload?contentType=application/json&filePath=road-closures/${filename}/waze`);
        const json = await response.json();
        const url = await json.url;
        return url;
    };
    generateWazeUploadUrl().then((signedWazeUploadUrl) => {
        dispatch(fetchAction({
                afterRequest: (data) => {
                    return data;
                },
                body: JSON.parse(getFormattedJSONStringFromOutputItem(state.roadClosure, IRoadClosureOutputFormatName.waze)),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'put',
                requestUrl: signedWazeUploadUrl,
                requested: 'ROAD_CLOSURE/PUT_SHAREDSTREETS_PUBLIC_DATA_SUCCESS',
                requesting: 'ROAD_CLOSURE/PUT_SHAREDSTREETS_PUBLIC_DATA_REQUEST',
        }));
        dispatch(ACTIONS.SAVED_OUTPUT);
    });
};

// reducer
export interface IRoadClosureState {
    currentItem: RoadClosureStateItem,
    isFetchingInput: boolean,
    isFetchingMatchedStreets: boolean,
    isGeneratingUploadUrl: boolean,
    isLoadedInput: boolean,
    isLoadingInput: boolean,
    isPuttingOutput: boolean,
    isSavingOutput: boolean,
    isShowingRoadClosureOutputViewer: boolean,
    output: RoadClosureOutputStateItem,
    uploadUrls: IRoadClosureUploadUrls,
};

const defaultState: IRoadClosureState = {
    currentItem: new RoadClosureStateItem(),
    isFetchingInput: false,
    isFetchingMatchedStreets: false,
    isGeneratingUploadUrl: false,
    isLoadedInput: false,
    isLoadingInput: false,
    isPuttingOutput: false,
    isSavingOutput: false,
    isShowingRoadClosureOutputViewer: false,
    output: new RoadClosureOutputStateItem(),
    uploadUrls: {
        geojsonUploadUrl: '',
        stateUploadUrl: '',
        wazeUploadUrl: '',
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

        case "ROAD_CLOSURE/LOAD_INPUT":
            return {
                ...state,
                uploadUrls: action.payload
            }

        case "ROAD_CLOSURE/SAVING_OUTPUT":
            return {
                ...state,
                isSavingOutput: true,
            };
        case "ROAD_CLOSURE/SAVED_OUTPUT":
            return {
                ...state,
                isSavingOutput: false,
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
            };
        case "ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_DATA_SUCCESS":
            // const loadedStateItem = plainToClass(RoadClosureStateItem, action.payload);
            const loadedStateItem = { ...state.currentItem };
            loadedStateItem.form = action.payload.form;
            loadedStateItem.geometryIdDirectionFilter = action.payload.geometryIdDirectionFilter;
            loadedStateItem.invalidStreets = action.payload.invalidStreets;
            loadedStateItem.unmatchedStreets = action.payload.unmatchedStreets;
            loadedStateItem.matchedStreets.addFeaturesFromGeojson(action.payload.matchedStreets.features);

            return {
                ...state,
                currentItem: loadedStateItem,
                isFetchingInput: false,
                isLoadedInput: true,
            };
        case "ROAD_CLOSURE/GENERATE_SHAREDSTREETS_PUBLIC_DATA_UPLOAD_URL_REQUEST":
            return {
                ...state,
                isGeneratingUploadUrl: true,
            };

        case "ROAD_CLOSURE/GENERATE_SHAREDSTREETS_PUBLIC_DATA_UPLOAD_URL_SUCCESS":
            const newUploadUrls = Object.assign({}, state.uploadUrls, action.payload);
            return {
                ...state,
                isGeneratingUploadUrl: false,
                uploadUrls: newUploadUrls
            };

        case "ROAD_CLOSURE/PUT_SHAREDSTREETS_PUBLIC_DATA_REQUEST":
            return {
                ...state,
                isPuttingOutput: true,
            };
        case "ROAD_CLOSURE/PUT_SHAREDSTREETS_PUBLIC_DATA_FAILURE":
            return {
                ...state,
                isPuttingOutput: false,
            };
        case "ROAD_CLOSURE/PUT_SHAREDSTREETS_PUBLIC_DATA_SUCCESS":
            return {
                ...state,
                isPuttingOutput: false,
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
        
        case "ROAD_CLOSURE/CLEAR_LOADED_ROAD_CLOSURE":
            return {
                ...state,
                currentItem: new RoadClosureStateItem(),
            };
            
        default:
            return state;
    }
};