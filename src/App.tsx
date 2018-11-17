import * as React from 'react';
import './App.css';
import SharedStreetsHeader from './components/sharedstreets-header';
import RoadClosureForm from './containers/road-closure-form';
import RoadClosureMap from './containers/road-closure-map';

class App extends React.Component {
  public render() {
    return (
      <div className="SHST-App">
        <SharedStreetsHeader />
        <div className="SHST-Container">
          <RoadClosureMap />
          <RoadClosureForm />
        </div>
      </div>
    );
  }
}

export default App;
