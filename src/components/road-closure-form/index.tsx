import {
  Button,
  ButtonGroup,
  Card,
  FormGroup,
  InputGroup,
  Spinner,
} from '@blueprintjs/core';
import {
  DateRange,
  DateRangeInput,
} from '@blueprintjs/datetime';
import {
  isEmpty,
} from 'lodash';
import * as moment from 'moment';
import * as React from 'react';
import { RoadClosureStateItem } from 'src/models/RoadClosureStateItem';
import { IRoadClosureState } from 'src/store/road-closure';
import RoadClosureBottomActionBar from '../road-closure-bottom-action-bar';
import RoadClosureFormStreetsGroups from '../road-closure-form-streets-groups';

import '../../../node_modules/@blueprintjs/core/lib/css/blueprint.css';
import '../../../node_modules/@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import '../../../node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css';
import '../../../node_modules/normalize.css/normalize.css'
import './road-closure-form.css';


export interface IRoadClosureFormProps {
  addNewSelection: () => void,
  deleteStreetSegment: (payload: any) => void,
  deselectRoadClosure: () => void,
  nextSelection: () => void,
  previousSelection: () => void,
  inputChanged: (payload: any) => void,
  roadClosure: IRoadClosureState,
  currentRoadClosureItem: RoadClosureStateItem,
  streetnameToReferenceId: any,
  toggleStreetSegmentDirection: () => void,
  viewRoadClosureOutput: () => void,
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
    this.handleStreetMouseover = this.handleStreetMouseover.bind(this);
    this.renderDateButtonText = this.renderDateButtonText.bind(this);
    this.handleDeleteStreetSegment = this.handleDeleteStreetSegment.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.parseDate = this.parseDate.bind(this);
  }

  public handleDeleteStreetSegment(e: any) {
    this.props.deleteStreetSegment(e.target.parentElement.parentElement.id);
    return;
  }

  public handleChangeStreetName(e: any): any {
    this.props.inputChanged({
      key: 'street',
      referenceId: e.target.id,
      street: e.target.value,
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

  public formatDate(date: Date, locale?: string) {
    return moment(date).format("dddd, MMMM Do YYYY, h:mm:ss a");
  }

  public parseDate(str: string, locale?: string) {
    return moment(str, [
      "dddd, MMMM Do YYYY, h:mm:ss a",
      "YYYY-MM-DD",
      "DD/MM/YYYY",
      "YYYY-MM-DD HH:mm:ss",
      "DD/MM/YYYY HH:mm:ss",
      "YYYY-MM-DD HH:mm:ss a",
      "DD/MM/YYYY HH:mm:ss a",
      moment.ISO_8601,
      moment.HTML5_FMT.DATE,
      moment.HTML5_FMT.DATETIME_LOCAL,
      moment.HTML5_FMT.DATETIME_LOCAL_SECONDS,
    ]).toDate();
  }

  public handleChangeTime(e: DateRange) {
    this.props.inputChanged({
      key: 'startTime',
      startTime: e[0],
    });
    this.props.inputChanged({
      endTime: e[1],
      key: 'endTime',
    })
  }

  public handleStreetMouseover(e: any) {
    return;
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
    return <Card className="SHST-Streets-Card">
      <div className="SHST-Matched-Streets-Table-Empty bp3-non-ideal-state">
        <div className="bp3-non-ideal-state-visual">
          { this.props.roadClosure.isFetchingMatchedStreets ?
            <Spinner />
            : <span className="bp3-icon bp3-icon-arrow-right" />
          }
        </div>
        <h4 className="bp3-heading">
          { this.props.roadClosure.isFetchingMatchedStreets ?
            "Searching for SharedStreets matched streets"
            : "No streets selected"
          }
        </h4>
        { this.props.roadClosure.isFetchingMatchedStreets ?
          null
          : <div>To start entering a road closure, click two (or more) points along the length of the affected street(s).</div>}
      </div>
    </Card>;
  }

  public render() {
    const currentMatchedStreets = this.props.currentRoadClosureItem.matchedStreets;
    const currentDateRange: DateRange = [
      this.props.roadClosure.currentItem.form.startTime ? 
        moment(this.props.roadClosure.currentItem.form.startTime).toDate()
        : undefined,
      this.props.roadClosure.currentItem.form.endTime ? 
        moment(this.props.roadClosure.currentItem.form.endTime).toDate()
        : undefined,
    ];

    return (
        <div
          className="SHST-Road-Closure-Form"
        >
            {
              isEmpty(this.props.currentRoadClosureItem.form.street) ?
              this.renderEmptyMatchedStreetsTable() :
              <RoadClosureFormStreetsGroups
                currentMatchedStreetsFeatures={currentMatchedStreets.features}
                currentMatchedStreetsGroups={currentMatchedStreets.contiguousFeatureGroups}
                currentMatchedStreetsGroupsGeometryIdPathMap={currentMatchedStreets.geometryIdPathMap}
                currentMatchedStreetsGroupsDirections={currentMatchedStreets.contiguousFeatureGroupsDirections}
                geometryIdDirectionFilter={this.props.currentRoadClosureItem.geometryIdDirectionFilter}
                deleteStreetSegment={this.props.deleteStreetSegment}
                inputChanged={this.props.inputChanged}
                toggleStreetSegmentDirection={this.props.toggleStreetSegmentDirection}
                streets={this.props.currentRoadClosureItem.form.street}
                isFetchingMatchedStreets={this.props.roadClosure.isFetchingMatchedStreets}
              />
            }
            <FormGroup
              label="Start and end time"
              labelInfo="(required)"  
            >
              <DateRangeInput
                value={currentDateRange}
                className={"SHST-Road-Closure-Form-Date-Range-Input-Group"}
                allowSingleDayRange={true}
                shortcuts={false}
                formatDate={this.formatDate}
                parseDate={this.parseDate}
                onChange={this.handleChangeTime}
                timePrecision={"second"}
                contiguousCalendarMonths={false}
                selectAllOnFocus={true}
                startInputProps={{
                  className: "SHST-Road-Closure-Form-Date-Range-Input"
                }}
                endInputProps={{
                  className: "SHST-Road-Closure-Form-Date-Range-Input"
                }}
              />
            </FormGroup>
            <FormGroup
              label="Description"
              labelFor="text-area"
              labelInfo="(required)"
            >
              <InputGroup
                  placeholder={"Enter a description of the closure here..."}
                  onChange={this.handleChangeDescription}
                  value={this.props.currentRoadClosureItem.form.description}
              />
            </FormGroup>
            <FormGroup
              label="Reference"
              labelFor="text-area"
              labelInfo="(required)"
            >
              <InputGroup
                  placeholder={"Enter the name of your organization here..."}
                  onChange={this.handleChangeReference}
                  value={this.props.currentRoadClosureItem.form.reference}
              />
            </FormGroup>
            <FormGroup
              label="Sub Type"
              labelInfo={"(optional)"}>
              <div className="bp3-select">
                <select
                  value={this.props.currentRoadClosureItem.form.subtype}
                  onChange={this.handleChangeSubtype}>
                  <option defaultChecked={true} value={''}>Choose a subtype...</option>
                  <option value="ROAD_CLOSED_HAZARD">Hazard</option>
                  <option value="ROAD_CLOSED_CONSTRUCTION">Construction</option>
                  <option value="ROAD_CLOSED_EVENT">Event</option>
                </select>
              </div>
            </FormGroup>
            <RoadClosureBottomActionBar>
                <ButtonGroup
                  fill={true}
                >
                  <Button
                    large={true}
                    text={"View Output"}
                    intent={"success"}
                    onClick={this.props.viewRoadClosureOutput}
                  />
                </ButtonGroup>
              </RoadClosureBottomActionBar>
        </div>
    );
  }
}

export default RoadClosureForm;
