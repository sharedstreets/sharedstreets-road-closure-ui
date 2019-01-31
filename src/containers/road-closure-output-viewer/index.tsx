import { connect } from 'react-redux';
import RoadClosureOutputViewer, { IRoadClosureOutputViewerProps } from 'src/components/road-closure-output-viewer';
import { currentRoadClosureItemOutput } from 'src/selectors/road-closure';
import { RootState } from 'src/store/configureStore';
import { ACTIONS } from '../../store/road-closure';

const mapStateToProps = (state: RootState) => ({
    incidents: currentRoadClosureItemOutput(state.roadClosure),
    outputFormat: state.roadClosure.output.outputFormat,
});

export default connect<{}, {}, IRoadClosureOutputViewerProps>(
    mapStateToProps,
    {
        hideRoadClosureOutput: ACTIONS.ROAD_CLOSURE_HIDE_OUTPUT,
        selectOutputFormat: ACTIONS.SELECT_OUTPUT_FORMAT,
        viewRoadClosureOutput: ACTIONS.ROAD_CLOSURE_VIEW_OUTPUT
    },
)(RoadClosureOutputViewer) as React.ComponentClass<{}>;