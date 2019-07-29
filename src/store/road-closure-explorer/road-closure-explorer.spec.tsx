import { RoadClosureFormStateItem } from '../../models/RoadClosureFormStateItem';
import { RoadClosureFormStateStreet } from '../../models/RoadClosureFormStateStreet';
// import { RoadClosureOutputStateItem } from '../../models/RoadClosureOutputStateItem';
import { SharedStreetsMatchGeomFeatureCollection } from "../../models/SharedStreets/SharedStreetsMatchGeomFeatureCollection";
import {
    ISharedStreetsMatchGeomPathProperties,
    SharedStreetsMatchGeomPath,
} from '../../models/SharedStreets/SharedStreetsMatchGeomPath';
// import { SharedStreetsMatchPointFeatureCollection } from '../../models/SharedStreets/SharedStreetsMatchPointFeatureCollection';
import {
    // IFetchSharedstreetGeomsSuccessResponse,
    // IRoadClosureFormInputChangedPayload,
    IRoadClosureExplorerState,
    // IRoadClosureStateItemToggleDirectionPayload,
    ROAD_CLOSURE_EXPLORER_ACTIONS,
    roadClosureExplorerReducer,
} from './';

const defaultState: IRoadClosureExplorerState = {
    allRoadClosureItems: [],
    allRoadClosureMetadata: [],
    allRoadClosuresFilterLevel: 'all',
    allRoadClosuresFilterRange: [undefined, undefined],
    allRoadClosuresSortOrder: 'descending',
    allRoadClosuresUploadUrls: [],
    isLoadingAllRoadClosures: false,
};

test('ACTION: ROAD_CLOSURE/FETCH_SHAREDSTREETS_PUBLIC_METADATA_SUCCESS - 0 items in payload', () => {
    const startingState = Object.assign({}, defaultState);
    const payload = {};
    const expectedState = Object.assign({}, defaultState);
    
    expect(roadClosureExplorerReducer(startingState, ROAD_CLOSURE_EXPLORER_ACTIONS.FETCH_SHAREDSTREETS_PUBLIC_METADATA.success(payload))).toEqual(expectedState)
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

    expect(roadClosureExplorerReducer(startingState, ROAD_CLOSURE_EXPLORER_ACTIONS.FETCH_SHAREDSTREETS_PUBLIC_METADATA.success(payload))).toEqual(expectedState);
});

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
    expect(roadClosureExplorerReducer(startingState, ROAD_CLOSURE_EXPLORER_ACTIONS.LOAD_ALL_ROAD_CLOSURES())).toEqual(expectedState)
});