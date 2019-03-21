import { connect } from 'react-redux';
import RoadClosureSavedDataViewer, { IRoadClosureSavedDataViewerProps } from 'src/components/road-closure-saved-data-viewer';
import { RootState } from 'src/store/configureStore';
import { loadAllRoadClosures } from '../../store/road-closure';

const mapStateToProps = (state: RootState) => ({
    allRoadClosureItems: state.roadClosure.allRoadClosureItems,
    allRoadClosureMetadata: state.roadClosure.allRoadClosureMetadata,
    allRoadClosuresUploadUrls: state.roadClosure.allRoadClosuresUploadUrls,
    isLoadingAllRoadClosures: state.roadClosure.isLoadingAllRoadClosures,
    orgName: state.roadClosure.orgName,
});

export default connect<{}, {}, IRoadClosureSavedDataViewerProps>(
    mapStateToProps,
    {
        loadAllRoadClosures,
    },
)(RoadClosureSavedDataViewer) as React.ComponentClass<{}>;