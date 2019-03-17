import { connect } from 'react-redux';
import {
    currentRoadClosureItemSelector,
} from 'src/selectors/road-closure';
import { RootState } from 'src/store/configureStore';
import RoadClosureForm, { IRoadClosureFormProps } from '../../components/road-closure-form';
import { ACTIONS } from '../../store/road-closure';

const mapStateToProps = (state: RootState) => ({
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