import * as React from 'react';
// import { Link } from 'react-router-dom';
import './sharedstreets-header.css';

export interface ISharedStreetsHeaderProps {
  rightChildComponent?: React.ComponentClass
}
class SharedStreetsHeader extends React.Component<ISharedStreetsHeaderProps, any> {
  public render() {
    return (
        <div className="SHST-Header">
            <span className="SHST-Header-Left-Content">
              <img src="/SharedStreets_symbol.svg" className="SHST-Header-Logo"/>
              <span className={"SHST-Header-Title"}>SharedStreets</span>
              <span className={"SHST-Header-Subtitle"}>
                {/* <Link to="/"> */}
                  Road Closures
                {/* </Link> */}
              </span>
            </span>
            <span className="SHST-Header-Right-Content">
              {this.props.children}
            </span>
        </div>
    );
  }
}

export default SharedStreetsHeader;
