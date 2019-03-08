import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import "reflect-metadata";
import createStore from './create-store';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import Router from './routes';

const store = createStore();

ReactDOM.render(
  <Provider store={store}>
    <Router />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
