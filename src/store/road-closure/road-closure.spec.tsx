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
    IFetchSharedstreetGeomsSuccessResponse,
    IRoadClosureFormInputChangedPayload,
    IRoadClosureState,
    IRoadClosureStateItemToggleDirectionPayload,
    ROAD_CLOSURE_ACTIONS,
    roadClosureReducer,
} from './';


let defaultState: IRoadClosureState = {
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
        // stateUploadUrl: '',
        wazeUploadUrl: '',
    }
};
let currentItem = new SharedStreetsMatchGeomFeatureCollection();

beforeEach(() => {
    currentItem = new SharedStreetsMatchGeomFeatureCollection();
    defaultState = {
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
            // stateUploadUrl: '',
            wazeUploadUrl: '',
        }
    };
})

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

    currentItem = new SharedStreetsMatchGeomFeatureCollection();
    currentItem.properties.description = 'updated description';

    const expectedState = Object.assign({}, startingState, {
        currentItem
    });

    expect(roadClosureReducer(startingState, ROAD_CLOSURE_ACTIONS.INPUT_CHANGED(payload))).toEqual(expectedState)
});

test('ACTION: ROAD_CLOSURE/INPUT_CHANGED - schedule - 1 week, 1 day - failed addition', () => {
    const startingState = Object.assign({}, defaultState);
    startingState.currentItem.properties.startTime = "2019-01-01 00:00:00";
    startingState.currentItem.properties.endTime = "2019-01-30 00:00:00";

    const payload: IRoadClosureFormInputChangedPayload = {
        day: "Wednesday",
        endTime: "16:00",
        geometryId: "",
        key: "schedule",
        referenceId: "",
        startTime: "00:00",
        weekOfYear: "10", 
    };

    currentItem = new SharedStreetsMatchGeomFeatureCollection();
    currentItem.properties.startTime = "2019-01-01 00:00:00";
    currentItem.properties.endTime = "2019-01-30 00:00:00";

    const expectedState = Object.assign({}, startingState, {
        currentItem
    });
    expect(roadClosureReducer(startingState, ROAD_CLOSURE_ACTIONS.INPUT_CHANGED(payload))).toEqual(expectedState)
});

test('ACTION: ROAD_CLOSURE/INPUT_CHANGED - schedule - 1 week, 1 day - successful addition', () => {
    const startingState = Object.assign({}, defaultState);
    startingState.currentItem.properties.startTime = "2019-01-01 00:00:00";
    startingState.currentItem.properties.endTime = "2019-01-30 00:00:00";

    const payload: IRoadClosureFormInputChangedPayload = {
        day: "Wednesday",
        endTime: "16:00",
        geometryId: "",
        key: "schedule",
        referenceId: "",
        startTime: "00:00",
        weekOfYear: "1", 
    };

    currentItem = new SharedStreetsMatchGeomFeatureCollection();
    currentItem.properties.startTime = "2019-01-01 00:00:00";
    currentItem.properties.endTime = "2019-01-30 00:00:00";
    currentItem.properties.schedule = {
        1: {
            "Wednesday": [
                {
                    endTime: "16:00",
                    startTime: "00:00",
                }
            ]
        }
    }

    const expectedState = Object.assign({}, startingState, {
        currentItem
    });

    expect(roadClosureReducer(startingState, ROAD_CLOSURE_ACTIONS.INPUT_CHANGED(payload))).toEqual(expectedState)
});


test('ACTION: ROAD_CLOSURE/INPUT_REMOVED - schedule - 1 week, 1 day - successful removal', () => {
    const startingState = Object.assign({}, defaultState);
    startingState.currentItem.properties.startTime = "2019-01-01 00:00:00";
    startingState.currentItem.properties.endTime = "2019-01-30 00:00:00";
    startingState.currentItem.properties.schedule = {
        1: {
            "Wednesday": [
                {
                    endTime: "16:00",
                    startTime: "00:00",
                }
            ]
        }
    };

    const payload: IRoadClosureFormInputChangedPayload = {
        day: "Wednesday",
        endTime: "16:00",
        geometryId: "",
        key: "schedule",
        referenceId: "",
        startTime: "00:00",
        weekOfYear: "1", 
    };

    currentItem = new SharedStreetsMatchGeomFeatureCollection();
    currentItem.properties.startTime = "2019-01-01 00:00:00";
    currentItem.properties.endTime = "2019-01-30 00:00:00";
    currentItem.properties.schedule = {
        1: {}
    }

    const expectedState = Object.assign({}, startingState, {
        currentItem
    });

    expect(roadClosureReducer(startingState, ROAD_CLOSURE_ACTIONS.INPUT_REMOVED(payload))).toEqual(expectedState)
});


test('ACTION: ROAD_CLOSURE/INPUT_CHANGED - date', () => {
    const startingState = Object.assign({}, defaultState);

    const payload: IRoadClosureFormInputChangedPayload = {
        geometryId: "",
        key: "startTime",
        referenceId: "",
        startTime: "2019-06-18 12:00:00",
    };

    currentItem = new SharedStreetsMatchGeomFeatureCollection();
    currentItem.properties.startTime = "2019-06-18 12:00:00";

    const expectedState = Object.assign({}, startingState, {
        currentItem
    });

    expect(roadClosureReducer(startingState, ROAD_CLOSURE_ACTIONS.INPUT_CHANGED(payload))).toEqual(expectedState)
});

test('ACTION: ROAD_CLOSURE/INPUT_CHANGED - date with existing date & schedule - successful removal of out of bounds schedule', () => {
    const startingState = Object.assign({}, defaultState);
    startingState.currentItem.properties.startTime = "2019-01-01 00:00:00";
    startingState.currentItem.properties.endTime = "2019-01-30 00:00:00";
    startingState.currentItem.properties.schedule = {
        1: {
            "Wednesday": [
                {
                    endTime: "16:00",
                    startTime: "00:00",
                }
            ]
        }
    };

    const payload: IRoadClosureFormInputChangedPayload = {
        geometryId: "",
        key: "startTime",
        referenceId: "",
        startTime: "2019-01-20 12:00:00",
    };

    currentItem = new SharedStreetsMatchGeomFeatureCollection();
    currentItem.properties.startTime = "2019-01-20 12:00:00";
    currentItem.properties.endTime = "2019-01-30 00:00:00";

    const expectedState = Object.assign({}, startingState, {
        currentItem
    });

    expect(roadClosureReducer(startingState, ROAD_CLOSURE_ACTIONS.INPUT_CHANGED(payload))).toEqual(expectedState)
});

test('ACTION: ROAD_CLOSURE/RESET_ROAD_CLOSURE', () => {
    const startingState = Object.assign({}, defaultState);

    currentItem = new SharedStreetsMatchGeomFeatureCollection();
    currentItem.properties.description = "updated description";
    currentItem.properties.reference = "REF";
    currentItem.properties.startTime = "20";
    currentItem.properties.subtype = "ROAD_CLOSED_CONSTRUCTION";
    startingState.currentItem = currentItem;

    startingState.uploadUrls = {
        geojsonUploadUrl: 'https://geojson.com',
        wazeUploadUrl: 'https://waze.com',
    }

    startingState.allOrgs = [
        {}, {}, {}
    ];

    const expectedState = Object.assign({}, defaultState);

    expect(roadClosureReducer(startingState, ROAD_CLOSURE_ACTIONS.RESET_ROAD_CLOSURE())).toEqual(expectedState)
});

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

//     currentItem = new SharedStreetsMatchFeatureCollection();
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