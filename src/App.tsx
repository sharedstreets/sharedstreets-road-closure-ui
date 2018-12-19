import * as React from 'react';
import { connect } from 'react-redux';
import './App.css';
import SharedStreetsHeader from './components/sharedstreets-header';
import RoadClosureForm from './containers/road-closure-form';
import RoadClosureList from './containers/road-closure-list';
import RoadClosureMap from './containers/road-closure-map';
import RoadClosureOutputViewer from './containers/road-closure-output-viewer';
import { RootState } from './store/configureStore';

export interface IAppProps {
  isShowingRoadClosureList: boolean,
  isShowingRoadClosureOutputViewer: boolean,
};

class App extends React.Component<IAppProps, any> {
  public render() {
    return (
      <div className="SHST-App">
        <SharedStreetsHeader />
        <div className="SHST-Container">
          {
            this.props.isShowingRoadClosureOutputViewer &&
            this.props.isShowingRoadClosureList && <RoadClosureOutputViewer />
          }
          {
            this.props.isShowingRoadClosureList && 
            !this.props.isShowingRoadClosureOutputViewer && <RoadClosureList />
          }
          {
            !this.props.isShowingRoadClosureList && 
            !this.props.isShowingRoadClosureOutputViewer && <RoadClosureForm />
          }
          <RoadClosureMap />
        </div>
      </div>
    );
  }
}

export default connect<{}, {}, IAppProps>(
  (state: RootState) => ({
    isShowingRoadClosureList: state.roadClosure.isShowingRoadClosureList,
    isShowingRoadClosureOutputViewer: state.roadClosure.isShowingRoadClosureOutputViewer,
  })
)(App) as React.ComponentClass<{}>;