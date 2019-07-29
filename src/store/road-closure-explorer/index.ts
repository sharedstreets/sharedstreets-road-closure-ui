import { DateRange } from '@blueprintjs/datetime';
import {
    forEach,
    // isEmpty,
    // omit,
} from 'lodash'; 
import { Dispatch } from 'redux';
import {
    ActionType,
    createAsyncAction,
    createStandardAction,
} from 'typesafe-actions';
import { RoadClosureFormStateStreet } from '../../models/RoadClosureFormStateStreet';
import { SharedStreetsMatchGeomFeatureCollection } from '../../models/SharedStreets/SharedStreetsMatchGeomFeatureCollection';
import { SharedStreetsMatchGeomPath } from '../../models/SharedStreets/SharedStreetsMatchGeomPath';
import { SharedStreetsMatchGeomPoint } from '../../models/SharedStreets/SharedStreetsMatchGeomPoint';
import {
    generateUploadUrlsFromHash,
    IRoadClosureUploadUrls
} from '../../utils/upload-url-generator';
// import { v4 as uuid } from 'uuid';
// import { v4 } from '../../utils/uuid-regex';
import { fetchAction } from '../api';
import { RootState } from '../configureStore';




// actions
export type RoadClosureExplorerAction = ActionType<typeof ROAD_CLOSURE_EXPLORER_ACTIONS>;

export interface IFetchAllSharedstreetsRoadClosuresSuccessResponse {
    id: string,
    org: string,
    lastModified: string,
}

export const ROAD_CLOSURE_EXPLORER_ACTIONS = {
    FETCH_SHAREDSTREETS_PUBLIC_METADATA: createAsyncAction(
        'ROAD_CLOSURE_EXPLORER/FETCH_SHAREDSTREETS_PUBLIC_METADATA_REQUEST',
        'ROAD_CLOSURE_EXPLORER/FETCH_SHAREDSTREETS_PUBLIC_METADATA_SUCCESS',
        'ROAD_CLOSURE_EXPLORER/FETCH_SHAREDSTREETS_PUBLIC_METADATA_FAILURE'
    )<void, { [key: string] : any }, Error>(),
    LOADED_ALL_ROAD_CLOSURES: createStandardAction('ROAD_CLOSURE_EXPLORER/LOADED_ALL_ROAD_CLOSURES')<void>(),
    LOAD_ALL_ROAD_CLOSURES: createStandardAction('ROAD_CLOSURE_EXPLORER/LOAD_ALL_ROAD_CLOSURES')<void>(),
    SET_ALL_ROAD_CLOSURES_FILTER_LEVEL: createStandardAction('ROAD_CLOSURE_EXPLORER/SET_ALL_ROAD_CLOSURES_FILTER_LEVEL')<string>(),
    SET_ALL_ROAD_CLOSURES_FILTER_RANGE: createStandardAction('ROAD_CLOSURE_EXPLORER/SET_ALL_ROAD_CLOSURES_FILTER_RANGE')<DateRange>(),
    SET_ALL_ROAD_CLOSURES_SORT_ORDER: createStandardAction('ROAD_CLOSURE_EXPLORER/SET_ALL_ROAD_CLOSURES_SORT_ORDER')<string>(),
};

// side effects
export const loadAllRoadClosures = () => (dispatch: Dispatch<any>, getState: any) => {
    const state = getState() as RootState;
    const orgName = state.context.orgName;
    dispatch(ROAD_CLOSURE_EXPLORER_ACTIONS.LOAD_ALL_ROAD_CLOSURES());
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
                            requested: 'ROAD_CLOSURE_EXPLORER/FETCH_SHAREDSTREETS_PUBLIC_METADATA_SUCCESS',
                            requesting: 'ROAD_CLOSURE_EXPLORER/FETCH_SHAREDSTREETS_PUBLIC_METADATA_REQUEST',
                        }));
                    }
                })
            })
        })
        .then(() => {
            dispatch(ROAD_CLOSURE_EXPLORER_ACTIONS.LOADED_ALL_ROAD_CLOSURES());
        });
    });
}

// reducer
export interface IRoadClosureExplorerState {
    allRoadClosureItems: SharedStreetsMatchGeomFeatureCollection[],
    allRoadClosureMetadata: any[],
    allRoadClosuresFilterLevel: string,
    allRoadClosuresFilterRange: DateRange,
    allRoadClosuresSortOrder: string,
    allRoadClosuresUploadUrls: IRoadClosureUploadUrls[],
    isLoadingAllRoadClosures: boolean,
};

const defaultState: IRoadClosureExplorerState = {
    allRoadClosureItems: [],
    allRoadClosureMetadata: [],
    allRoadClosuresFilterLevel: 'all',
    allRoadClosuresFilterRange: [undefined, undefined],
    allRoadClosuresSortOrder: 'descending',
    allRoadClosuresUploadUrls: [],
    isLoadingAllRoadClosures: false,
};

export const roadClosureExplorerReducer = (state: IRoadClosureExplorerState = defaultState, action: RoadClosureExplorerAction) => {
    // let updatedItem: SharedStreetsMatchGeomFeatureCollection;
    switch (action.type) {
        case "ROAD_CLOSURE_EXPLORER/FETCH_SHAREDSTREETS_PUBLIC_METADATA_REQUEST":
            return {
                ...state,
            };
        case "ROAD_CLOSURE_EXPLORER/FETCH_SHAREDSTREETS_PUBLIC_METADATA_FAILURE":
            return {
                ...state,
            };
        case "ROAD_CLOSURE_EXPLORER/FETCH_SHAREDSTREETS_PUBLIC_METADATA_SUCCESS":
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
            

        case "ROAD_CLOSURE_EXPLORER/LOAD_ALL_ROAD_CLOSURES":
                return {
                    ...state,
                    allRoadClosureItems: [],
                    allRoadClosureMetadata: [],
                    allRoadClosuresUploadUrls: [],
                    isLoadingAllRoadClosures: true,
                };
            
        case "ROAD_CLOSURE_EXPLORER/LOADED_ALL_ROAD_CLOSURES":
            return {
                ...state,
                currentItem: new SharedStreetsMatchGeomFeatureCollection(),
                isLoadingAllRoadClosures: false,
            };
        

        case "ROAD_CLOSURE_EXPLORER/SET_ALL_ROAD_CLOSURES_FILTER_LEVEL":
                return {
                    ...state,
                    allRoadClosuresFilterLevel: action.payload
                };

        case "ROAD_CLOSURE_EXPLORER/SET_ALL_ROAD_CLOSURES_FILTER_RANGE":
            return {
                ...state,
                allRoadClosuresFilterRange: action.payload
            };
                
        case "ROAD_CLOSURE_EXPLORER/SET_ALL_ROAD_CLOSURES_SORT_ORDER":
            return {
                ...state,
                allRoadClosuresSortOrder: action.payload
            };
    
        default:
            return state;
    }
};