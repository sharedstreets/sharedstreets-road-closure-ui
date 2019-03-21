// import {
//     serialize
// } from 'class-transformer';
import {
    concat,
    forEach,
    isEmpty,
    omit,
    reverse,
    sortBy,
    // uniq,
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
    currentLineId: string,
    matched: SharedStreetsMatchFeatureCollection,
    invalid: GeoJSON.FeatureCollection,
    unmatched: GeoJSON.FeatureCollection
}

export interface IFetchSharedstreetPublicDataSuccessResponse {
    body: string;
}

export interface IFetchAllSharedstreetsRoadClosuresSuccessResponse {
    [key: string]: {
        [type: string]: boolean | string,
    }
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
    FETCH_SHAREDSTREETS_PUBLIC_DATA: createAsyncAction(
        'ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_DATA_REQUEST',
        'ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_DATA_SUCCESS',
        'ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_DATA_FAILURE'
    )<void, RoadClosureStateItem, Error>(),
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
};

// side effects
export const findMatchedStreet = (linestring: IRoadClosureMapboxDrawLineString, currentLineId: string) => (dispatch: Dispatch<any>, getState: any) => {
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
    dispatch({ type: 'ROAD_CLOSURE/LOAD_ALL_ROAD_CLOSURES' });
    const generateListObjectsUrl = async () => {
        const response = await fetch(`https://api.sharedstreets.io/v0.1.0/data/list?filePath=road-closures/`);
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
                const output: IFetchAllSharedstreetsRoadClosuresSuccessResponse = {};
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
                            output[parts[1]][parts[2]] = true;
                            output[parts[1]].id = parts[2];
                            output[parts[1]].org = parts[1];
                            output[parts[1]].lastModified = lastModifieds[index].textContent as string;
                        }
                    })
                });
                return reverse(sortBy(output, (o) => o.lastModified));
        })
        .then((allRoadClosures) => {
            forEach(allRoadClosures, (roadClosure) => {
                const id = roadClosure.id as string
                const uploadUrls = generateUploadUrlsFromHash(id, orgName);
                if (uploadUrls.stateUploadUrl) {
                    dispatch(fetchAction({
                        afterRequest: (data) => {
                            if (typeof data === "string") {
                                return;
                            }
                            return { ...data, ...uploadUrls };
                        },
                        method: 'get',
                        requestUrl: uploadUrls.stateUploadUrl,
                        requested: 'ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_METADATA_SUCCESS',
                        requesting: 'ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_METADATA_REQUEST',
                    }));
                }
            })
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
        requestUrl: uploadUrls.stateUploadUrl,
        requested: 'ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_DATA_SUCCESS',
        requesting: 'ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_DATA_REQUEST',
    }));
};

export const saveRoadClosure = () => (dispatch: Dispatch<any>, getState: any) => {
    const state = getState() as RootState;
    const orgName = state.roadClosure.orgName;
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
        const response = await fetch(`https://api.sharedstreets.io/v0.1.0/data/upload?contentType=application/json&filePath=road-closures/${orgName}/${filename}/state`);
        const json = await response.json();
        const url = await json.url;
        return url;
    };
    generateStateUploadUrl().then((signedStateUploadUrl) => {
        dispatch({
            payload: generateUploadUrlsFromHash(filename, orgName),
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
    allOrgs: any,
    allRoadClosureItems: RoadClosureStateItem[],
    allRoadClosuresUploadUrls: IRoadClosureUploadUrls[],
    currentItem: RoadClosureStateItem,
    currentLineId: string,
    isEditingExistingClosure: boolean,
    isFetchingInput: boolean,
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
    allRoadClosuresUploadUrls: [],
    currentItem: new RoadClosureStateItem(),
    currentLineId: '',
    isEditingExistingClosure: false,
    isFetchingInput: false,
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
        stateUploadUrl: '',
        wazeUploadUrl: '',
    }
};

export const roadClosureReducer = (state: IRoadClosureState = defaultState, action: RoadClosureAction) => {
    let updatedItem: RoadClosureStateItem;
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
        
        case "ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_METADATA_REQUEST":
            return {
                ...state,
            };
        case "ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_METADATA_FAILURE":
            return {
                ...state,
            };
        case "ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_METADATA_SUCCESS":
            if (!action.payload || !action.payload.matchedStreets) {
                return state;
            }
            const newStateItem = new RoadClosureStateItem();
            newStateItem.form = action.payload.form;
            newStateItem.geometryIdDirectionFilter = action.payload.geometryIdDirectionFilter;
            newStateItem.invalidStreets = action.payload.invalidStreets;
            newStateItem.unmatchedStreets = action.payload.unmatchedStreets;
            newStateItem.matchedStreets.addFeaturesFromGeojson(action.payload.matchedStreets.features);

            const newStateItemMetadata = {
                geojsonUploadUrl: action.payload.geojsonUploadUrl,
                stateUploadUrl: action.payload.stateUploadUrl,
                wazeUploadUrl: action.payload.wazeUploadUrl,
            };

            return {
                ...state,
                allRoadClosureItems: [ ...state.allRoadClosureItems, ...[newStateItem]],
                allRoadClosuresUploadUrls: [ ...state.allRoadClosuresUploadUrls, ...[newStateItemMetadata]]
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
        
        case "ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_REQUEST":
            return {
                ...state,
                currentLineId: '',
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
                currentLineId: action.payload.currentLineId,
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
            }

        case "ROAD_CLOSURE/RESET_ROAD_CLOSURE":
            return {
                ...state,
                currentItem: new RoadClosureStateItem(),
                isEditingExistingClosure: false,
            };
            
        default:
            return state;
    }
};