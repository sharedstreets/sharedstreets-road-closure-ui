import * as React from 'react';
import { connect } from 'react-redux';
import SharedStreetsHeader from '../../components/sharedstreets-header';
// import RoadClosureMap from '../../containers/road-closure-map';
import { RootState } from '../../store/configureStore';
import './road-closure-explorer.css';

import {
  FocusStyleManager,
  Intent,
  Position,
  Toaster,
} from "@blueprintjs/core";
import RoadClosureHeaderMenu from 'src/containers/road-closure-header-menu';
import RoadClosureMap from 'src/containers/road-closure-map';
import RoadClosureSavedDataViewer from 'src/containers/road-closure-saved-data-viewer';
import {
  CONTEXT_ACTIONS, IContextMessage
} from '../../store/context';
import {
  loadAllRoadClosures,
} from '../../store/road-closure-explorer';

FocusStyleManager.onlyShowFocusOnTabs();

export interface IRoadClosureExplorerProps {
  isShowingRoadClosureOutputViewer: boolean,
  explore: boolean,
  match: any,
  message: IContextMessage,
  hideMessage: (d: boolean) => void,
  setOrgName: (payload: string) => void
  loadAllRoadClosures: () => void
};
const ExploreToaster = Toaster.create({
  className: "SHST-Top-Toaster",
  position: Position.TOP,
});

class RoadClosureExplorer extends React.Component<IRoadClosureExplorerProps, any> {
  public componentDidMount() {
    if (this.props.match.params.org) {
      Promise.resolve(this.props.setOrgName(this.props.match.params.org))
      .then(() => this.props.loadAllRoadClosures())
    }
  }

  public componentDidUpdate(prevProps: IRoadClosureExplorerProps) {
    if (prevProps.message.text !== this.props.message.text
      && prevProps.message.intent !== this.props.message.intent
      && this.props.message.text !== ""
      ) {
        ExploreToaster.show({
          intent: this.props.message.intent as Intent,
          message: this.props.message.text,
          onDismiss: this.props.hideMessage
        });
    }
  }

  public render() {
    return (
      <div className="SHST-Road-Closure-Explorer">
        <SharedStreetsHeader>
          <RoadClosureHeaderMenu explore={true} />
        </SharedStreetsHeader>
        <div className="SHST-Container">
          <RoadClosureSavedDataViewer />
          <RoadClosureMap isDrawingEnabled={false}/>
        </div>
      </div>
    );
  }
}

export default connect<{}, {}, IRoadClosureExplorerProps>(
  (state: RootState) => ({
    isShowingRoadClosureOutputViewer: state.roadClosure.isShowingRoadClosureOutputViewer,
    message: state.context.message,
  }), 
  {
    hideMessage: CONTEXT_ACTIONS.HIDE_MESSAGE,
    loadAllRoadClosures,
    setOrgName: CONTEXT_ACTIONS.SET_ORG_NAME,
  }
)(RoadClosureExplorer) as React.ComponentClass<{}>;