import { connect } from 'react-redux';
import RoadClosureOrgSelector, { IRoadClosureOrgSelectorProps } from 'src/components/road-closure-org-selector';
import { RootState } from 'src/store/configureStore';
import { loadAllOrgs } from '../../store/road-closure';

const mapStateToProps = (state: RootState) => ({
    allOrgs: state.roadClosure.allOrgs,
    orgName: state.roadClosure.orgName,
});

export default connect<{}, {}, IRoadClosureOrgSelectorProps>(
    mapStateToProps,
    {
        loadAllOrgs,
    },
)(RoadClosureOrgSelector) as React.ComponentClass<{}>;