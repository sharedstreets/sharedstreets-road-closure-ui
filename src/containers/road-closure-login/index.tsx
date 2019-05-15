import { connect } from 'react-redux';
import RoadClosureLogin, { IRoadClosureLoginProps } from 'src/components/road-closure-login';
import { RootState } from 'src/store/configureStore';
import { login } from '../../store/context';

export interface IRoadClosureLoginContainerProps {
    redirectOnLogin: boolean,
}

const mapStateToProps = (state: RootState, ownProps: IRoadClosureLoginContainerProps) => ({
    // allOrgs: state.roadClosure.allOrgs,
    orgName: state.context.orgName,
    redirectOnLogin: ownProps.redirectOnLogin,
});

export default connect<IRoadClosureLoginContainerProps, {}, IRoadClosureLoginProps>(
    mapStateToProps,
    {
        login,
    },
)(RoadClosureLogin) as React.ComponentClass<IRoadClosureLoginContainerProps>;