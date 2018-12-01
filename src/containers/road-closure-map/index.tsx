import { connect } from 'react-redux';
import { RootState } from 'src/store/configureStore';
import RoadClosureMap, { IRoadClosureMapProps } from '../../components/road-closure-map';
import { ACTIONS, findMatchedStreet } from '../../store/road-closure';

const mapStateToProps = (state: RootState) => ({
    roadClosure: state.roadClosure
});

export default connect<{}, {}, IRoadClosureMapProps>(
    mapStateToProps,
    {
        addNewStreet: ACTIONS.ADD_NEW_STREET,
        findMatchedStreet,
        pointSelected: ACTIONS.POINT_SELECTED,
    },
)(RoadClosureMap) as React.ComponentClass<{}>;