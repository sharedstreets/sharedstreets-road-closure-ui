import * as React from 'react';
import { connect } from 'react-redux';
import './App.css';
import SharedStreetsHeader from './components/sharedstreets-header';
import RoadClosureForm from './containers/road-closure-form';
import RoadClosureList from './containers/road-closure-list';
import RoadClosureMap from './containers/road-closure-map';
import { RootState } from './store/configureStore';

export interface IAppProps {
  isShowingRoadClosureList: boolean
};

class App extends React.Component<IAppProps, any> {
  public render() {
    return (
      <div className="SHST-App">
        <SharedStreetsHeader />
        <div className="SHST-Container">
          <RoadClosureForm />
          <RoadClosureList />
          <RoadClosureMap />
        </div>
      </div>
    );
  }
}

export default connect<{}, {}, IAppProps>(
  (state: RootState) => ({
    isShowingRoadClosureList: state.roadClosure.isShowingRoadClosureList
  })
)(App) as React.ComponentClass<{}>;