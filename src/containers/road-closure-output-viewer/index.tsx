import { connect } from 'react-redux';
import RoadClosureOutputViewer, { IRoadClosureOutputViewerProps } from 'src/components/road-closure-output-viewer';
import { RootState } from 'src/store/configureStore';
import { ACTIONS } from '../../store/road-closure';

const mapStateToProps = (state: RootState) => ({
    output: state.roadClosure.output,
});

export default connect<{}, {}, IRoadClosureOutputViewerProps>(
    mapStateToProps,
    {
        hideRoadClosureOutput: ACTIONS.ROAD_CLOSURE_HIDE_OUTPUT,
        viewRoadClosureOutput: ACTIONS.ROAD_CLOSURE_VIEW_OUTPUT
    },
)(RoadClosureOutputViewer) as React.ComponentClass<{}>;