import { RoadClosureFormStateItem } from '../../models/RoadClosureFormStateItem';
import { RoadClosureFormStateStreet } from '../../models/RoadClosureFormStateStreet';
import { RoadClosureOutputStateItem } from '../../models/RoadClosureOutputStateItem';
import { SharedStreetsMatchGeomFeatureCollection } from "../../models/SharedStreets/SharedStreetsMatchGeomFeatureCollection";
import {
    ISharedStreetsMatchGeomPathProperties,
    SharedStreetsMatchGeomPath,
} from '../../models/SharedStreets/SharedStreetsMatchGeomPath';
import { SharedStreetsMatchPointFeatureCollection } from '../../models/SharedStreets/SharedStreetsMatchPointFeatureCollection';
import {
    ACTIONS as ROAD_CLOSURE_ACTIONS,
    IFetchSharedstreetGeomsSuccessResponse,
    IRoadClosureFormInputChangedPayload,
    IRoadClosureState,
    IRoadClosureStateItemToggleDirectionPayload,
    roadClosureReducer,
} from './';


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
    message: {
        intent: "none",
        text: ""
    },
    orgName: '',
    output: new RoadClosureOutputStateItem(),
    uploadUrls: {
        geojsonUploadUrl: '',
        // stateUploadUrl: '',
        wazeUploadUrl: '',
    }
};

test('ACTION: ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_METADATA_SUCCESS - 0 items in payload', () => {
    const startingState = Object.assign({}, defaultState);
    const payload = {};
    const expectedState = Object.assign({}, defaultState);
    
    expect(roadClosureReducer(startingState, ROAD_CLOSURE_ACTIONS.FETCH_SHAREDSTREETS_PUBLIC_METADATA.success(payload))).toEqual(expectedState)
});

test('ACTION: ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_METADATA_SUCCESS - 1 item in payload', () => {
    const startingState = Object.assign({}, defaultState);

    const pathProperties: ISharedStreetsMatchGeomPathProperties = {
        direction: 'forward',
        fromIntersectionId: '',
        fromStreetnames: [''],
        geometryId: 'a',
        originalFeature: {
            geometry: {
                coordinates: [
                    [1, 2],
                    [2, 3]
                ],
                type: "LineString",
            },
            properties: {},
            type: "Feature"
        },
        point: 1,
        referenceId: 'b',
        referenceLength: 1,
        roadClass: '',
        section: [1],
        side: '',
        streetname: '',
        toIntersectionId: '',
        toStreetnames: ['']
    };
    const path = new SharedStreetsMatchGeomPath({
        geometry: {
            coordinates: [
                [1, 2],
                [2, 3],
            ],
            type: "LineString",
        },
        properties: pathProperties,
        type: "Feature",
    });

    const roadClosureItemProperties = new RoadClosureFormStateItem();

    const geometryIdDirectionFilter = {
        "a": {
            backward: false,
            forward: true,
        }
    };

    
    const forwardStreet = new RoadClosureFormStateStreet();
    forwardStreet.geometryId = 'a';
    forwardStreet.referenceId = 'b';
    forwardStreet.streetname = '';

    const roadClosureItem = new SharedStreetsMatchGeomFeatureCollection();
    roadClosureItem.features = [path];
    roadClosureItem.properties = {
        ...roadClosureItemProperties,
        geometryIdDirectionFilter,
        street: {
            "a": {
                backward: new RoadClosureFormStateStreet(),
                forward: forwardStreet,
            }
        }
    }

    const expectedState = Object.assign({}, startingState, {
        allRoadClosureItems: [roadClosureItem],
        allRoadClosureMetadata: [{
            lastModified: '04-16-2019'
        }],
        allRoadClosuresUploadUrls: [{
            geojsonUploadUrl: 'https://geojsonuploadurl.com',
            wazeUploadUrl: 'https://wazeuploadurl.com',
        }],
    });

    const payload = {
        features: [path],
        geojsonUploadUrl: 'https://geojsonuploadurl.com',
        lastModified: '04-16-2019',
        properties: roadClosureItemProperties,
        wazeUploadUrl: 'https://wazeuploadurl.com',
    };

    expect(roadClosureReducer(startingState, ROAD_CLOSURE_ACTIONS.FETCH_SHAREDSTREETS_PUBLIC_METADATA.success(payload))).toEqual(expectedState);
});

test('ACTION: ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_DATA_SUCCESS', () => {
    const startingState = Object.assign({}, defaultState, {
        isFetchingInput: true,
        isLoadedInput: false,
    });

    const pathProperties: ISharedStreetsMatchGeomPathProperties = {
        direction: 'forward',
        fromIntersectionId: '',
        fromStreetnames: [''],
        geometryId: 'a',
        originalFeature: {
            geometry: {
                coordinates: [
                    [1, 2],
                    [2, 3]
                ],
                type: "LineString",
            },
            properties: {},
            type: "Feature"
        },
        point: 1,
        referenceId: 'b',
        referenceLength: 1,
        roadClass: '',
        section: [1],
        side: '',
        streetname: '',
        toIntersectionId: '',
        toStreetnames: ['']
    };
    const path = new SharedStreetsMatchGeomPath({
        geometry: {
            coordinates: [
                [1, 2],
                [2, 3],
            ],
            type: "LineString",
        },
        properties: pathProperties,
        type: "Feature",
    });

    const roadClosureItemProperties = new RoadClosureFormStateItem();

    const geometryIdDirectionFilter = {
        "a": {
            backward: false,
            forward: true,
        }
    };

    
    const forwardStreet = new RoadClosureFormStateStreet();
    forwardStreet.geometryId = 'a';
    forwardStreet.referenceId = 'b';
    forwardStreet.streetname = '';

    const roadClosureItem = new SharedStreetsMatchGeomFeatureCollection();
    roadClosureItem.features = [path];
    roadClosureItem.properties = {
        ...roadClosureItemProperties,
        geometryIdDirectionFilter,
        street: {
            "a": {
                backward: new RoadClosureFormStateStreet(),
                forward: forwardStreet,
            }
        }
    }

    const expectedState = Object.assign({}, startingState, {
        currentItem: roadClosureItem,
        isFetchingInput: false,
        isLoadedInput: true,
    });

    const payload = new SharedStreetsMatchGeomFeatureCollection();
    payload.features = [path];
    payload.properties = roadClosureItemProperties;

    expect(roadClosureReducer(startingState, ROAD_CLOSURE_ACTIONS.FETCH_SHAREDSTREETS_PUBLIC_DATA.success(payload))).toEqual(expectedState);
});

test('ACTION: ROAD_CLOSURE/GENERATE_SHAREDSTREETS_PUBLIC_DATA_UPLOAD_URL_SUCCESS', () => {
    const startingState = Object.assign({}, defaultState, {
        isGeneratingUploadUrl: true,
    });
    const expectedState = Object.assign({}, startingState, {
        isGeneratingUploadUrl: false,
        uploadUrls: {
            geojsonUploadUrl: 'https://geojsonuploadurl.com',
            wazeUploadUrl: 'https://geojsonuploadurl.com',
        }
    });

    const payload = {
        geojsonUploadUrl: 'https://geojsonuploadurl.com',
        wazeUploadUrl: 'https://geojsonuploadurl.com',
    }

    expect(roadClosureReducer(startingState, ROAD_CLOSURE_ACTIONS.GENERATE_SHAREDSTREETS_PUBLIC_DATA_UPLOAD_URL.success(payload))).toEqual(expectedState);
});


test('ACTION: ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_SUCCESS - 1 street & 1 direction', () => {
    const startingState = Object.assign({}, defaultState, {
        isFetchingMatchedStreets: true,
    });
    const expectedState = Object.assign({}, startingState, {
        isFetchingMatchedStreets: false,
    });

    const properties: ISharedStreetsMatchGeomPathProperties = {
        direction: 'forward',
        fromIntersectionId: '',
        fromStreetnames: [''],
        geometryId: 'a',
        originalFeature: {
            geometry: {
                coordinates: [
                    [1, 2],
                    [2, 3]
                ],
                type: "LineString",
            },
            properties: {},
            type: "Feature"
        },
        point: 1,
        referenceId: 'b',
        referenceLength: 1,
        roadClass: '',
        section: [1],
        side: '',
        streetname: '',
        toIntersectionId: '',
        toStreetnames: ['']
    };
    const path = new SharedStreetsMatchGeomPath({
        geometry: {
            coordinates: [
                [1, 2],
                [2, 3],
            ],
            type: "LineString",
        },
        properties,
        type: "Feature",
    });
    const matched = new SharedStreetsMatchGeomFeatureCollection();
    matched.features = [path];

    expectedState.currentItem = matched;
    expectedState.currentItem.properties.geometryIdDirectionFilter = {
        "a": {
            backward: false,
            forward: true,
        }
    }

    const forwardStreet = new RoadClosureFormStateStreet();
    forwardStreet.geometryId = 'a';
    forwardStreet.referenceId = 'b';
    forwardStreet.streetname = '';
    
    expectedState.currentItem.properties.street = {
        "a": {
            backward: new RoadClosureFormStateStreet(),
            forward: forwardStreet,
        }
    }

    const payload: IFetchSharedstreetGeomsSuccessResponse = {
        currentLineId: '',
        invalid: {
            features: [],
            type: "FeatureCollection",
        },
        matched,
        unmatched: {
            features: [],
            type: "FeatureCollection",
        },
    };

    expect(roadClosureReducer(startingState, ROAD_CLOSURE_ACTIONS.FETCH_SHAREDSTREET_GEOMS.success(payload))).toEqual(expectedState)
});

test('ACTION: ROAD_CLOSURE/TOGGLE_DIRECTION_STREET_SEGMENT - geometryIds', () => {
    const startingItem = new SharedStreetsMatchGeomFeatureCollection();
    startingItem.properties.geometryIdDirectionFilter = {
        "a": {
            "backward": false,
            "forward": true
        }
    };
    const startingState = Object.assign({}, defaultState);
    startingState.currentItem = startingItem;

    const expectedItem = Object.assign({}, new SharedStreetsMatchGeomFeatureCollection());
    expectedItem.properties.geometryIdDirectionFilter = {
        "a": {
            "backward": true,
            "forward": false
        },
    }
    const expectedState = Object.assign({}, defaultState);
    expectedState.currentItem = expectedItem;

    const togglePayload: IRoadClosureStateItemToggleDirectionPayload = {
        direction: {
            backward: true,
            forward: false,
        },
        geometryIds: ["a"],
    }

    expect(roadClosureReducer(startingState, ROAD_CLOSURE_ACTIONS.TOGGLE_DIRECTION_STREET_SEGMENT(togglePayload)))
        .toEqual(expectedState);
});

test('ACTION: ROAD_CLOSURE/INPUT_CHANGED - text', () => {
    const startingState = Object.assign({}, defaultState);

    const payload: IRoadClosureFormInputChangedPayload = {
        description: 'updated description',
        geometryId: 'geomId',
        key: 'description',
        referenceId: 'refId',
    };

    const geometryIdDirectionFilter = {
        "a": {
            backward: false,
            forward: true,
        }
    };

    const forwardStreet = new RoadClosureFormStateStreet();
    forwardStreet.geometryId = 'a';
    forwardStreet.referenceId = 'b';
    forwardStreet.streetname = '';

    const currentItem = new SharedStreetsMatchGeomFeatureCollection();
    currentItem.properties.description = 'updated description';
    currentItem.properties.geometryIdDirectionFilter = geometryIdDirectionFilter;
    currentItem.properties.street = {
        "a": {
            backward: new RoadClosureFormStateStreet(),
            forward: forwardStreet,
        }
    };
    

    const expectedState = Object.assign({}, startingState, {
        currentItem
    });

    expect(roadClosureReducer(startingState, ROAD_CLOSURE_ACTIONS.INPUT_CHANGED(payload))).toEqual(expectedState)
});


// test('ACTION: ROAD_CLOSURE/INPUT_CHANGED - date', () => {
//     const startingState = Object.assign({}, defaultState);

//     const payload: IRoadClosureFormInputChangedPayload = {
//         description: 'updated description',
//         geometryId: 'geomId',
//         key: 'description',
//         referenceId: 'refId',
//     };

//     const geometryIdDirectionFilter = {
//         "a": {
//             backward: false,
//             forward: true,
//         }
//     };

//     const forwardStreet = new RoadClosureFormStateStreet();
//     forwardStreet.geometryId = 'a';
//     forwardStreet.referenceId = 'b';
//     forwardStreet.streetname = '';

//     const currentItem = new SharedStreetsMatchFeatureCollection();
//     currentItem.properties.description = 'updated description';
//     currentItem.properties.geometryIdDirectionFilter = geometryIdDirectionFilter;
//     currentItem.properties.street = {
//         "a": {
//             backward: new RoadClosureFormStateStreet(),
//             forward: forwardStreet,
//         }
//     };
    

//     const expectedState = Object.assign({}, startingState, {
//         currentItem
//     });

//     expect(roadClosureReducer(startingState, ROAD_CLOSURE_ACTIONS.INPUT_CHANGED(payload))).toEqual(expectedState)
// });


// test('ACTION: ROAD_CLOSURE/INPUT_CHANGED - form', () => {
//     const startingState = Object.assign({}, defaultState);

//     const payload: IRoadClosureFormInputChangedPayload = {
//         description: 'updated description',
//         geometryId: 'geomId',
//         key: 'description',
//         referenceId: 'refId',
//     };

//     const geometryIdDirectionFilter = {
//         "a": {
//             backward: false,
//             forward: true,
//         }
//     };

//     const forwardStreet = new RoadClosureFormStateStreet();
//     forwardStreet.geometryId = 'a';
//     forwardStreet.referenceId = 'b';
//     forwardStreet.streetname = '';

//     const currentItem = new SharedStreetsMatchFeatureCollection();
//     currentItem.properties.description = 'updated description';
//     currentItem.properties.geometryIdDirectionFilter = geometryIdDirectionFilter;
//     currentItem.properties.street = {
//         "a": {
//             backward: new RoadClosureFormStateStreet(),
//             forward: forwardStreet,
//         }
//     };
    

//     const expectedState = Object.assign({}, startingState, {
//         currentItem
//     });

//     expect(roadClosureReducer(startingState, ROAD_CLOSURE_ACTIONS.INPUT_CHANGED(payload))).toEqual(expectedState)
// });

test('ACTION: ROAD_CLOSURE/LOAD_ALL_ROAD_CLOSURES', () => {
    const startingState = Object.assign({}, defaultState, {
        allRoadClosureItems: [{}],
        allRoadClosuresUploadUrls: [{}],
        isLoadingAllRoadClosures: false,
    });
    const expectedState = Object.assign({}, startingState, {
        allRoadClosureItems: [],
        allRoadClosuresUploadUrls: [],
        isLoadingAllRoadClosures: true,
    })
    expect(roadClosureReducer(startingState, ROAD_CLOSURE_ACTIONS.LOAD_ALL_ROAD_CLOSURES())).toEqual(expectedState)
});