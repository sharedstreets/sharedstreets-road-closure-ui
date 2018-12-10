import { connect } from 'react-redux';
import RoadClosureList, { IRoadClosureListProps } from 'src/components/road-closure-list';
import { RootState } from 'src/store/configureStore';
import { ACTIONS } from '../../store/road-closure';

const mapStateToProps = (state: RootState) => ({
    roadClosure: state.roadClosure,
});

export default connect<{}, {}, IRoadClosureListProps>(
    mapStateToProps,
    {
        createRoadClosure: ACTIONS.ROAD_CLOSURE_CREATED,
        selectRoadClosure: ACTIONS.ROAD_CLOSURE_SELECTED
    },
)(RoadClosureList) as React.ComponentClass<{}>;