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
import { ROAD_CLOSURE_ACTIONS, saveRoadClosure } from '../../store/road-closure';

const mapStateToProps = (state: RootState) => ({
    downloadDataURI: getDataURIFromOutputItem(state.roadClosure),
    downloadFileName: getFileNameFromOutputItem(state.roadClosure),
    isEditingExistingClosure: state.roadClosure.isEditingExistingClosure,
    isGeneratingUploadUrl: state.roadClosure.isGeneratingUploadUrl,
    isOutputItemEmpty: isOutputItemEmpty(state.roadClosure),
    isSavingOutput: state.roadClosure.isSavingOutput,
    outputFormat: state.roadClosure.output.outputFormat,
    outputItem: currentRoadClosureItemOutput(state.roadClosure),
    outputItemFormattedJSONString: getFormattedJSONStringFromOutputItem(state.roadClosure),
    uploadUrls: state.roadClosure.uploadUrls,
});

export default connect<{}, {}, IRoadClosureOutputViewerProps>(
    mapStateToProps,
    {
        hideRoadClosureOutput: ROAD_CLOSURE_ACTIONS.ROAD_CLOSURE_HIDE_OUTPUT,
        saveRoadClosure,
        selectOutputFormat: ROAD_CLOSURE_ACTIONS.SELECT_OUTPUT_FORMAT,
        viewRoadClosureOutput: ROAD_CLOSURE_ACTIONS.ROAD_CLOSURE_VIEW_OUTPUT,
    },
)(RoadClosureOutputViewer) as React.ComponentClass<{}>;