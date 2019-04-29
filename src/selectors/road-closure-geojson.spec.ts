// tslint:disable
import { RoadClosureOutputStateItem } from '../models/RoadClosureOutputStateItem';
import { SharedStreetsMatchFeatureCollection } from '../models/SharedStreets/SharedStreetsMatchFeatureCollection';
import { IRoadClosureState } from "../store/road-closure";
import {
    createOneWayStreet,
    createOneWayStreetFromIntersection,
    // createOneWayStreetToIntersection,
    createTwoWayStreet,
} from '../utils/street-builder';
import {
    currentItemToGeojson,
    groupPathsByContiguity,
} from './road-closure-geojson';


const defaultState: IRoadClosureState = {
    allOrgs: [],
    allRoadClosureItems: [],
    allRoadClosureMetadata: [],
    allRoadClosuresUploadUrls: [],
    currentItem: new SharedStreetsMatchFeatureCollection(),
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
        wazeUploadUrl: '',
    }
};

test("currentItemToGeojson - empty", () => {
    const startingState = Object.assign({}, defaultState);
    const receivedOutput = currentItemToGeojson(startingState);
    const expectedOutput = {
        features: [],
        properties: {
            type: "ROAD_CLOSED"
        },
        type: "FeatureCollection"
    };
    expect(receivedOutput).toEqual(expectedOutput);
});

test("currentItemToGeojson - one way street", () => {
    const startingState = Object.assign({}, defaultState);    
    const currentItem = new SharedStreetsMatchFeatureCollection();
    const features = [];
    const gdf = {};
    const street = {};
    const path = createOneWayStreet("forward");
    Object.assign(gdf, {
        [path.properties.geometryId]: {
            backward: path.properties.direction === "backward",
            forward: path.properties.direction === "forward"
        }
    });
    
    Object.assign(street, {
        [path.properties.geometryId]: {
            backward: path.properties.direction === "backward" ? path : {},
            forward: path.properties.direction === "forward" ? path : {},
        }
    });
    features.push(path);
    currentItem.properties.geometryIdDirectionFilter = gdf;
    currentItem.properties.street = street;
    currentItem.addFeaturesFromGeojson(features);
    startingState.currentItem = currentItem;
    const receivedOutput = currentItemToGeojson(startingState);
    const expectedOutput = {
        features,
        properties: {
            type: "ROAD_CLOSED"
        },
        type: "FeatureCollection"
    };
    expect(receivedOutput).toEqual(expectedOutput);
});

test("currentItemToGeojson - two way street", () => {
    const startingState = Object.assign({}, defaultState);    
    const currentItem = new SharedStreetsMatchFeatureCollection();
    const features = [];
    const gdf = {};
    const street = {};
    const paths = createTwoWayStreet();
    Object.assign(gdf, {
        [paths.forward.properties.geometryId]: {
            backward: true,
            forward: true,
        }
    });
    
    Object.assign(street, {
        [paths.backward.properties.geometryId]: {
            backward: paths.backward,
            forward: paths.forward,
        }
    });
    features.push(paths.forward, paths.backward);
    currentItem.properties.geometryIdDirectionFilter = gdf;
    currentItem.properties.street = street;
    currentItem.addFeaturesFromGeojson(features);
    startingState.currentItem = currentItem;
    const receivedOutput = currentItemToGeojson(startingState);
    const expectedOutput = {
        features,
        properties: {
            type: "ROAD_CLOSED"
        },
        type: "FeatureCollection"
    };
    // console.log(features);
    expect(receivedOutput).toEqual(expectedOutput);
});

test("grouping paths - 2 disjoint 1 way streets -> ->", () => {
    const startingState = Object.assign({}, defaultState);
    const currentItem = new SharedStreetsMatchFeatureCollection();
    const features = [];
    const gdf = {};
    const street = {};
    // generate features
    features.push(
        createOneWayStreet("forward"),
        createOneWayStreet("forward")
    );
    currentItem.properties.geometryIdDirectionFilter = gdf;
    currentItem.properties.street = street;
    currentItem.addFeaturesFromGeojson(features);
    startingState.currentItem = currentItem;
    const receivedOutput = groupPathsByContiguity(startingState, false);
    const expectedOutput = [
        [features[1],
        features[0]],
    ];
    console.log(receivedOutput);
    expect(receivedOutput).toEqual(expectedOutput);
});

test("grouping paths - 2 connected 1 way streets ->->", () => {
    const startingState = Object.assign({}, defaultState);
    const currentItem = new SharedStreetsMatchFeatureCollection();
    const features = [];
    const gdf = {};
    const street = {};
    // generate features
    features.push(
        createOneWayStreet("forward"),
    );
    features.push(
        createOneWayStreetFromIntersection("forward", features[0].properties.toIntersectionId)
    );
    currentItem.properties.geometryIdDirectionFilter = gdf;
    currentItem.properties.street = street;
    currentItem.addFeaturesFromGeojson(features);
    startingState.currentItem = currentItem;
    const receivedOutput = groupPathsByContiguity(startingState, false);
    const expectedOutput = [
        [features[1], features[0]],
    ];
    console.log((receivedOutput));
    expect(receivedOutput).toEqual(expectedOutput);
});