import { connect } from 'react-redux';
import { RootState } from 'src/store/configureStore';
import RoadClosureMap, { IRoadClosureMapProps } from '../../components/road-closure-map';
import {
    // ACTIONS,
    findMatchedStreet
} from '../../store/road-closure';

const mapStateToProps = (state: RootState) => ({
    roadClosure: state.roadClosure
});

export default connect<{}, {}, IRoadClosureMapProps>(
    mapStateToProps,
    {
        findMatchedStreet,
        // lineCreated: ACTIONS.LINE_CREATED,
        // lineDeleted: ACTIONS.LINE_DELETED,
        // lineEdited: ACTIONS.LINE_EDITED,
        // pointRemoved: ACTIONS.POINT_REMOVED,
        // pointSelected: ACTIONS.POINT_SELECTED,
    },
)(RoadClosureMap) as React.ComponentClass<{}>;