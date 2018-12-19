import * as React from 'react';
import './road-closure-bottom-action-bar.css';

class RoadClosureBottomActionBar extends React.Component {
  public render() {
    return (
        <div className="SHST-Road-Closure-Bottom-Action-Bar">
            {this.props.children}
        </div>
    );
  }
}

export default RoadClosureBottomActionBar;
