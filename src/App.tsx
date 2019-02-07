import * as React from 'react';
import { connect } from 'react-redux';
import './App.css';
import SharedStreetsHeader from './components/sharedstreets-header';
import RoadClosureForm from './containers/road-closure-form';
import RoadClosureMap from './containers/road-closure-map';
import RoadClosureOutputViewer from './containers/road-closure-output-viewer';
import { RootState } from './store/configureStore';

import { FocusStyleManager } from "@blueprintjs/core";
FocusStyleManager.onlyShowFocusOnTabs();

export interface IAppProps {
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
            <RoadClosureOutputViewer />
          }
          {
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
    isShowingRoadClosureOutputViewer: state.roadClosure.isShowingRoadClosureOutputViewer,
  })
)(App) as React.ComponentClass<{}>;