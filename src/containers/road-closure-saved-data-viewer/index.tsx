import { connect } from 'react-redux';
import RoadClosureSavedDataViewer, { IRoadClosureSavedDataViewerProps } from 'src/components/road-closure-saved-data-viewer';
import {
    filterRoadClosureSavedItems,
    sortRoadClosureSavedItemsByLastModified
} from 'src/selectors/road-closure-saved-items';
import { RootState } from 'src/store/configureStore';
import { 
    loadAllRoadClosures,
    ROAD_CLOSURE_ACTIONS
} from '../../store/road-closure';

const mapStateToProps = (state: RootState) => ({
    ...filterRoadClosureSavedItems(
        sortRoadClosureSavedItemsByLastModified(state.roadClosure, state.roadClosure.allRoadClosuresSortOrder),
        state.roadClosure.allRoadClosuresFilterLevel
    ),
    isLoadingAllRoadClosures: state.roadClosure.isLoadingAllRoadClosures,
    orgName: state.context.orgName,
});

export default connect<{}, {}, IRoadClosureSavedDataViewerProps>(
    mapStateToProps,
    {
        highlightFeaturesGroup: ROAD_CLOSURE_ACTIONS.HIGHLIGHT_MATCHED_STREETS_GROUP,
        loadAllRoadClosures,
        previewClosure: ROAD_CLOSURE_ACTIONS.FETCH_SHAREDSTREETS_PUBLIC_DATA.success,
        resetClosurePreview: ROAD_CLOSURE_ACTIONS.RESET_ROAD_CLOSURE,
        setFilterLevel: ROAD_CLOSURE_ACTIONS.SET_ALL_ROAD_CLOSURES_FILTER_LEVEL,
        setSortOrder: ROAD_CLOSURE_ACTIONS.SET_ALL_ROAD_CLOSURES_SORT_ORDER,
    },
)(RoadClosureSavedDataViewer) as React.ComponentClass<{}>;