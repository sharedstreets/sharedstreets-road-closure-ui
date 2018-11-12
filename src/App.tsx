import * as React from 'react';
import './App.css';
import RoadClosureForm from './components/road-closure-form';
import SharedStreetsHeader from './components/sharedstreets-header';
import RoadClosureMap from './containers/road-closure-map';

class App extends React.Component {
  public render() {
    return (
      <div className="SHST-Container">
        <SharedStreetsHeader />
        <RoadClosureMap />
        <RoadClosureForm />
      </div>
    );
  }
}

export default App;
