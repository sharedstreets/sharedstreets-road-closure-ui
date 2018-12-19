import * as React from 'react';
import './sharedstreets-header.css';

class SharedStreetsHeader extends React.Component {
  public render() {
    return (
        <div className="SHST-Header">
            <img src="/ss_logo.png" className="SHST-Header-Logo"/>
            <span className={"SHST-Header-Title"}>SharedStreets</span>
            <span className={"SHST-Header-Subtitle"}>Road Closures</span>
        </div>
    );
  }
}

export default SharedStreetsHeader;
