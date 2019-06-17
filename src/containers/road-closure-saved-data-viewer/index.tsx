import { connect } from 'react-redux';
import RoadClosureSavedDataViewer, { IRoadClosureSavedDataViewerProps } from 'src/components/road-closure-saved-data-viewer';
import { RootState } from 'src/store/configureStore';
import { 
    loadAllRoadClosures,
    ROAD_CLOSURE_ACTIONS
} from '../../store/road-closure';

const mapStateToProps = (state: RootState) => ({
    allRoadClosureItems: state.roadClosure.allRoadClosureItems,
    allRoadClosureMetadata: state.roadClosure.allRoadClosureMetadata,
    allRoadClosuresUploadUrls: state.roadClosure.allRoadClosuresUploadUrls,
    isLoadingAllRoadClosures: state.roadClosure.isLoadingAllRoadClosures,
    orgName: state.context.orgName,
});

export default connect<{}, {}, IRoadClosureSavedDataViewerProps>(
    mapStateToProps,
    {
        loadAllRoadClosures,
        previewClosure: ROAD_CLOSURE_ACTIONS.FETCH_SHAREDSTREETS_PUBLIC_DATA.success,
        resetClosurePreview: ROAD_CLOSURE_ACTIONS.RESET_ROAD_CLOSURE,
    },
)(RoadClosureSavedDataViewer) as React.ComponentClass<{}>;