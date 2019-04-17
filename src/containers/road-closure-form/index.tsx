import { connect } from 'react-redux';
import RoadClosureForm, { IRoadClosureFormProps } from 'src/components/road-closure-form';
import {
    currentRoadClosureItemSelector,
} from 'src/selectors/road-closure';
import {
    getContiguousFeatureGroups, getContiguousFeatureGroupsDirections, getGeometryIdPathMap,
} from 'src/selectors/road-closure-geojson';
import { RootState } from 'src/store/configureStore';
import { ACTIONS } from 'src/store/road-closure';

const mapStateToProps = (state: RootState) => ({
    currentRoadClosureGroups: getContiguousFeatureGroups(state.roadClosure),
    currentRoadClosureGroupsDirection: getContiguousFeatureGroupsDirections(state.roadClosure),
    currentRoadClosureGroupsGeometryIdPathMap: getGeometryIdPathMap(state.roadClosure),
    currentRoadClosureItem: currentRoadClosureItemSelector(state.roadClosure),
    roadClosure: state.roadClosure,
});

export default connect<{}, {}, IRoadClosureFormProps>(
    mapStateToProps,
    {
        deleteStreetSegment: ACTIONS.DELETE_STREET_SEGMENT,
        hideRoadClosureOutput: ACTIONS.ROAD_CLOSURE_HIDE_OUTPUT,
        inputChanged: ACTIONS.INPUT_CHANGED,
        toggleStreetSegmentDirection: ACTIONS.TOGGLE_DIRECTION_STREET_SEGMENT,
        viewRoadClosureOutput: ACTIONS.ROAD_CLOSURE_VIEW_OUTPUT,
    },
)(RoadClosureForm) as React.ComponentClass<{}>;