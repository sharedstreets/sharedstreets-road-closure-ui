import { connect } from 'react-redux';
import RoadClosureLoadFromURL, { IRoadClosureLoadFromURLProps } from 'src/components/road-closure-load-from-url';
import { RootState } from 'src/store/configureStore';
import {
    ACTIONS,
    loadRoadClosure
} from '../../store/road-closure';

const mapStateToProps = (state: RootState) => ({
    isFetchingInput: state.roadClosure.isFetchingInput,
    isGeneratingUploadUrl: state.roadClosure.isGeneratingUploadUrl,
    stateUploadUrl: state.roadClosure.uploadUrls.stateUploadUrl
});

export default connect<{}, {}, IRoadClosureLoadFromURLProps>(
    mapStateToProps,
    {
        clearRoadClosure: ACTIONS.CLEAR_LOADED_ROAD_CLOSURE,
        loadRoadClosure,
    },
)(RoadClosureLoadFromURL) as React.ComponentClass<{}>;