import { connect } from 'react-redux';
import { getRoadBlockIconPoints } from 'src/selectors/road-closure-map';
import { RootState } from 'src/store/configureStore';
import RoadClosureMap, { IRoadClosureMapProps } from '../../components/road-closure-map';
import {
    ACTIONS,
    findMatchedPoint,
    findMatchedStreet,
} from '../../store/road-closure';

const mapStateToProps = (state: RootState) => ({
    roadBlockIconPoints: getRoadBlockIconPoints(state.roadClosure),
    roadClosure: state.roadClosure,
});

export default connect<{}, {}, IRoadClosureMapProps>(
    mapStateToProps,
    {
        findMatchedPoint,
        findMatchedStreet,
        inputChanged: ACTIONS.INPUT_CHANGED,
    },
)(RoadClosureMap) as React.ComponentClass<{}>;