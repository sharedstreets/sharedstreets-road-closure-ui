import * as React from 'react';
import { connect } from 'react-redux';
import SharedStreetsHeader from '../../components/sharedstreets-header';
import RoadClosureLoadFromURL from '../../containers/road-closure-load-from-url';
import { RootState } from '../../store/configureStore';
import './road-closure-selector.css';

import {
  FocusStyleManager
} from "@blueprintjs/core";
import RoadClosureOrgSelector from 'src/containers/road-closure-org-selector';
FocusStyleManager.onlyShowFocusOnTabs();

export interface IRoadClosureSelectorProps {
  isShowingRoadClosureOutputViewer: boolean,
  explore: boolean,
};

class RoadClosureSelector extends React.Component<IRoadClosureSelectorProps, any> {
  public render() {
    return (
      <div className="SHST-Road-Closure-Create">
        <SharedStreetsHeader
          rightChildComponent={RoadClosureLoadFromURL}/>
        <div className="SHST-Container">
          <RoadClosureOrgSelector />
        </div>
      </div>
    );
  }
}

export default connect<{}, {}, IRoadClosureSelectorProps>(
  (state: RootState) => ({
    isShowingRoadClosureOutputViewer: state.roadClosure.isShowingRoadClosureOutputViewer,
  })
)(RoadClosureSelector) as React.ComponentClass<{}>;