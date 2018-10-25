import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import App from './App';
import Map from './components/map';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Map />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
