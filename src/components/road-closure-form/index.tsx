import * as React from 'react';
import '../../../node_modules/@blueprintjs/core/lib/css/blueprint.css';
import '../../../node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css';
import '../../../node_modules/normalize.css/normalize.css'
import './road-closure-form.css';

class RoadClosureForm extends React.Component {
  public render() {
    return (
        <div className="SHST-Road-Closure-Form">
            <button>Add street</button>
            <button>Confirm road closure</button>
            <div className="SHST-Matched-Streets" />
        </div>
    );
  }
}

export default RoadClosureForm;
