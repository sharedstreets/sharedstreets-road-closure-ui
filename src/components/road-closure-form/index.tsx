import {
  Button,
  ButtonGroup,
  Card,
  // Classes,
  FormGroup,
  InputGroup,
  Popover,
  Position,
  // Radio,
  // RadioGroup,
} from '@blueprintjs/core';
import {
  DateRangePicker,
  TimePrecision,
} from '@blueprintjs/datetime';
import {
  forEach,
  isEmpty,
} from 'lodash';
import * as React from 'react';
import { RoadClosureStateItem } from 'src/models/RoadClosureStateItem';
import { IRoadClosureState } from 'src/store/road-closure';

import '../../../node_modules/@blueprintjs/core/lib/css/blueprint.css';
import '../../../node_modules/@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import '../../../node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css';
import '../../../node_modules/normalize.css/normalize.css'
import './road-closure-form.css';


export interface IRoadClosureFormProps {
  addNewSelection: () => void,
  deselectRoadClosure: () => void,
  nextSelection: () => void,
  previousSelection: () => void,
  inputChanged: (payload: any) => void,
  roadClosure: IRoadClosureState,
  currentRoadClosureItem: RoadClosureStateItem,
  streetnameMatchedStreetIndexMap: any,
};
class RoadClosureForm extends React.Component<IRoadClosureFormProps, any> {
  constructor(props: IRoadClosureFormProps) {
    super(props);
    this.handleChangeStreetName = this.handleChangeStreetName.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.handleChangeReference = this.handleChangeReference.bind(this);
    this.handleChangeSubtype = this.handleChangeSubtype.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.renderDateButtonText = this.renderDateButtonText.bind(this);
  }

  public handleChangeStreetName(e: any) {
    this.props.inputChanged({
      key: 'street',
      street: e.target.value,
      streetnameIndex: Number.parseInt(e.target.id, 2)
    });
  }

  public handleChangeDescription(e: any) {
    this.props.inputChanged({
      description: e.target.value,
      key: 'description',
    });
  }

  public handleChangeReference(e: any) {
    this.props.inputChanged({
      key: 'reference',
      reference: e.target.value
    });
  }

  public handleChangeSubtype(e: any) {
    if (e.target.value === this.props.currentRoadClosureItem.form.subtype) {
      this.props.inputChanged({
        key: 'subtype',
        subtype: null
      });
    } else {      
      this.props.inputChanged({
        key: 'subtype',
        subtype: e.target.value
      });
    }
  }

  public handleChangeTime(e: [Date | undefined, Date | undefined]) {
    this.props.inputChanged({
      key: 'startTime',
      startTime: e[0],
    });
    this.props.inputChanged({
      endTime: e[1],
      key: 'endTime',
    })
  }

  public handleSave() {
    this.props.deselectRoadClosure();
  }

  public renderDateButtonText() {
    let output = "Click to pick start and end time";
    if (this.props.currentRoadClosureItem && this.props.currentRoadClosureItem.form.startTime && this.props.currentRoadClosureItem.form.endTime) {
      output = this.props.currentRoadClosureItem.form.startTime + " - " + this.props.currentRoadClosureItem.form.endTime;
    } else if (this.props.currentRoadClosureItem && this.props.currentRoadClosureItem.form.startTime) {
      output = this.props.currentRoadClosureItem.form.startTime + " - " + "?"
    } else if (this.props.currentRoadClosureItem && this.props.currentRoadClosureItem.form.endTime) {
      output = "?" + " - " + this.props.currentRoadClosureItem.form.endTime;
    }
    return output;
  }

  public renderEmptyMatchedStreetsTable() {
    return <div className="SHST-Matched-Streets-Table-Empty bp3-non-ideal-state">
      <div className="bp3-non-ideal-state-visual">
        <span className="bp3-icon bp3-icon-arrow-right" />
      </div>
      <h4 className="bp3-heading">No streets selected</h4>
      <div>To start entering a road closure, click two (or more) points along the length of the affected street(s).</div>
    </div>;
  }

  public renderMatchedStreetsTable() {
    const output: any = [];
    if ( !isEmpty(this.props.currentRoadClosureItem.form.street[this.props.roadClosure.currentSelectionIndex]) ) {
      forEach(this.props.currentRoadClosureItem.form.street[this.props.roadClosure.currentSelectionIndex], (street: any, index) => {
        output.push(<tr key={index}>
          <td>
            <InputGroup
              id={`${index}`}
              value={street}
              onChange={this.handleChangeStreetName}
            />
          </td>
          <td>
            {null}
          </td>
          <td>
            {null}
          </td>
        </tr>)
      });
    }

    return <table className={"SHST-Matched-Streets-Table bp3-html-table bp3-condensed"}>
      <thead>
        <tr>
          <th>Street name</th>
          <th>From</th>
          <th>To</th>
        </tr>
      </thead>
      <tbody>
        {output}
      </tbody>
    </table>
  }

  public render() {
    return (
        <div
          className="SHST-Road-Closure-Form"
          style={{
            display: this.props.roadClosure.isShowingRoadClosureList ? "none" : ""
          }}
        >
            <Card>
              <label className={"bp3-label"}>
                Selection
                <span className={"bp3-text-muted"}> ({this.props.roadClosure.currentSelectionIndex+1} of {this.props.currentRoadClosureItem.selectedPoints.length})</span>
              </label>
              {!isEmpty(this.props.currentRoadClosureItem.form.street[this.props.roadClosure.currentSelectionIndex]) && this.renderMatchedStreetsTable()}
              {isEmpty(this.props.currentRoadClosureItem.form.street[this.props.roadClosure.currentSelectionIndex]) && this.renderEmptyMatchedStreetsTable()}
              <ButtonGroup
                fill={true}
              >
                <Button
                  disabled={this.props.roadClosure.currentSelectionIndex === 0}
                  onClick={this.props.previousSelection}
                  text={"Previous selection"} />
                <Button
                  disabled={this.props.roadClosure.currentSelectionIndex + 1 === this.props.currentRoadClosureItem.form.street.length}
                  onClick={this.props.nextSelection}
                  text={"Next selection"} />
                <Button
                  disabled={isEmpty(this.props.currentRoadClosureItem.form.street[this.props.roadClosure.currentSelectionIndex])}
                  intent={"primary"}
                  onClick={this.props.addNewSelection}
                  text={"Add new selection"} />
              </ButtonGroup>
            </Card>
            <FormGroup
              label="Start and end time"
              labelInfo="(required)"  
            >
              <Popover
                content={              
                  <DateRangePicker
                    shortcuts={false}
                    timePrecision={TimePrecision.MINUTE}
                    onChange={this.handleChangeTime}
                  />
                }
                position={Position.BOTTOM}>
                <Button text={this.renderDateButtonText()} />
              </Popover>
            </FormGroup>
            <FormGroup
              // helperText="Helper text with details..."
              label="Description"
              labelFor="text-area"
              labelInfo="(required)"
            >
              <InputGroup
                  placeholder={"Enter a description here..."}
                  onChange={this.handleChangeDescription}
                  // value={this.state.value}
              />
            </FormGroup>
            <FormGroup
              // helperText="Helper text with details..."
              label="Reference"
              labelFor="text-area"
              labelInfo="(required)"
            >
              <InputGroup
                  placeholder={"Enter a organization reference name here..."}
                  onChange={this.handleChangeReference}
                  // value={this.state.value}
              />
            </FormGroup>
            <FormGroup
              label="Sub Type"
              labelInfo={"(optional)"}>
              <div className="bp3-select">
                <select onChange={this.handleChangeSubtype}>
                  <option defaultChecked={true} value={''}>Choose a subtype...</option>
                  <option value="ROAD_CLOSED_HAZARD">ROAD_CLOSED_HAZARD</option>
                  <option value="ROAD_CLOSED_CONSTRUCTION">ROAD_CLOSED_CONSTRUCTION</option>
                  <option value="ROAD_CLOSED_EVENT">ROAD_CLOSED_EVENT</option>
                </select>
              </div>
            </FormGroup>
            <ButtonGroup
              fill={true}
            >
              <Button
                large={true}
                text={"Cancel"}
                onClick={this.handleSave}
              />
              <Button
                intent="success"
                large={true}
                text={"Save this road closure"}
                onClick={this.handleSave}
              />
            </ButtonGroup>
        </div>
    );
  }
}

export default RoadClosureForm;
