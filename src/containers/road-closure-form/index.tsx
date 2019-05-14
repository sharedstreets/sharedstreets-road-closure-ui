import { connect } from 'react-redux';
import RoadClosureForm, { IRoadClosureFormProps } from 'src/components/road-closure-form';
import {
    currentRoadClosureItemSelector,
} from 'src/selectors/road-closure';
import {
    getContiguousFeatureGroups, getContiguousFeatureGroupsDirections, getGeometryIdPathMap,
} from 'src/selectors/road-closure-geojson';
import { RootState } from 'src/store/configureStore';
import { ROAD_CLOSURE_ACTIONS } from 'src/store/road-closure';

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
        deleteStreetSegment: ROAD_CLOSURE_ACTIONS.DELETE_STREET_SEGMENT,
        hideRoadClosureOutput: ROAD_CLOSURE_ACTIONS.ROAD_CLOSURE_HIDE_OUTPUT,
        highlightMatchedStreet: ROAD_CLOSURE_ACTIONS.HIGHLIGHT_MATCHED_STREET,
        highlightMatchedStreetsGroup: ROAD_CLOSURE_ACTIONS.HIGHLIGHT_MATCHED_STREETS_GROUP,
        inputChanged: ROAD_CLOSURE_ACTIONS.INPUT_CHANGED,
        toggleStreetSegmentDirection: ROAD_CLOSURE_ACTIONS.TOGGLE_DIRECTION_STREET_SEGMENT,
        viewRoadClosureOutput: ROAD_CLOSURE_ACTIONS.ROAD_CLOSURE_VIEW_OUTPUT,
        zoomHighlightMatchedStreetsGroup: ROAD_CLOSURE_ACTIONS.ZOOM_HIGHLIGHT_MATCHED_STREETS_GROUP,
    },
)(RoadClosureForm) as React.ComponentClass<{}>;