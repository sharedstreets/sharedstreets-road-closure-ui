import { connect } from 'react-redux';
import { currentRoadClosureItemSelector } from 'src/selectors/road-closure';
import { RootState } from 'src/store/configureStore';
import RoadClosureForm, { IRoadClosureFormProps } from '../../components/road-closure-form';
import { ACTIONS } from '../../store/road-closure';

const mapStateToProps = (state: RootState) => ({
    currentRoadClosureItem: currentRoadClosureItemSelector({
        roadClosure: state.roadClosure
    }),
    roadClosure: state.roadClosure,
});

export default connect<{}, {}, IRoadClosureFormProps>(
    mapStateToProps,
    {
        inputChanged: ACTIONS.INPUT_CHANGED,
    },
)(RoadClosureForm) as React.ComponentClass<{}>;