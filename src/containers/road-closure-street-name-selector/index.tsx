import { connect } from 'react-redux';
import RoadClosureStreetNameSelector, { IRoadClosureStreetNameSelectorProps } from 'src/components/road-closure-street-name-selector';
import { RootState } from 'src/store/configureStore';
import { findStreetname } from '../../store/road-closure';

const mapStateToProps = (state: RootState) => ({
    streetnames: state.roadClosure.streetnames,
});

export default connect<{}, {}, IRoadClosureStreetNameSelectorProps>(
    mapStateToProps,
    {
        findStreetname
    },
)(RoadClosureStreetNameSelector) as React.ComponentClass<{}>;