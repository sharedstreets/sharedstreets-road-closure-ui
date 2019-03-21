import * as qs from 'qs';
import * as React from 'react';
import { connect } from 'react-redux';
import './App.css';
import SharedStreetsHeader from './components/sharedstreets-header';
import RoadClosureForm from './containers/road-closure-form';
import RoadClosureHeaderMenu from './containers/road-closure-header-menu';
import RoadClosureMap from './containers/road-closure-map';
import RoadClosureOutputViewer from './containers/road-closure-output-viewer';
import { RootState } from './store/configureStore';

import { FocusStyleManager } from "@blueprintjs/core";
import { ACTIONS, loadRoadClosure } from './store/road-closure';
FocusStyleManager.onlyShowFocusOnTabs();

export interface IAppProps {
  isShowingRoadClosureOutputViewer: boolean,
  explore: boolean,
  location: any,
  match: any,
  loadRoadClosure: (url: string) => void,
  resetRoadClosure: () => void,
  setOrgName: (name: string) => void
};

class App extends React.Component<IAppProps, any> {
  public componentDidMount() {
    if (this.props.match.params.org) {
      this.props.setOrgName(this.props.match.params.org);
    }
    if (this.props.location.search) {
      const queryParams = qs.parse(this.props.location.search, {
        ignoreQueryPrefix: true
      });
      if (queryParams.url) {
        this.props.loadRoadClosure(queryParams.url);
      } else {
        this.props.resetRoadClosure();
      }
    } else {
      this.props.resetRoadClosure();
    }
  }

  public render() {
    return (
      <div className="SHST-App">
        <SharedStreetsHeader>
          <RoadClosureHeaderMenu edit={true} />
        </SharedStreetsHeader>
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
  }), 
  {
    loadRoadClosure,
    resetRoadClosure: ACTIONS.RESET_ROAD_CLOSURE,
    setOrgName: ACTIONS.SET_ORG_NAME,
  }
)(App) as React.ComponentClass<{}>;