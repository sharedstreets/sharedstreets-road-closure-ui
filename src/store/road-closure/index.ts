import {
    forEach,
    isEmpty,
    omit,
} from 'lodash';    
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
import { generateUploadUrlsFromHash, IRoadClosureUploadUrls } from '../../utils/upload-url-generator';
import { v4 } from '../../utils/uuid-regex';
import { fetchAction } from '../api';
import { RootState } from '../configureStore';




// actions
export type RoadClosureAction = ActionType<typeof ACTIONS>;
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

export interface IFetchAllSharedstreetsRoadClosuresSuccessResponse {
    id: string,
    org: string,
    lastModified: string,
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

export interface IRoadClosureOrgName {
    name: string,
    closureIds: string[],
}

export const ACTIONS = {
    DELETE_STREET_SEGMENT: createStandardAction('ROAD_CLOSURE/DELETE_STREET_SEGMENT')<RoadClosureFormStateStreet>(),
    FETCH_SHAREDSTREETS_ALL_PUBLIC_DATA: createAsyncAction(
        'ROAD_CLOSURE/FETCH_SHAREDSTREETS_ALL_PUBLIC_DATA_REQUEST',
        'ROAD_CLOSURE/FETCH_SHAREDSTREETS_ALL_PUBLIC_DATA_SUCCESS',
        'ROAD_CLOSURE/FETCH_SHAREDSTREETS_ALL_PUBLIC_DATA_FAILURE'
    )<void, IFetchAllSharedstreetsRoadClosuresSuccessResponse, Error>(),
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
    FETCH_SHAREDSTREETS_PUBLIC_METADATA: createAsyncAction(
        'ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_METADATA_REQUEST',
        'ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_METADATA_SUCCESS',
        'ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_METADATA_FAILURE'
    )<void, { [key: string] : any }, Error>(),
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
    HIGHLIGHT_MATCHED_STREET: createStandardAction('ROAD_CLOSURE/HIGHLIGHT_MATCHED_STREET')<RoadClosureFormStateStreet>(),
    HIGHLIGHT_MATCHED_STREETS_GROUP: createStandardAction('ROAD_CLOSURE/HIGHLIGHT_MATCHED_STREETS_GROUP')<SharedStreetsMatchGeomPath[]>(),
    INPUT_CHANGED: createStandardAction('ROAD_CLOSURE/INPUT_CHANGED')<IRoadClosureFormInputChangedPayload>(),
    LOADED_ALL_ROAD_CLOSURES: createStandardAction('ROAD_CLOSURE/LOADED_ALL_ROAD_CLOSURES')<void>(),
    LOAD_ALL_ORGS: createStandardAction('ROAD_CLOSURE/LOAD_ALL_ORGS')<{ [name: string]: IRoadClosureOrgName }>(),
    LOAD_ALL_ROAD_CLOSURES: createStandardAction('ROAD_CLOSURE/LOAD_ALL_ROAD_CLOSURES')<void>(),
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
    SET_ORG_NAME: createStandardAction('ROAD_CLOSURE/SET_ORG_NAME')<string>(),
    TOGGLE_DIRECTION_STREET_SEGMENT: createStandardAction('ROAD_CLOSURE/TOGGLE_DIRECTION_STREET_SEGMENT')<IRoadClosureStateItemToggleDirectionPayload>(),
    VIEWPORT_CHANGED: createStandardAction('ROAD_CLOSURE/VIEWPORT_CHANGED'),
    ZOOM_HIGHLIGHT_MATCHED_STREETS_GROUP: createStandardAction('ROAD_CLOSURE/ZOOM_HIGHLIGHT_MATCHED_STREETS_GROUP')<SharedStreetsMatchGeomPath[]>(),
};

// side effects
export const findMatchedPoint = (point: GeoJSON.Feature<GeoJSON.Point>, currentLineId: string) => (dispatch: Dispatch<any>, getState: any) => {
    if (point.geometry.coordinates.length === 0) {
        dispatch(ACTIONS.FETCH_SHAREDSTREETS_MATCH_POINT_CANCEL());
        return;
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
        searchRadius: 5,
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
        method,
        params: queryParams,
        requested: 'ROAD_CLOSURE/FETCH_SHAREDSTREETS_MATCH_POINT_SUCCESS',
        requesting: 'ROAD_CLOSURE/FETCH_SHAREDSTREETS_MATCH_POINT_REQUEST',
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
                return dispatch(ACTIONS.LOAD_ALL_ORGS(orgNames));
        });
    });
};

export const loadAllRoadClosures = () => (dispatch: Dispatch<any>, getState: any) => {
    const state = getState() as RootState;
    const orgName = state.roadClosure.orgName;
    dispatch(ACTIONS.LOAD_ALL_ROAD_CLOSURES());
    const generateListObjectsUrl = async () => {
        const response = await fetch(`https://api.sharedstreets.io/v0.1.0/data/list?filePath=road-closures/${orgName}/`);
        const json = await response.json();
        const url = await json.url;
        return url;
    };
    generateListObjectsUrl()
    .then((url) => {
        const getAllRoadClosures = async (listObjectsUrl: string) => {
            const response = await fetch(listObjectsUrl);
            const text = await response.text();
            return text;
        };

        getAllRoadClosures(url).then((data) => {
            const responseDoc = new DOMParser().parseFromString(data, 'application/xml');
                const contents = responseDoc.querySelectorAll('Contents');
                const output: { [org: string] : {[id: string] : IFetchAllSharedstreetsRoadClosuresSuccessResponse}} = {};
                contents.forEach((content) => {
                    const lastModifieds = content.querySelectorAll("LastModified");
                    content.querySelectorAll("Key").forEach((key, index) => {
                        if (key.textContent) {
                            // road-closures/<org>/<uuid>/<type>
                            const parts = key.textContent.split("/");
                            if (parts.length !== 4) {
                                return;
                            }
                            if (!output[parts[1]]) {
                                output[parts[1]] = {};
                            }
                            if (!output[parts[1]][parts[2]]) {
                                output[parts[1]][parts[2]] = {
                                    id: parts[2],
                                    lastModified: lastModifieds[index].textContent as string,
                                    org: parts[1],
                                };
                            }
                        }
                    })
                });
                return output;
        })
        .then((allRoadClosures) => {
            forEach(allRoadClosures, (roadClosure) => {
                forEach(roadClosure, (closureObject: IFetchAllSharedstreetsRoadClosuresSuccessResponse) => {
                    const id = closureObject.id;
                    const uploadUrls = generateUploadUrlsFromHash(id, orgName);
                    if (uploadUrls.geojsonUploadUrl) {
                        dispatch(fetchAction({
                            afterRequest: (data) => {
                                if (typeof data === "string") {
                                    return;
                                }
                                return { ...data, ...uploadUrls, ...{lastModified: closureObject.lastModified} };
                            },
                            method: 'get',
                            requestUrl: uploadUrls.geojsonUploadUrl,
                            requested: 'ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_METADATA_SUCCESS',
                            requesting: 'ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_METADATA_REQUEST',
                        }));
                    }
                })
            })
        })
        .then(() => {
            dispatch(ACTIONS.LOADED_ALL_ROAD_CLOSURES());
        });
    });
}

export const loadRoadClosure = (url: string) => (dispatch: Dispatch<any>, getState: any) => {
    const state = getState() as RootState;
    const orgName = state.roadClosure.orgName;

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
    dispatch(ACTIONS.LOAD_INPUT(uploadUrls));

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
    const orgName = state.roadClosure.orgName;
    let filename = uuid();
    if (!isEmpty(state.roadClosure.uploadUrls.geojsonUploadUrl)) {
        forEach(state.roadClosure.uploadUrls.geojsonUploadUrl.split("/"), (part) => {
            if (part.match(v4)) {
                filename = part;
            }
        })   
    }

    dispatch(ACTIONS.SAVING_OUTPUT);
    dispatch(ACTIONS.GENERATE_SHAREDSTREETS_PUBLIC_DATA_UPLOAD_URL.request());
       
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
        dispatch(ACTIONS.SAVED_OUTPUT);
    });
};

// reducer
export interface IRoadClosureState {
    allOrgs: any,
    allRoadClosureItems: SharedStreetsMatchGeomFeatureCollection[],
    allRoadClosureMetadata: any[],
    allRoadClosuresUploadUrls: IRoadClosureUploadUrls[],
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
    isLoadingAllRoadClosures: boolean,
    isLoadingInput: boolean,
    isPuttingOutput: boolean,
    isSavingOutput: boolean,
    isShowingRoadClosureOutputViewer: boolean,
    orgName: string,
    output: RoadClosureOutputStateItem,
    uploadUrls: IRoadClosureUploadUrls,
};

const defaultState: IRoadClosureState = {
    allOrgs: [],
    allRoadClosureItems: [],
    allRoadClosureMetadata: [],
    allRoadClosuresUploadUrls: [],
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
    isLoadingAllRoadClosures: false,
    isLoadingInput: false,
    isPuttingOutput: false,
    isSavingOutput: false,
    isShowingRoadClosureOutputViewer: false,
    orgName: '',
    output: new RoadClosureOutputStateItem(),
    uploadUrls: {
        geojsonUploadUrl: '',
        wazeUploadUrl: '',
    }
};

export const roadClosureReducer = (state: IRoadClosureState = defaultState, action: RoadClosureAction) => {
    let updatedItem: SharedStreetsMatchGeomFeatureCollection;
    switch (action.type) {
        case 'ROAD_CLOSURE/SET_ORG_NAME':
            return {
                ...state,
                orgName: action.payload
            }
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
                    path.properties.color = '';
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
                    path.properties.color = '';
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

        case "ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_METADATA_REQUEST":
            return {
                ...state,
            };
        case "ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_METADATA_FAILURE":
            return {
                ...state,
            };
        case "ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_METADATA_SUCCESS":
            if (!action.payload || !action.payload.features) {
                return state;
            }
            const newStateItem = new SharedStreetsMatchGeomFeatureCollection();
            newStateItem.properties = action.payload.properties;
            newStateItem.addFeaturesFromGeojson(action.payload.features);
            const newStateItemStreet = {};
            const newStateItemGeometryIdDirectionFilter = {};
            forEach(newStateItem.features, (segment: SharedStreetsMatchGeomPath|SharedStreetsMatchGeomPoint, index: number) => {
                if (segment instanceof SharedStreetsMatchGeomPath) {
                    if (!newStateItemStreet[segment.properties.geometryId]) {
                        newStateItemStreet[segment.properties.geometryId] = {
                            backward: new RoadClosureFormStateStreet(),
                            forward: new RoadClosureFormStateStreet()
                        };
                    }
                    if (!newStateItemGeometryIdDirectionFilter[segment.properties.geometryId]) {
                        newStateItemGeometryIdDirectionFilter[segment.properties.geometryId] = {
                            backward: false,
                            forward: false,
                        };
                    }

                    if (segment.properties.direction === "forward") {
                        const forwardStreet = new RoadClosureFormStateStreet();
                        forwardStreet.streetname = segment.properties.streetname;
                        forwardStreet.referenceId = segment.properties.referenceId;
                        forwardStreet.geometryId = segment.properties.geometryId;
                        newStateItemStreet[segment.properties.geometryId].forward = forwardStreet;
                    }
                    if (segment.properties.direction === "backward") {
                        const backwardStreet = new RoadClosureFormStateStreet();
                        backwardStreet.streetname = segment.properties.streetname;
                        backwardStreet.referenceId = segment.properties.referenceId;
                        backwardStreet.geometryId = segment.properties.geometryId;
                        newStateItemStreet[segment.properties.geometryId].backward = backwardStreet;
                    }
                    
                    if (!newStateItemGeometryIdDirectionFilter[segment.properties.geometryId].forward && segment.properties.direction === "forward") {
                        newStateItemGeometryIdDirectionFilter[segment.properties.geometryId].forward = true;
                    }
                    if (!newStateItemGeometryIdDirectionFilter[segment.properties.geometryId].backward && segment.properties.direction === "backward") {
                        newStateItemGeometryIdDirectionFilter[segment.properties.geometryId].backward = true;
                    }
                }
            });
        newStateItem.properties.geometryIdDirectionFilter = newStateItemGeometryIdDirectionFilter;
            newStateItem.properties.street = newStateItemStreet;

            const newStateItemUploadUrls = {
                geojsonUploadUrl: action.payload.geojsonUploadUrl,
                wazeUploadUrl: action.payload.wazeUploadUrl,
            };

            const newStateItemMetadata = {
                lastModified: action.payload.lastModified
            }

            return {
                ...state,
                allRoadClosureItems: [ ...state.allRoadClosureItems, ...[newStateItem]],
                allRoadClosureMetadata: [ ...state.allRoadClosureMetadata, ...[newStateItemMetadata] ],
                allRoadClosuresUploadUrls: [ ...state.allRoadClosuresUploadUrls, ...[newStateItemUploadUrls]],
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

        case "ROAD_CLOSURE/FETCH_SHAREDSTREETS_ALL_PUBLIC_DATA_REQUEST":
            return {
                ...state,
                isLoadingAllRoadClosures: true,
            };

        case "ROAD_CLOSURE/FETCH_SHAREDSTREETS_ALL_PUBLIC_DATA_SUCCESS":
            return {
                ...state,
                allRoadClosures: action.payload,
                isLoadingAllRoadClosures: false,
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
            } else {
                updatedItem.properties[key] = action.payload[key];
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

        case "ROAD_CLOSURE/LOAD_ALL_ROAD_CLOSURES":
            return {
                ...state,
                allRoadClosureItems: [],
                allRoadClosuresUploadUrls: [],
                isLoadingAllRoadClosures: true,
            };
        
        case "ROAD_CLOSURE/LOADED_ALL_ROAD_CLOSURES":
            return {
                ...state,
                isLoadingAllRoadClosures: false,
            };

        case "ROAD_CLOSURE/RESET_ROAD_CLOSURE":
            return {
                ...state,
                currentItem: new SharedStreetsMatchGeomFeatureCollection(),
                isEditingExistingClosure: false,
            };
            
        default:
            return state;
    }
};