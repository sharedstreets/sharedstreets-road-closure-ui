// import {
//     forEach
// } from 'lodash';
import { RoadClosureOutputStateItem } from '../models/RoadClosureOutputStateItem';
import { SharedStreetsMatchGeomFeatureCollection } from '../models/SharedStreets/SharedStreetsMatchGeomFeatureCollection';
import { SharedStreetsMatchPointFeatureCollection } from '../models/SharedStreets/SharedStreetsMatchPointFeatureCollection';
import { IRoadClosureState } from "../store/road-closure";
import {
    currentItemToGeojson,
    getContiguousFeatureGroups,
    // getContiguousFeatureGroupsDirections,
} from './road-closure-geojson';


import * as NEW_BRUNSWICK_NJ_1 from '../../test/static/usa/nj/new-brunswick/matched_new_brunswick_nj_1.json';
import * as NEW_BRUNSWICK_NJ_10 from '../../test/static/usa/nj/new-brunswick/matched_new_brunswick_nj_10.json';
import * as NEW_BRUNSWICK_NJ_2 from '../../test/static/usa/nj/new-brunswick/matched_new_brunswick_nj_2.json';
import * as NEW_BRUNSWICK_NJ_3 from '../../test/static/usa/nj/new-brunswick/matched_new_brunswick_nj_3.json';
import * as NEW_BRUNSWICK_NJ_4 from '../../test/static/usa/nj/new-brunswick/matched_new_brunswick_nj_4.json';
import * as NEW_BRUNSWICK_NJ_5 from '../../test/static/usa/nj/new-brunswick/matched_new_brunswick_nj_5.json';
import * as NEW_BRUNSWICK_NJ_6 from '../../test/static/usa/nj/new-brunswick/matched_new_brunswick_nj_6.json';
import * as NEW_BRUNSWICK_NJ_7 from '../../test/static/usa/nj/new-brunswick/matched_new_brunswick_nj_7.json';
import * as NEW_BRUNSWICK_NJ_8 from '../../test/static/usa/nj/new-brunswick/matched_new_brunswick_nj_8.json';
// import * as NEW_BRUNSWICK_NJ_9 from '../../test/static/usa/nj/new-brunswick/matched_new_brunswick_nj_9.json';
import * as PITTSBURGH_PA_1 from '../../test/static/usa/pa/pittsburgh/matched_pittsburgh_pa_1.json';
import * as PITTSBURGH_PA_2 from '../../test/static/usa/pa/pittsburgh/matched_pittsburgh_pa_2.json';


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

test("grouping paths - 1 two-way street (2 intersections), 2 one-way streets - 4 groups (NEW_BRUNSWICK_NJ_1)", () => {
    const startingState = Object.assign({}, defaultState);
    const currentItem = new SharedStreetsMatchGeomFeatureCollection();
    currentItem.addFeaturesFromGeojson(NEW_BRUNSWICK_NJ_1.features as any); 
    startingState.currentItem = currentItem;
    const receivedOutput = getContiguousFeatureGroups(startingState);
    expect(receivedOutput.length).toEqual(4);
});

test("grouping paths - 1 two-way street (2 intersections), 2 one-way streets - 4 groups (NEW_BRUNSWICK_NJ_2)", () => {
    const startingState = Object.assign({}, defaultState);
    const currentItem = new SharedStreetsMatchGeomFeatureCollection();
    currentItem.addFeaturesFromGeojson(NEW_BRUNSWICK_NJ_2.features as any);    
    startingState.currentItem = currentItem;
    const receivedOutput = getContiguousFeatureGroups(startingState);
    // (receivedOutput as SharedStreetsMatchPath[][]).forEach((g) => {
    //     g.map((f) => {
    //         console.log(f.properties.streetname, f.properties.direction)
    //     })
    // })
    // console.log("------")
    expect(receivedOutput.length).toEqual(4);
});

test("grouping paths - 1 two-way street (2 intersections) - 2 groups (NEW_BRUNSWICK_NJ_3)", () => {
    const startingState = Object.assign({}, defaultState);
    const currentItem = new SharedStreetsMatchGeomFeatureCollection();
    currentItem.addFeaturesFromGeojson(NEW_BRUNSWICK_NJ_3.features as any);    
    startingState.currentItem = currentItem;
    const receivedOutput = getContiguousFeatureGroups(startingState);
    expect(receivedOutput.length).toEqual(2);
});

test("grouping paths - 2 one-way streets (1 intersections, 2 streetnames, same direction) - 2 groups", () => {
    const startingState = Object.assign({}, defaultState);
    const currentItem = new SharedStreetsMatchGeomFeatureCollection();
    currentItem.addFeaturesFromGeojson(NEW_BRUNSWICK_NJ_4.features as any);    
    startingState.currentItem = currentItem;
    const receivedOutput = getContiguousFeatureGroups(startingState);
    // (receivedOutput as SharedStreetsMatchPath[][]).forEach((g) => {
    //     g.map((f) => console.log(f.properties.streetname))
    // })
    expect(receivedOutput.length).toEqual(2);
});

test("grouping paths - 2 one-way streets (1 intersections, 2 streetnames, opposite direction) - 2 groups", () => {
    const startingState = Object.assign({}, defaultState);
    const currentItem = new SharedStreetsMatchGeomFeatureCollection();
    currentItem.addFeaturesFromGeojson(NEW_BRUNSWICK_NJ_5.features as any);    
    startingState.currentItem = currentItem;
    const receivedOutput = getContiguousFeatureGroups(startingState);
    // (receivedOutput as SharedStreetsMatchPath[][]).forEach((g) => {
    //     g.map((f) => {
    //         console.log(f.properties.streetname, f.properties.direction)
    //     })
    // })
    expect(receivedOutput.length).toEqual(2);
});

test("grouping paths - 1 one-way streets - entirely within two intersections - 1 groups", () => {
    const startingState = Object.assign({}, defaultState);
    const currentItem = new SharedStreetsMatchGeomFeatureCollection();
    currentItem.addFeaturesFromGeojson(NEW_BRUNSWICK_NJ_6.features as any);    
    startingState.currentItem = currentItem;
    const receivedOutput = getContiguousFeatureGroups(startingState);
    // (receivedOutput as SharedStreetsMatchPath[][]).forEach((g) => {
    //     g.map((f) => {
    //         console.log(f.properties.streetname, f.properties.direction)
    //     })
    // })
    expect(receivedOutput.length).toEqual(1);
});

test("grouping paths - 2 one-way streets - 1 intersection - same direction - 2 groups", () => {
    const startingState = Object.assign({}, defaultState);
    const currentItem = new SharedStreetsMatchGeomFeatureCollection();
    currentItem.addFeaturesFromGeojson(NEW_BRUNSWICK_NJ_7.features as any);    
    startingState.currentItem = currentItem;
    const receivedOutput = getContiguousFeatureGroups(startingState);
    // (receivedOutput as SharedStreetsMatchPath[][]).forEach((g) => {
    //     g.map((f) => {
    //         console.log(f.properties.streetname, f.properties.direction)
    //     })
    // })
    expect(receivedOutput.length).toEqual(2);
});

test("grouping paths - 2 two-way streets (fwd & back) - 1 intersection - 1 one-way (fwd) - 3 groups", () => {
    const startingState = Object.assign({}, defaultState);
    const currentItem = new SharedStreetsMatchGeomFeatureCollection();
    currentItem.addFeaturesFromGeojson(NEW_BRUNSWICK_NJ_8.features as any);    
    startingState.currentItem = currentItem;
    const receivedOutput = getContiguousFeatureGroups(startingState);
    // (receivedOutput as SharedStreetsMatchPath[][]).forEach((g) => {
    //     g.map((f) => {
    //         console.log(f.properties.streetname, f.properties.direction)
    //     })
    // })
    expect(receivedOutput.length).toEqual(3);
});

test("grouping paths - 1 two-way streets (fwd & back) - 1 intersection - 2 one-way (fwd, back) - 4 groups", () => {
    const startingState = Object.assign({}, defaultState);
    const currentItem = new SharedStreetsMatchGeomFeatureCollection();
    currentItem.addFeaturesFromGeojson(PITTSBURGH_PA_1.features as any);    
    startingState.currentItem = currentItem;
    const receivedOutput = getContiguousFeatureGroups(startingState);
    // (receivedOutput as SharedStreetsMatchPath[][]).forEach((g) => {
    //     g.map((f) => {
    //         console.log(f.properties.streetname, f.properties.direction)
    //     })
    // })
    expect(receivedOutput.length).toEqual(4);
});

test("grouping paths - 1 two-way streets (fwd & back) - 1 intersection - 2 one-way (fwd & back) - 1 groups - one direction?", () => {
    const startingState = Object.assign({}, defaultState);
    const currentItem = new SharedStreetsMatchGeomFeatureCollection();
    currentItem.addFeaturesFromGeojson(PITTSBURGH_PA_2.features as any);    
    startingState.currentItem = currentItem;
    const receivedOutput = getContiguousFeatureGroups(startingState);
    // (receivedOutput as SharedStreetsMatchPath[][]).forEach((g) => {
    //     g.map((f) => {
    //         console.log(f.properties.streetname, f.properties.direction)
    //     })
    // })
    expect(receivedOutput.length).toEqual(1);
});

test("grouping paths - 4 one-way streets - one streetname - one direction - 1 group", () => {
    const startingState = Object.assign({}, defaultState);
    const currentItem = new SharedStreetsMatchGeomFeatureCollection();
    currentItem.addFeaturesFromGeojson(NEW_BRUNSWICK_NJ_10.features as any);    
    startingState.currentItem = currentItem;
    const receivedOutput = getContiguousFeatureGroups(startingState);
    // (receivedOutput as SharedStreetsMatchPath[][]).forEach((g) => {
    //     g.map((f) => {
    //         console.log(f.properties.streetname, f.properties.direction)
    //     })
    // })
    expect(receivedOutput.length).toEqual(1);
});

test.skip("new grouping", () => {
    const startingState = Object.assign({}, defaultState);
    const currentItem = new SharedStreetsMatchGeomFeatureCollection();
    currentItem.addFeaturesFromGeojson(NEW_BRUNSWICK_NJ_10.features as any);    
    startingState.currentItem = currentItem;
    const groups = getContiguousFeatureGroups(startingState);
    groups.forEach((g) => {
        g.map((f) => {
            // tslint:disable
            // console.log(f.properties.streetname, f.properties.direction)
            // console.log("\tto:",f.properties.toIntersectionId.substr(0,4), " from:",f.properties.fromIntersectionId.substr(0,4));
            // console.log("\tto:",f.properties.toStreetnames, " from:", f.properties.fromStreetnames);
            // tslint:enable
        })
    })
    expect(groups.length).toBe(1);
    // expect(groupsDirections).toEqual(expectedDirections);

    // expect(receivedOutput.length).toEqual(2);
})