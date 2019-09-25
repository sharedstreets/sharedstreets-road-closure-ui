import * as React from 'react';
import {
	BrowserRouter,
	Redirect,
	Route,
	Switch,
} from 'react-router-dom';

// import { app } from '../package.json';
import App from './App';
import {
	AppOrgName
} from './config';
import RoadClosureExplorer from './screens/road-closure-explorer';
// import RoadClosureSelector from './screens/road-closure-selector';

export const handleRedirectExplore = (props: any) => {
	if (props.match.params.org) {
		return <Redirect to={`/${props.match.params.org}/explore`} />
	} else if (AppOrgName) {
		return <Redirect to={`/${AppOrgName}/explore`} />
	}
	else {
		return <div>
			Enter an organziation name as the value for the key <pre>org_name</pre> in the file: <pre>src/app.config.json</pre>
		</div>
	}
}

export const handleRedirectPANYNJ = (props: any) => {
	return <Redirect to={`/PANYNJ`} />
}

export default () => (
	<BrowserRouter>
		<Switch>
			<Route exact={true} path='/' component={handleRedirectPANYNJ} />
			<Route exact={true} path='/:org/' render={handleRedirectExplore} />
			<Route path='/:org/explore' component={RoadClosureExplorer} />
			<Route path='/:org/edit' component={App} />
		</Switch>
	</BrowserRouter>
);
