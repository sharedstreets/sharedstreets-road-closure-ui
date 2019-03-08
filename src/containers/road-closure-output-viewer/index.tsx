import { connect } from 'react-redux';
import RoadClosureOutputViewer, { IRoadClosureOutputViewerProps } from 'src/components/road-closure-output-viewer';
import { currentRoadClosureItemOutput } from 'src/selectors/road-closure';
import {
    getDataURIFromOutputItem,
    getFileNameFromOutputItem,
    getFormattedJSONStringFromOutputItem,
    isOutputItemEmpty,
} from 'src/selectors/road-closure-output-item';
import { RootState } from 'src/store/configureStore';
import { ACTIONS, saveRoadClosure } from '../../store/road-closure';

const mapStateToProps = (state: RootState) => ({
    downloadDataURI: getDataURIFromOutputItem(state.roadClosure),
    downloadFileName: getFileNameFromOutputItem(state.roadClosure),
    isOutputItemEmpty: isOutputItemEmpty(state.roadClosure),
    outputFormat: state.roadClosure.output.outputFormat,
    outputItem: currentRoadClosureItemOutput(state.roadClosure),
    outputItemFormattedJSONString: getFormattedJSONStringFromOutputItem(state.roadClosure),
});

export default connect<{}, {}, IRoadClosureOutputViewerProps>(
    mapStateToProps,
    {
        hideRoadClosureOutput: ACTIONS.ROAD_CLOSURE_HIDE_OUTPUT,
        saveRoadClosure,
        selectOutputFormat: ACTIONS.SELECT_OUTPUT_FORMAT,
        viewRoadClosureOutput: ACTIONS.ROAD_CLOSURE_VIEW_OUTPUT,
    },
)(RoadClosureOutputViewer) as React.ComponentClass<{}>;