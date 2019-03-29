import { RoadClosureOutputStateItem } from '../../models/RoadClosureOutputStateItem';
import { RoadClosureStateItem } from '../../models/RoadClosureStateItem';
import {
    ACTIONS as ROAD_CLOSURE_ACTIONS,
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

// test('ACTION: ROAD_CLOSURE/TOGGLE_DIRECTION_STREET_SEGMENT', () => {
//     const startingItem = new RoadClosureStateItem();
//     startingItem.geometryIdDirectionFilter = {
//         "a": {
//             "backward": false,
//             "forward": true
//         }
//     };
//     const startingState = Object.assign({}, defaultState);
//     startingState.currentItem = startingItem;

//     const expectedItem = new RoadClosureStateItem();
//     expectedItem.geometryIdDirectionFilter = {
//         "a": {
//             "backward": true,
//             "forward": false
//         },
//     }
//     const expectedState = Object.assign({}, startingState, {
//         currentItem: expectedItem
//     })

//     const togglePayload: IRoadClosureStateItemToggleDirectionPayload = {
//         direction: {
//             backward: true,
//             forward: false,
//         },
//         geometryId: "a",
//     }

//     expect(roadClosureReducer(startingState, ROAD_CLOSURE_ACTIONS.TOGGLE_DIRECTION_STREET_SEGMENT(togglePayload)))
//         .toEqual(expectedState);
// })


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