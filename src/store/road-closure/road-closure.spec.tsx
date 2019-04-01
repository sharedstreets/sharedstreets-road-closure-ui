import { RoadClosureOutputStateItem } from '../../models/RoadClosureOutputStateItem';
import { RoadClosureStateItem } from '../../models/RoadClosureStateItem';
import { SharedStreetsMatchFeatureCollection } from '../../models/SharedStreets/SharedStreetsMatchFeatureCollection';
import {
    ISharedStreetsMatchPathProperties,
    SharedStreetsMatchPath,
} from '../../models/SharedStreets/SharedStreetsMatchPath';
import {
    ACTIONS as ROAD_CLOSURE_ACTIONS,
    IFetchSharedstreetGeomsSuccessResponse,
    IRoadClosureState,
    IRoadClosureStateItemToggleDirectionPayload,
    roadClosureReducer,
} from './';


const defaultState: IRoadClosureState = {
    allOrgs: [],
    allRoadClosureItems: [],
    allRoadClosureMetadata: [],
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

test('ACTION: ROAD_CLOSURE/FETCH_SHAREDSTREET_GEOMS_SUCCESS - 1 street - 1 direction', () => {
    const startingState = Object.assign({}, defaultState, {
        isFetchingMatchedStreets: true,
    });
    const expectedState = Object.assign({}, startingState, {
        isFetchingMatchedStreets: false,
    });

    const properties: ISharedStreetsMatchPathProperties = {
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
        referenceId: '',
        referenceLength: 1,
        roadClass: '',
        section: [1],
        side: '',
        streetname: '',
        toIntersectionId: '',
        toStreetnames: ['']
    };
    const path = new SharedStreetsMatchPath({
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
    const matched = new SharedStreetsMatchFeatureCollection();
    matched.features = [path];
    matched.geometryIdPathMap = {
        "a": {
            'forward': path,
        }
    };
    expectedState.currentItem.matchedStreets = matched;
    expectedState.currentItem.geometryIdDirectionFilter = {
        "a": {
            backward: false,
            forward: true,
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
    const startingItem = new RoadClosureStateItem();
    startingItem.geometryIdDirectionFilter = {
        "a": {
            "backward": false,
            "forward": true
        }
    };
    const startingState = Object.assign({}, defaultState);
    startingState.currentItem = startingItem;

    const expectedItem = Object.assign({}, new RoadClosureStateItem());
    expectedItem.geometryIdDirectionFilter = {
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
})


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