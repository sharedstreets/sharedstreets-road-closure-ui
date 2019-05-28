import * as React from 'react';
import {
	BrowserRouter,
	Redirect,
	Route,
	Switch,
} from 'react-router-dom';

// import { app } from '../package.json';
import App from './App';
import RoadClosureExplorer from './screens/road-closure-explorer';
import RoadClosureSelector from './screens/road-closure-selector';

export const handleRedirectExplore = (props: any) => {
	if (props.match.params.org) {
		return <Redirect to={`/${props.match.params.org}/explore`} />
	} else {
		return <RoadClosureSelector />
	}
}

export default () => (
	<BrowserRouter>
		<Switch>
			{
				process.env.REACT_APP_EDIT_ONLY ?
				<Route exact={false} path='/' component={App} />
				: <React.Fragment>
					<Route exact={true} path='/' component={RoadClosureSelector} />
					<Route exact={true} path='/:org/' render={handleRedirectExplore} />
					<Route path='/:org/explore' component={RoadClosureExplorer} />
					<Route path='/:org/edit' component={App} />
				</React.Fragment>
			}
		</Switch>
	</BrowserRouter>
);
