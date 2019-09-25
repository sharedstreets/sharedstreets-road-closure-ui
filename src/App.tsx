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

import {
  FocusStyleManager,
  Intent,
  Position,
  Toaster,
} from "@blueprintjs/core";
import {
  CONTEXT_ACTIONS,
  IContextMessage,
} from './store/context';
import {
  loadRoadClosure,
  ROAD_CLOSURE_ACTIONS,
} from './store/road-closure';
FocusStyleManager.onlyShowFocusOnTabs();

export interface IAppProps {
  isShowingRoadClosureOutputViewer: boolean,
  explore: boolean,
  location: any,
  match: any,
  message: IContextMessage,
  hideMessage: (d: boolean) => void,
  loadRoadClosure: (url: string) => void,
  resetRoadClosure: () => void,
  setOrgName: (name: string) => void,
  setReadOnly: () => void,
};

const AppToaster = Toaster.create({
  className: "SHST-Top-Toaster",
  position: Position.TOP,
});

class App extends React.Component<IAppProps, any> {
  public componentDidMount() {
    if (this.props.match.params.org) {
      this.props.setOrgName(this.props.match.params.org);
    }
    if (this.props.location.search) {
      const queryParams = qs.parse(this.props.location.search, {
        ignoreQueryPrefix: true
      });
      if (queryParams.readOnly && queryParams.readOnly === "true") {
        this.props.setReadOnly();
      }
      if (queryParams.url) {
        this.props.loadRoadClosure(queryParams.url);
      } else {
        this.props.resetRoadClosure();
      }
    } else {
      this.props.resetRoadClosure();
    }
  }

  public componentDidUpdate(prevProps: IAppProps) {
    if (prevProps.message.text !== this.props.message.text
      && prevProps.message.intent !== this.props.message.intent
      && this.props.message.text !== ""
      ) {
        AppToaster.show({
          intent: this.props.message.intent as Intent,
          message: this.props.message.text,
          onDismiss: this.props.hideMessage
        });
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
          <RoadClosureMap
            isDrawingEnabled={true}
          />
        </div>
      </div>
    );
  }
}

export default connect<{}, {}, IAppProps>(
  (state: RootState) => ({
    isShowingRoadClosureOutputViewer: state.roadClosure.isShowingRoadClosureOutputViewer,
    message: state.context.message
  }), 
  {
    hideMessage: CONTEXT_ACTIONS.HIDE_MESSAGE,
    loadRoadClosure,
    resetRoadClosure: ROAD_CLOSURE_ACTIONS.RESET_ROAD_CLOSURE,
    setOrgName: CONTEXT_ACTIONS.SET_ORG_NAME,
    setReadOnly: CONTEXT_ACTIONS.SET_READ_ONLY,
  }
)(App) as React.ComponentClass<{}>;