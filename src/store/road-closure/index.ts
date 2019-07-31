import {
    forEach,
    isEmpty,
    omit,
    parseInt,
    sortedLastIndexBy,
} from 'lodash';    
import * as moment from 'moment';
import { Dispatch } from 'redux';
import {
    ActionType,
    createAsyncAction,
    createStandardAction,
} from 'typesafe-actions';
import { v4 as uuid } from 'uuid';
import { RoadClosureFormStateStreet } from '../../models/RoadClosureFormStateStreet';
import {
    IRoadClosureOutputFormatName,
    RoadClosureOutputStateItem,
} from '../../models/RoadClosureOutputStateItem';
import { SharedStreetsMatchGeomFeatureCollection } from '../../models/SharedStreets/SharedStreetsMatchGeomFeatureCollection';
import { SharedStreetsMatchGeomPath } from '../../models/SharedStreets/SharedStreetsMatchGeomPath';
import { SharedStreetsMatchGeomPoint } from '../../models/SharedStreets/SharedStreetsMatchGeomPoint';
import { SharedStreetsMatchPointFeatureCollection } from '../../models/SharedStreets/SharedStreetsMatchPointFeatureCollection';
import { getFormattedJSONStringFromOutputItem } from '../../selectors/road-closure-output-item';
import { isValidGeoJSONFile } from '../../utils/geojson-file-validator';
import { generateUploadUrlsFromHash, IRoadClosureUploadUrls } from '../../utils/upload-url-generator';
import { v4 } from '../../utils/uuid-regex';
import { fetchAction } from '../api';
import { RootState } from '../configureStore';
import { CONTEXT_ACTIONS, ContextAction } from '../context';



// actions
export type RoadClosureAction = ActionType<typeof ROAD_CLOSURE_ACTIONS>;
export interface IFetchSharedstreetGeomsSuccessResponse {
    currentLineId: string,
    matched: SharedStreetsMatchGeomFeatureCollection,
    invalid: GeoJSON.FeatureCollection,
    unmatched: GeoJSON.FeatureCollection
}

export interface IFetchSharedstreetGeomsSuccessResponse {
    currentLineId: string,
    matched: SharedStreetsMatchGeomFeatureCollection,
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
    day?: string,
    weekOfYear?: string,
    index?: number,
}

export interface IRoadClosureStateItemToggleDirectionPayload {
    geometryId?: string,
    geometryIds?: string[],
    direction: { forward: boolean, backward: boolean }
}

export interface IRoadClosureOrgName {
    name: string,
    closureIds: string[],
}

export const ROAD_CLOSURE_ACTIONS = {
    DELETE_STREET_SEGMENT: createStandardAction('ROAD_CLOSURE/DELETE_STREET_SEGMENT')<RoadClosureFormStateStreet>(),
    FETCH_SHAREDSTREETS_MATCH_POINT: createAsyncAction(
        'ROAD_CLOSURE/FETCH_SHAREDSTREETS_MATCH_POINT_REQUEST',
        'ROAD_CLOSURE/FETCH_SHAREDSTREETS_MATCH_POINT_SUCCESS',
        'ROAD_CLOSURE/FETCH_SHAREDSTREETS_MATCH_POINT_FAILURE'
    )<void, any, Error>(),
    FETCH_SHAREDSTREETS_MATCH_POINT_CANCEL: createStandardAction('ROAD_CLOSURE/FETCH_SHAREDSTREETS_MATCH_POINT_CANCEL')<void>(),
    FETCH_SHAREDSTREETS_PUBLIC_DATA: createAsyncAction(
        'ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_DATA_REQUEST',
        'ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_DATA_SUCCESS',
        'ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_DATA_FAILURE'
    )<void, SharedStreetsMatchGeomFeatureCollection, Error>(),
    FETCH_SHAREDSTREET_GEOMS: createAsyncAction(
        'ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_REQUEST',
        'ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_SUCCESS',
        'ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_FAILURE'
    )<void, IFetchSharedstreetGeomsSuccessResponse, Error>(),
    FILE_ADDED: createStandardAction('ROAD_CLOSURE/FILE_ADDED')<void>(),
    GENERATE_SHAREDSTREETS_PUBLIC_DATA_UPLOAD_URL: createAsyncAction(
        'ROAD_CLOSURE/GENERATE_SHAREDSTREETS_PUBLIC_DATA_UPLOAD_URL_REQUEST',
        'ROAD_CLOSURE/GENERATE_SHAREDSTREETS_PUBLIC_DATA_UPLOAD_URL_SUCCESS',
        'ROAD_CLOSURE/GENERATE_SHAREDSTREETS_PUBLIC_DATA_UPLOAD_URL_FAILURE'
    )<void, IGenerateSharedstreetsPublicDataUploadUrlSuccessResponse, Error>(),
    HIGHLIGHT_MATCHED_STREET: createStandardAction('ROAD_CLOSURE/HIGHLIGHT_MATCHED_STREET')<RoadClosureFormStateStreet>(),
    HIGHLIGHT_MATCHED_STREETS_GROUP: createStandardAction('ROAD_CLOSURE/HIGHLIGHT_MATCHED_STREETS_GROUP')<SharedStreetsMatchGeomPath[]>(),
    INPUT_CHANGED: createStandardAction('ROAD_CLOSURE/INPUT_CHANGED')<IRoadClosureFormInputChangedPayload>(),
    INPUT_REMOVED: createStandardAction('ROAD_CLOSURE/INPUT_REMOVED')<IRoadClosureFormInputChangedPayload>(),
    LOAD_ALL_ORGS: createStandardAction('ROAD_CLOSURE/LOAD_ALL_ORGS')<{ [name: string]: IRoadClosureOrgName }>(),
    LOAD_INPUT: createStandardAction('ROAD_CLOSURE/LOAD_INPUT')<IRoadClosureUploadUrls>(),
    PUT_SHAREDSTREETS_PUBLIC_DATA: createAsyncAction(
        'ROAD_CLOSURE/PUT_SHAREDSTREETS_PUBLIC_DATA_REQUEST',
        'ROAD_CLOSURE/PUT_SHAREDSTREETS_PUBLIC_DATA_SUCCESS',
        'ROAD_CLOSURE/PUT_SHAREDSTREETS_PUBLIC_DATA_FAILURE'
    )<void, any, Error>(),
    RESET_ROAD_CLOSURE: createStandardAction('ROAD_CLOSURE/RESET_ROAD_CLOSURE')<void>(),
    ROAD_CLOSURE_HIDE_OUTPUT: createStandardAction('ROAD_CLOSURE/ROAD_CLOSURE_HIDE_OUTPUT')<void>(),
    ROAD_CLOSURE_VIEW_OUTPUT: createStandardAction('ROAD_CLOSURE/ROAD_CLOSURE_VIEW_OUTPUT')<void>(),
    SAVED_OUTPUT: createStandardAction('ROAD_CLOSURE/SAVED_OUTPUT')<void>(),
    SAVING_OUTPUT: createStandardAction('ROAD_CLOSURE/SAVING_OUTPUT')<void>(),
    SELECT_OUTPUT_FORMAT: createStandardAction('ROAD_CLOSURE/SELECT_OUTPUT_FORMAT')<IRoadClosureOutputFormatName>(),
    TOGGLE_DIRECTION_STREET_SEGMENT: createStandardAction('ROAD_CLOSURE/TOGGLE_DIRECTION_STREET_SEGMENT')<IRoadClosureStateItemToggleDirectionPayload>(),
    VIEWPORT_CHANGED: createStandardAction('ROAD_CLOSURE/VIEWPORT_CHANGED'),
    ZOOM_HIGHLIGHT_MATCHED_STREETS_GROUP: createStandardAction('ROAD_CLOSURE/ZOOM_HIGHLIGHT_MATCHED_STREETS_GROUP')<SharedStreetsMatchGeomPath[]>(),
};

// side effects
export let findMatchedPointAbortController = new AbortController();
export const findMatchedPoint = (point: GeoJSON.Feature<GeoJSON.Point>, currentLineId: string) => (dispatch: Dispatch<any>, getState: any) => {
    if (point.geometry.coordinates.length === 0) {
        dispatch(ROAD_CLOSURE_ACTIONS.FETCH_SHAREDSTREETS_MATCH_POINT_CANCEL());
        return;
    }
    const state = getState() as RootState;
    if (state.roadClosure.isFetchingMatchedPoints) {
        findMatchedPointAbortController.abort();
        findMatchedPointAbortController = new AbortController();
    }
    const endpoint = `match/point/${point.geometry.coordinates[0]},${point.geometry.coordinates[1]}`;
    const method = 'get';
    const queryParams = {
        authKey: "bdd23fa1-7ac5-4158-b354-22ec946bb575",
        bearingTolerance: 35,
        dataSource: 'osm/planet-181029',
        ignoreDirection: false,
        includeIntersections: true,
        includeStreetnames: true,
        maxCandidates: 4,
        searchRadius: 10,
        snapTopology: true,
    };
    const body = point;

    return dispatch(fetchAction({
        afterRequest: (data) => {
            const dataSnappedToSelectedPoint = Object.assign({}, data);
            dataSnappedToSelectedPoint.features = dataSnappedToSelectedPoint.features.map((feature: any) => {
                return {
                    ...feature,
                    geometry: point.geometry,
                }
            });
            return Object.assign({}, {fc: dataSnappedToSelectedPoint}, {currentLineId});
        },
        body,
        endpoint,
        failure: 'ROAD_CLOSURE/FETCH_SHAREDSTREETS_MATCH_POINT_FAILURE',
        method,
        params: queryParams,
        requested: 'ROAD_CLOSURE/FETCH_SHAREDSTREETS_MATCH_POINT_SUCCESS',
        requesting: 'ROAD_CLOSURE/FETCH_SHAREDSTREETS_MATCH_POINT_REQUEST',
        signal: findMatchedPointAbortController.signal
    }));
}; 
export const findMatchedStreet = (linestring: IRoadClosureMapboxDrawLineString, currentLineId: string) => (dispatch: Dispatch<any>, getState: any) => {
    const endpoint = 'match/geoms';
    const method = 'post';
    const queryParams = {
        authKey: "bdd23fa1-7ac5-4158-b354-22ec946bb575",
        bearingTolerance: 35,
        dataSource: 'osm/planet-181029',
        ignoreDirection: false,
        includeIntersections: true,
        includeStreetnames: true,
        lengthTolerance: 0.25,
        searchRadius: 25,
        snapTopology: true,
    };
    const body = linestring;

    return dispatch(fetchAction({
        afterRequest: (data) => {
            return Object.assign({}, data, {currentLineId});
        },
        body,
        endpoint,
        method,
        params: queryParams,
        requested: 'ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_SUCCESS',
        requesting: 'ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_REQUEST',
    }));
}; 

export const loadAllOrgs = () => (dispatch: Dispatch<any>, getState: any) => {
    const generateListObjectsUrl = async () => {
        const response = await fetch(`https://api.sharedstreets.io/v0.1.0/data/list?filePath=road-closures/`);
        const json = await response.json();
        const url = await json.url;
        return url;
    };
    generateListObjectsUrl()
    .then((url) => {
        const getAllOrgs = async (listObjectsUrl: string) => {
            const response = await fetch(listObjectsUrl);
            const text = await response.text();
            return text;
        };

        getAllOrgs(url).then((data) => {
            const responseDoc = new DOMParser().parseFromString(data, 'application/xml');
                const contents = responseDoc.querySelectorAll('Contents');
                const orgNames: { [name: string]: IRoadClosureOrgName } = {};
                contents.forEach((content) => {
                    content.querySelectorAll("Key").forEach((key, index) => {
                        if (key.textContent) {
                            // road-closures/<org>/<uuid>/<type>
                            const parts = key.textContent.split("/");
                            if (parts.length !== 4) {
                                return;
                            }
                            if (!orgNames[parts[1]]) {
                                orgNames[parts[1]] = {
                                    closureIds: [],
                                    name: parts[1],
                                }
                            }
                            if (orgNames[parts[1]].closureIds.indexOf(parts[2]) === -1) {
                                orgNames[parts[1]].closureIds.push(parts[2]);
                            }
                        }
                    })
                });
                return dispatch(ROAD_CLOSURE_ACTIONS.LOAD_ALL_ORGS(orgNames));
        });
    });
};

export const loadRoadClosure = (url: string) => (dispatch: Dispatch<any>, getState: any) => {
    const state = getState() as RootState;
    const orgName = state.context.orgName;

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
    const uploadUrls = generateUploadUrlsFromHash(filename, orgName);
    dispatch(ROAD_CLOSURE_ACTIONS.LOAD_INPUT(uploadUrls));

    return dispatch(fetchAction({
        afterRequest: (data) => {
            return data;
        },
        method,
        requestUrl: uploadUrls.geojsonUploadUrl,
        requested: 'ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_DATA_SUCCESS',
        requesting: 'ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_DATA_REQUEST',
    }));
};

export const saveRoadClosure = () => (dispatch: Dispatch<any>, getState: any) => {
    const state = getState() as RootState;
    const orgName = state.context.orgName;
    let filename = uuid();
    if (!isEmpty(state.roadClosure.uploadUrls.geojsonUploadUrl)) {
        forEach(state.roadClosure.uploadUrls.geojsonUploadUrl.split("/"), (part) => {
            if (part.match(v4)) {
                filename = part;
            }
        })   
    }

    dispatch(ROAD_CLOSURE_ACTIONS.SAVING_OUTPUT);
    dispatch(ROAD_CLOSURE_ACTIONS.GENERATE_SHAREDSTREETS_PUBLIC_DATA_UPLOAD_URL.request());
       
    const generateGeojsonUploadUrl = async () => {
        const response = await fetch(`https://api.sharedstreets.io/v0.1.0/data/upload?contentType=application/json&filePath=road-closures/${orgName}/${filename}/geojson`);
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
                    'Cache-control': 'max-age=0, no-cache',
                    'Content-Type': 'application/json',
                },
                method: 'put',
                requestUrl: signedGeojsonUploadUrl,
                requested: 'ROAD_CLOSURE/PUT_SHAREDSTREETS_PUBLIC_DATA_SUCCESS',
                requesting: 'ROAD_CLOSURE/PUT_SHAREDSTREETS_PUBLIC_DATA_REQUEST',
        }));
    });
           
    const generateWazeUploadUrl = async () => {
        const response = await fetch(`https://api.sharedstreets.io/v0.1.0/data/upload?contentType=application/json&filePath=road-closures/${orgName}/${filename}/waze`);
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
                    'Cache-control': 'max-age=0, no-cache',
                    'Content-Type': 'application/json',
                },
                method: 'put',
                requestUrl: signedWazeUploadUrl,
                requested: 'ROAD_CLOSURE/PUT_SHAREDSTREETS_PUBLIC_DATA_SUCCESS',
                requesting: 'ROAD_CLOSURE/PUT_SHAREDSTREETS_PUBLIC_DATA_REQUEST',
        }));
        dispatch({	
            payload: generateUploadUrlsFromHash(filename, orgName),	
            type: 'ROAD_CLOSURE/GENERATE_SHAREDSTREETS_PUBLIC_DATA_UPLOAD_URL_SUCCESS',	
        });
        dispatch(ROAD_CLOSURE_ACTIONS.SAVED_OUTPUT);
    });
};

export const addFile = (file: File) => (dispatch: Dispatch<any>, getState: any) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        if (e && e.target) {
            const fr = e.target;
            if (fr instanceof FileReader) {
                const result = fr.result;
                if (typeof result === "string") {
                    const obj = JSON.parse(result);
                    if (isValidGeoJSONFile(obj)) {
                        dispatch(ROAD_CLOSURE_ACTIONS.FILE_ADDED());
                        dispatch(ROAD_CLOSURE_ACTIONS.FETCH_SHAREDSTREETS_PUBLIC_DATA.success(obj));
                        dispatch(CONTEXT_ACTIONS.SHOW_MESSAGE({
                            intent: "success",
                            text: "Success! Loaded your GeoJSON file.",
                        }));
                    } else {
                        dispatch(CONTEXT_ACTIONS.SHOW_MESSAGE({
                            intent: "danger",
                            text: "You've selected an invalid GeoJSON file!\
                            We're looking for a GeoJSON file that has a .geojson or .json extension\
                            and is a FeatureCollection of LineStrings.",
                        }));
                    }
                }
            }
        } else {
            dispatch(CONTEXT_ACTIONS.SHOW_MESSAGE({
                intent: "danger",
                text: "You've selected an invalid GeoJSON file!\
                We're looking for a GeoJSON file that has a .geojson or .json extension\
                and is a FeatureCollection of LineStrings.",
            }));
        }

    };
    try {
        reader.readAsBinaryString(file);
    } catch (e) {
        dispatch(CONTEXT_ACTIONS.SHOW_MESSAGE({
            intent: "danger",
            text: "You've selected an invalid GeoJSON file!\
            We're looking for a GeoJSON file that has a .geojson or .json extension\
            and is a FeatureCollection of LineStrings.",
        }));
    }
}
// reducer
export interface IRoadClosureState {
    allOrgs: any,
    currentItem: SharedStreetsMatchGeomFeatureCollection,
    currentLineId: string,
    currentPossibleDirections: SharedStreetsMatchPointFeatureCollection,
    highlightedFeatureGroup: SharedStreetsMatchGeomPath[],
    isEditingExistingClosure: boolean,
    isFetchingInput: boolean,
    isFetchingMatchedPoints: boolean,
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
    allOrgs: [],
    currentItem: new SharedStreetsMatchGeomFeatureCollection(),
    currentLineId: '',
    currentPossibleDirections: new SharedStreetsMatchPointFeatureCollection(),
    highlightedFeatureGroup: [],
    isEditingExistingClosure: false,
    isFetchingInput: false,
    isFetchingMatchedPoints: false,
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
        wazeUploadUrl: '',
    }
};

export const roadClosureReducer = (state: IRoadClosureState = defaultState, action: RoadClosureAction | ContextAction) => {
    let updatedItem: SharedStreetsMatchGeomFeatureCollection;
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
                isEditingExistingClosure: true,
                isFetchingInput: true,
                isLoadedInput: false,
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

        case "ROAD_CLOSURE/HIGHLIGHT_MATCHED_STREET":
            updatedItem = Object.assign(Object.create(state.currentItem), state.currentItem);
            updatedItem.features.forEach((path: SharedStreetsMatchGeomPath) => {
                if (path.properties.color) {
                    delete path.properties.color;
                }
            });

            if (action.payload.referenceId) {
                updatedItem.features.forEach((path: SharedStreetsMatchGeomPath) => {
                    if (action.payload.referenceId === path.properties.referenceId) {
                        path.properties.color = "#E35051";
                    }
                });

            }

            return {
                ...state,
                currentItem: updatedItem,
            };
        
        case "ROAD_CLOSURE/HIGHLIGHT_MATCHED_STREETS_GROUP":
            updatedItem = Object.assign(Object.create(state.currentItem), state.currentItem);
            updatedItem.features.forEach((path: SharedStreetsMatchGeomPath) => {
                if (path.properties.color) {
                    delete path.properties.color;
                }
            });

            updatedItem.features.forEach((path: SharedStreetsMatchGeomPath) => {
                action.payload.forEach((highlightPath) => {
                    if (highlightPath.properties.referenceId === path.properties.referenceId) {
                        path.properties.color = "#E35051";
                    }
                });
            });

            return {
                ...state,
                currentItem: updatedItem,
            };
        
        case "ROAD_CLOSURE/ZOOM_HIGHLIGHT_MATCHED_STREETS_GROUP":
            return {
                ...state,
                highlightedFeatureGroup: action.payload,
            }
            
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
            const loadedStateItem = Object.assign(Object.create(state.currentItem), state.currentItem);
            loadedStateItem.properties = action.payload.properties;
            loadedStateItem.addFeaturesFromGeojson(action.payload.features);
            const loadedStateItemStreet = {};
            const loadedStateItemGeometryIdDirectionFilter = {};
            forEach(loadedStateItem.features, (segment: SharedStreetsMatchGeomPath|SharedStreetsMatchGeomPoint, index: number) => {
                if (segment instanceof SharedStreetsMatchGeomPath) {
                    if (!loadedStateItemStreet[segment.properties.geometryId]) {
                        loadedStateItemStreet[segment.properties.geometryId] = {
                            backward: {},
                            forward: {}
                        };
                    }
                    if (!loadedStateItemGeometryIdDirectionFilter[segment.properties.geometryId]) {
                        loadedStateItemGeometryIdDirectionFilter[segment.properties.geometryId] = {
                            backward: false,
                            forward: false,
                        };
                    }

                    if (segment.properties.direction === "forward") {
                        const forwardStreet = new RoadClosureFormStateStreet();
                        forwardStreet.streetname = segment.properties.streetname;
                        forwardStreet.referenceId = segment.properties.referenceId;
                        forwardStreet.geometryId = segment.properties.geometryId;
                        loadedStateItemStreet[segment.properties.geometryId].forward = forwardStreet;
                    }
                    if (segment.properties.direction === "backward") {
                        const backwardStreet = new RoadClosureFormStateStreet();
                        backwardStreet.streetname = segment.properties.streetname;
                        backwardStreet.referenceId = segment.properties.referenceId;
                        backwardStreet.geometryId = segment.properties.geometryId;
                        loadedStateItemStreet[segment.properties.geometryId].backward = backwardStreet;

                    }
                    
                    if (!loadedStateItemGeometryIdDirectionFilter[segment.properties.geometryId].forward && segment.properties.direction === "forward") {
                        loadedStateItemGeometryIdDirectionFilter[segment.properties.geometryId].forward = true;
                    }
                    if (!loadedStateItemGeometryIdDirectionFilter[segment.properties.geometryId].backward && segment.properties.direction === "backward") {
                        loadedStateItemGeometryIdDirectionFilter[segment.properties.geometryId].backward = true;
                    }
                }
            });
            loadedStateItem.properties.geometryIdDirectionFilter = loadedStateItemGeometryIdDirectionFilter;
            loadedStateItem.properties.street = loadedStateItemStreet;
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
        case "ROAD_CLOSURE/FETCH_SHAREDSTREETS_MATCH_POINT_CANCEL":
            return {
                ...state,
                currentPossibleDirections: new SharedStreetsMatchPointFeatureCollection(),
                isFetchingMatchedPoints: false,
            };

        case "ROAD_CLOSURE/FETCH_SHAREDSTREETS_MATCH_POINT_REQUEST":
            return {
                ...state,
                currentPossibleDirections: new SharedStreetsMatchPointFeatureCollection(),
                isFetchingMatchedPoints: true,
            };

        case "ROAD_CLOSURE/FETCH_SHAREDSTREETS_MATCH_POINT_FAILURE":
            return {
                ...state,
                currentPossibleDirections: new SharedStreetsMatchPointFeatureCollection(),
                isFetchingMatchedPoints: false,
            };

        case "ROAD_CLOSURE/FETCH_SHAREDSTREETS_MATCH_POINT_SUCCESS":
            const newDirections = new SharedStreetsMatchPointFeatureCollection();
            newDirections.addFeaturesFromGeoJSON(action.payload.fc);
            return {
                ...state,
                currentPossibleDirections: newDirections,
                isFetchingMatchedPoints: false,
            }

        case "ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_REQUEST":
            return {
                ...state,
                currentLineId: '',
                currentPossibleDirections: new SharedStreetsMatchPointFeatureCollection(),
                isFetchingMatchedStreets: true,
            };
        case "ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_SUCCESS":
            updatedItem = Object.assign(Object.create(state.currentItem), state.currentItem);
            updatedItem.addFeaturesFromGeojson(action.payload.matched.features);

            // update geometryIdDirectionMap
            // update street
            const output = {};
            const newGeometryIdDirectionFilter = {};
            forEach(updatedItem.features, (segment: SharedStreetsMatchGeomPath|SharedStreetsMatchGeomPoint, index: number) => {
                if (segment instanceof SharedStreetsMatchGeomPath) {
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
                        const forwardStreet = new RoadClosureFormStateStreet();
                        forwardStreet.streetname = segment.properties.streetname;
                        forwardStreet.referenceId = segment.properties.referenceId;
                        forwardStreet.geometryId = segment.properties.geometryId;

                        output[segment.properties.geometryId].forward = forwardStreet;
                    }
                    if (segment.properties.direction === "backward") {
                        const backwardStreet = new RoadClosureFormStateStreet();
                        backwardStreet.streetname = segment.properties.streetname;
                        backwardStreet.referenceId = segment.properties.referenceId;
                        backwardStreet.geometryId = segment.properties.geometryId;

                        output[segment.properties.geometryId].backward = backwardStreet;
                    }
                    
                    if (!newGeometryIdDirectionFilter[segment.properties.geometryId].forward && segment.properties.direction === "forward") {
                        newGeometryIdDirectionFilter[segment.properties.geometryId].forward = true;
                    }
                    if (!newGeometryIdDirectionFilter[segment.properties.geometryId].backward && segment.properties.direction === "backward") {
                        newGeometryIdDirectionFilter[segment.properties.geometryId].backward = true;
                    }
                }
            });
            updatedItem.properties.geometryIdDirectionFilter = newGeometryIdDirectionFilter;
            updatedItem.properties.street = output;

            return {
                ...state,
                currentItem: updatedItem,
                currentLineId: action.payload.currentLineId,
                currentPossibleDirections: new SharedStreetsMatchPointFeatureCollection(),
                isFetchingMatchedStreets: false,
            };

        case "ROAD_CLOSURE/DELETE_STREET_SEGMENT":
            updatedItem = Object.assign(Object.create(state.currentItem), state.currentItem);

            updatedItem.features = updatedItem.features.filter((feature: SharedStreetsMatchGeomPath | SharedStreetsMatchGeomPoint) => {
                if (feature instanceof SharedStreetsMatchGeomPath) {
                    return feature.properties.referenceId !== action.payload.referenceId;
                } else {
                    return true;
                }
            })


            // const updatedStreetForGeomId = updatedItem.properties.street[action.payload.geometryId];
            if (updatedItem.properties.street[action.payload.geometryId].forward.referenceId === action.payload.referenceId) {
                updatedItem.properties.street[action.payload.geometryId].forward = new RoadClosureFormStateStreet();
                updatedItem.properties.geometryIdDirectionFilter[action.payload.geometryId].forward = false;
            }
            if (updatedItem.properties.street[action.payload.geometryId].backward.referenceId === action.payload.referenceId) {
                updatedItem.properties.street[action.payload.geometryId].backward = new RoadClosureFormStateStreet();
                updatedItem.properties.geometryIdDirectionFilter[action.payload.geometryId].backward = false;
            }
            if (isEmpty(updatedItem.properties.street[action.payload.geometryId].forward)
                && isEmpty(updatedItem.properties.street[action.payload.geometryId].backward)) {
                const deletedStreetOutput = omit(updatedItem.properties.street, action.payload.geometryId);
                updatedItem.properties.street = deletedStreetOutput;
                const deletedGeometryIdDirectionFilter = omit(updatedItem.properties.geometryIdDirectionFilter, action.payload.geometryId);
                updatedItem.properties.geometryIdDirectionFilter = deletedGeometryIdDirectionFilter;
            }

            return {
                ...state,
                currentItem: updatedItem,
            };
        case "ROAD_CLOSURE/TOGGLE_DIRECTION_STREET_SEGMENT":
            updatedItem = Object.assign(Object.create(state.currentItem), state.currentItem);

            forEach((action.payload.geometryIds), (geometryId: string) => {
                updatedItem.properties.geometryIdDirectionFilter[geometryId] =  Object.assign({}, 
                    updatedItem.properties.geometryIdDirectionFilter[geometryId],
                    action.payload.direction
                );
            });

            return {
                ...state,
                currentItem: updatedItem,
            }
        case "ROAD_CLOSURE/INPUT_CHANGED":
            const key = action.payload.key;
            updatedItem = Object.assign(Object.create(state.currentItem), state.currentItem);

            if (key === "street") {
                forEach(Object.keys(updatedItem.properties[key][action.payload.geometryId]), (refId: string) => {
                    updatedItem.properties[key][action.payload.geometryId][refId].streetname = action.payload.street;
                });
            } else if (key === "mode") {
                if (!updatedItem.properties[key]) {
                    updatedItem.properties[key] = [];
                }
                if (updatedItem.properties[key] && updatedItem.properties[key].includes(action.payload[key])) {
                    const removeIndex = updatedItem.properties[key].indexOf(action.payload[key]);
                    updatedItem.properties[key].splice(removeIndex, 1);
                } else {
                    updatedItem.properties[key].push(action.payload[key]);
                }
            } else if (key === "schedule") {
                const startPayloadAsMoment = moment()
                    .week(parseInt(action.payload.weekOfYear!, 10))
                    .day(action.payload.day!)
                    .hour(parseInt(action.payload.startTime!.split(":")[0], 10))
                    .minute(parseInt(action.payload.startTime!.split(":")[1], 10));
                const isStartPayloadInRange = moment(updatedItem.properties.startTime).isBefore(startPayloadAsMoment);
                const endPayloadAsMoment = moment()
                    .week(parseInt(action.payload.weekOfYear!, 10))
                    .day(action.payload.day!)
                    .hour(parseInt(action.payload.endTime!.split(":")[0], 10))
                    .minute(parseInt(action.payload.endTime!.split(":")[1], 10));
                const isEndPayloadInRange = moment(updatedItem.properties.endTime).isAfter(endPayloadAsMoment);
                const isPayloadInRange = isStartPayloadInRange && isEndPayloadInRange;
                
                if (isPayloadInRange && !updatedItem.properties[key]) {
                    updatedItem.properties[key] = {}
                }
                if (isPayloadInRange && !updatedItem.properties[key][action.payload.weekOfYear!]) {
                    updatedItem.properties[key][action.payload.weekOfYear!] = {};
                }
                if (isPayloadInRange && !updatedItem.properties[key][action.payload.weekOfYear!][action.payload.day!]) {
                    updatedItem.properties[key][action.payload.weekOfYear!][action.payload.day!] = [];
                }
                if (!isEmpty(action.payload.startTime) && action.payload.startTime &&
                    !isEmpty(action.payload.endTime) && action.payload.endTime && 
                    action.payload.startTime !== action.payload.endTime &&
                    isPayloadInRange
                ) {
                    // const startEndKey = action.payload.startTime.replace(":", "-")+"-"+action.payload.endTime.replace(":", "-");
                    // updatedItem.properties[key][action.payload.day!][startEndKey] = {
                    //     endTime: action.payload.endTime,
                    //     startTime: action.payload.startTime,
                    // };

                    // get index to insert to maintain sort order (by start time and then by end time to tiebreak)
                    const insertIndex = sortedLastIndexBy(updatedItem.properties[key][action.payload.weekOfYear!][action.payload.day!], {
                        endTime: action.payload.endTime,
                        startTime: action.payload.startTime,
                    }, 'startTime');

                    updatedItem.properties[key][action.payload.weekOfYear!][action.payload.day!].splice(insertIndex, 0, {
                        endTime: action.payload.endTime,
                        startTime: action.payload.startTime,
                    });
                }
            } else {
                if (key === "startTime" || key === "endTime" && !isEmpty(state.currentItem.properties.schedule)) {
                    const payloadAsMoment = moment(action.payload[key]);
                    const stateTimeAsMoment = moment(state.currentItem.properties[key]);
                    if (key === "startTime" && payloadAsMoment.isAfter(stateTimeAsMoment)) {
                        // when start of range pushed back
                        // remove schedule items that fall outside the range
                        if (payloadAsMoment.week() > stateTimeAsMoment.week()) {
                            // drop any removed weeks
                            const weeksToOmit = [];
                            for (let i = stateTimeAsMoment.week(); i<payloadAsMoment.week(); i++) {
                                weeksToOmit.push(i);
                            }
                            updatedItem.properties.schedule = omit(updatedItem.properties.schedule, weeksToOmit);
                        }
                        for (let i = 0; i<payloadAsMoment.day(); i++) {
                            // drop all days leading up to day of new startTime
                            updatedItem.properties.schedule[payloadAsMoment.week()] = omit(updatedItem.properties.schedule[payloadAsMoment.week()], moment().day(i).format("dddd"));
                        }
                        if (Object.keys(updatedItem.properties.schedule[payloadAsMoment.week()]).length === 0) {
                            updatedItem.properties.schedule = omit(updatedItem.properties.schedule, payloadAsMoment.week());
                        }
                    } else if (key === "endTime" && payloadAsMoment.isBefore(stateTimeAsMoment)) {
                        // when end of range pushed up
                        // remove schedule items that fall outside the range
                        if (payloadAsMoment.week() < stateTimeAsMoment.week()) {
                            const weeksToOmit = [];
                            for (let i = payloadAsMoment.week()+1; i<=stateTimeAsMoment.week(); i++) {
                                weeksToOmit.push(i);
                            }
                            updatedItem.properties.schedule = omit(updatedItem.properties.schedule, weeksToOmit);
                        }
                        for (let i = payloadAsMoment.day()+1; i<7; i++) {
                            // drop all days after day of new endTime
                            updatedItem.properties.schedule[payloadAsMoment.week()] = omit(updatedItem.properties.schedule[payloadAsMoment.week()], moment().day(i).format("dddd"));
                        }
                        if (Object.keys(updatedItem.properties.schedule[payloadAsMoment.week()]).length === 0) {
                            updatedItem.properties.schedule = omit(updatedItem.properties.schedule, payloadAsMoment.week());
                        }
                    }
                }
                updatedItem.properties[key] = action.payload[key];
            }
            
            return {
                ...state,
                currentItem: updatedItem,
            }

            case "ROAD_CLOSURE/INPUT_REMOVED":
                const removedInputKey = action.payload.key;
                updatedItem = Object.assign(Object.create(state.currentItem), state.currentItem);
    
                if (removedInputKey === "schedule") {
                    if (action.payload.weekOfYear && action.payload.day) {
                        if (updatedItem.properties[removedInputKey][action.payload.weekOfYear!][action.payload.day!].length === 1) {
                            delete updatedItem.properties[removedInputKey][action.payload.weekOfYear!][action.payload.day!];
                        } else {
                            updatedItem.properties[removedInputKey][action.payload.weekOfYear!][action.payload.day!].splice(action.payload.index!, 1);
                        }
                    } else {
                        updatedItem.properties[removedInputKey] = {};
                    }
                }
                
                return {
                    ...state,
                    currentItem: updatedItem,
                }
    
        case "ROAD_CLOSURE/LOAD_ALL_ORGS": 
            return {
                ...state,
                allOrgs: action.payload
            };

        case "ROAD_CLOSURE/RESET_ROAD_CLOSURE":
            return {
                ...state,
                allOrgs: [],
                currentItem: new SharedStreetsMatchGeomFeatureCollection(),
                isEditingExistingClosure: false,
                isLoadedInput: false,
                isLoadingAllRoadClosures: false,
            };
            
        default:
            return state;
    }
};