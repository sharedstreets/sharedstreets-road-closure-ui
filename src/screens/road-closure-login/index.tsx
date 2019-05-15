import {
  Classes,
  Dialog
} from '@blueprintjs/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../store/configureStore';
import './road-closure-login.css';

import {
  FocusStyleManager
} from "@blueprintjs/core";
import RoadClosureLogin from 'src/containers/road-closure-login';
FocusStyleManager.onlyShowFocusOnTabs();

export interface IRoadClosureLoginScreenProps {
  isShowingRoadClosureOutputViewer: boolean,
  explore: boolean,
};

class RoadClosureLoginScreen extends React.Component<IRoadClosureLoginScreenProps, any> {
  public render() {
    return (
      <div className="SHST-Road-Closure-Login">
        <Dialog
          title={
            <div className="SHST-Login-Header">
              <img src="/SharedStreets_symbol.svg" className="SHST-Login-Logo"/>
              <span className={"SHST-Login-Title"}>SharedStreets</span>
              <span>Road Closures</span>
            </div>
          }
          isOpen={true}
        >
          <div className={Classes.DIALOG_BODY}>
            <RoadClosureLogin redirectOnLogin={true} />
          </div>
        </Dialog>
      </div>
    );
  }
}

export default connect<{}, {}, IRoadClosureLoginScreenProps>(
  (state: RootState) => ({
    isLoggedIn: state.context.isLoggedIn,
  })
)(RoadClosureLoginScreen) as React.ComponentClass<{}>;