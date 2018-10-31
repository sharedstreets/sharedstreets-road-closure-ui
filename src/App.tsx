import * as React from 'react';
import './App.css';
import Map from './components/map';
import SharedStreetsHeader from './components/sharedstreets-header';

class App extends React.Component {
  public render() {
    return (
      <div className="SHST-Container">
        <SharedStreetsHeader />
        <Map />
      </div>
    );
  }
}

export default App;
