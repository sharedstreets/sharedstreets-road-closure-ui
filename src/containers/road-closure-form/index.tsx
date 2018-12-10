import { connect } from 'react-redux';
import { currentRoadClosureItemSelector, streetnameMatchedStreetIndexMap } from 'src/selectors/road-closure';
import { RootState } from 'src/store/configureStore';
import RoadClosureForm, { IRoadClosureFormProps } from '../../components/road-closure-form';
import { ACTIONS } from '../../store/road-closure';

const mapStateToProps = (state: RootState) => ({
    currentRoadClosureItem: currentRoadClosureItemSelector({
        roadClosure: state.roadClosure
    }),
    roadClosure: state.roadClosure,
    streetnameMatchedStreetIndexMap: streetnameMatchedStreetIndexMap(state),
});

export default connect<{}, {}, IRoadClosureFormProps>(
    mapStateToProps,
    {
        addNewSelection: ACTIONS.ADD_NEW_SELECTION,
        deselectRoadClosure: ACTIONS.ROAD_CLOSURE_DESELECTED,
        inputChanged: ACTIONS.INPUT_CHANGED,
        nextSelection: ACTIONS.NEXT_SELECTION,
        previousSelection: ACTIONS.PREVIOUS_SELECTION,
    },
)(RoadClosureForm) as React.ComponentClass<{}>;