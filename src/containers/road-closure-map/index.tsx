import { connect } from 'react-redux';
// import {
//     getContiguousFeatureGroups, // getContiguousFeatureGroupsDirections, getGeometryIdPathMap,
// } from 'src/selectors/road-closure-geojson';
import { currentRoadClosureItemOutput } from 'src/selectors/road-closure';
import { getDirectionIconPoints, getRoadBlockIconPoints } from 'src/selectors/road-closure-map';
import { filterRoadClosureSavedItems, sortRoadClosureSavedItemsByLastModified } from 'src/selectors/road-closure-saved-items';
import { RootState } from 'src/store/configureStore';
import RoadClosureMap, { IRoadClosureMapProps } from '../../components/road-closure-map';
import {
    findMatchedPoint,
    findMatchedStreet,
    ROAD_CLOSURE_ACTIONS,
} from '../../store/road-closure';

export interface IRoadClosureMapContainerProps {
    isDrawingEnabled: boolean,
    isViewingAllClosures: boolean,
}

const mapStateToProps = (state: RootState, ownProps: IRoadClosureMapContainerProps) => {
    // currentRoadClosureGroups: getContiguousFeatureGroups(state.roadClosure),
    return {
        ...filterRoadClosureSavedItems(
            sortRoadClosureSavedItemsByLastModified(state.roadClosureExplorer, state.roadClosureExplorer.allRoadClosuresSortOrder),
            state.roadClosureExplorer.allRoadClosuresFilterLevel
        ),
        currentPossibleDirections: state.roadClosure.currentPossibleDirections,
        currentRoadClosureItemOutput: currentRoadClosureItemOutput(state.roadClosure),
        directionIconPoints: getDirectionIconPoints(state.roadClosure),
        highlightedFeatureGroup: state.roadClosure.highlightedFeatureGroup,
        isDrawingEnabled: ownProps.isDrawingEnabled,
        isLoadingAllRoadClosures: state.roadClosureExplorer.isLoadingAllRoadClosures,
        isViewingAllClosures: ownProps.isViewingAllClosures,
        roadBlockIconPoints: getRoadBlockIconPoints(state.roadClosure),
        roadClosure: state.roadClosure,
    }
};

export default connect<{}, {}, IRoadClosureMapProps>(
    mapStateToProps,
    {
        findMatchedPoint,
        findMatchedStreet,
        inputChanged: ROAD_CLOSURE_ACTIONS.INPUT_CHANGED,
    },
)(RoadClosureMap) as React.ComponentClass<IRoadClosureMapContainerProps>;