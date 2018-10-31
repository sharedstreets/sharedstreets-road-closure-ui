import * as React from 'react';
import {
	BrowserRouter,
	Route,
	Switch,
} from 'react-router-dom';

// import { app } from '../package.json';

import App from './App';

export default () => (
	<BrowserRouter basename={'/road-closures'}>
		<Switch>
			<Route path='/' component={App} />
		</Switch>
	</BrowserRouter>
);
