import { connect } from 'react-redux';
import RoadClosureLoadFromURL, { IRoadClosureLoadFromURLProps } from 'src/components/road-closure-load-from-url';
import { RootState } from 'src/store/configureStore';
import { loadRoadClosure } from '../../store/road-closure';

const mapStateToProps = (state: RootState) => ({
});

export default connect<{}, {}, IRoadClosureLoadFromURLProps>(
    mapStateToProps,
    {
        loadRoadClosure,
    },
)(RoadClosureLoadFromURL) as React.ComponentClass<{}>;