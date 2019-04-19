import { connect } from 'react-redux';
import RoadClosureLoadFromURL, { IRoadClosureLoadFromURLProps } from 'src/components/road-closure-load-from-url';
import { RootState } from 'src/store/configureStore';
import {
    ACTIONS,
    loadRoadClosure
} from '../../store/road-closure';

const mapStateToProps = (state: RootState) => ({
    geojsonUploadUrl: state.roadClosure.uploadUrls.geojsonUploadUrl,
    isFetchingInput: state.roadClosure.isFetchingInput,
    isGeneratingUploadUrl: state.roadClosure.isGeneratingUploadUrl,
});

export default connect<{}, {}, IRoadClosureLoadFromURLProps>(
    mapStateToProps,
    {
        clearRoadClosure: ACTIONS.RESET_ROAD_CLOSURE,
        loadRoadClosure,
    },
)(RoadClosureLoadFromURL) as React.ComponentClass<{}>;