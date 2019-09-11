import {
  Button,
  Card,
  Checkbox,
  Collapse,
  Divider,
  FormGroup,
  H3,
  InputGroup,
  Position,
  Spinner,
  Switch,
} from '@blueprintjs/core';
import {
  DateRange,
  DateRangeInput,
} from '@blueprintjs/datetime';
import {
  TimezonePicker
} from '@blueprintjs/timezone';
import {
  isEmpty,
} from 'lodash';
import * as moment from 'moment';
import * as React from 'react';
import RoadClosureOutputViewer from 'src/containers/road-closure-output-viewer';
import { IRoadClosureMode } from 'src/models/RoadClosureFormStateItem';
import { SharedStreetsMatchGeomFeatureCollection } from 'src/models/SharedStreets/SharedStreetsMatchGeomFeatureCollection';
import { IRoadClosureState } from 'src/store/road-closure';
import RoadClosureFormScheduleEntry from '../road-closure-form-schedule-entry';
import RoadClosureFormScheduleTransposedTable from '../road-closure-form-schedule-transposed-table';
import RoadClosureFormStreetsGroups from '../road-closure-form-streets-groups';

import '../../../node_modules/@blueprintjs/core/lib/css/blueprint.css';
import '../../../node_modules/@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import '../../../node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css';
import '../../../node_modules/@blueprintjs/timezone/lib/css/blueprint-timezone.css';
import '../../../node_modules/normalize.css/normalize.css'
import '../../../node_modules/react-week-calendar/dist/style.css';
import './road-closure-form.css';


export interface IRoadClosureFormProps {
  addNewSelection: () => void,
  deleteStreetSegment: (payload: any) => void,
  deselectRoadClosure: () => void,
  highlightMatchedStreet: () => void,
  highlightMatchedStreetsGroup: () => void,
  nextSelection: () => void,
  previousSelection: () => void,
  inputChanged: (payload: any) => void,
  inputRemoved: (payload: any) => void,
  readOnly: boolean,
  roadClosure: IRoadClosureState,
  currentRoadClosureGroups: any,
  currentRoadClosureGroupsDirection: any,
  currentRoadClosureGroupsGeometryIdPathMap: any,
  currentRoadClosureItem: SharedStreetsMatchGeomFeatureCollection,
  selectedIntervals: any[],
  streetnameToReferenceId: any,
  toggleStreetSegmentDirection: () => void,
  viewRoadClosureOutput: () => void,
  zoomHighlightMatchedStreetsGroup: (e: any) => void,
};

export interface IRoadClosureFormState {
  firstDayOfWeek: moment.Moment;
  isCalendarExpanded: boolean;
  isShowingScheduler: boolean;
  weekOfYear: number;
}
class RoadClosureForm extends React.Component<IRoadClosureFormProps, IRoadClosureFormState> {
  constructor(props: IRoadClosureFormProps) {
    super(props);
    this.handleChangeStreetName = this.handleChangeStreetName.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.handleChangeReference = this.handleChangeReference.bind(this);
    this.handleChangeSubtype = this.handleChangeSubtype.bind(this);
    this.selectAllModes = this.selectAllModes.bind(this);
    this.handleChangeMode = this.handleChangeMode.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleChangeTimeZone = this.handleChangeTimeZone.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleStreetMouseover = this.handleStreetMouseover.bind(this);
    this.handleToggleCalendarExpanded = this.handleToggleCalendarExpanded.bind(this);
    this.handleToggleShowingScheduler = this.handleToggleShowingScheduler.bind(this);
    this.handleClickNextWeek = this.handleClickNextWeek.bind(this);
    this.handleClickPreviousWeek = this.handleClickPreviousWeek.bind(this);

    this.renderDateButtonText = this.renderDateButtonText.bind(this);
    this.handleDeleteStreetSegment = this.handleDeleteStreetSegment.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.parseDate = this.parseDate.bind(this);
    
    this.state = {
      firstDayOfWeek: moment(),
      isCalendarExpanded: false,
      isShowingScheduler: false,
      weekOfYear: moment().week(),
    }
  }

  public componentDidUpdate(prevProps: IRoadClosureFormProps) {
    if (prevProps.currentRoadClosureItem.properties.schedule !== this.props.currentRoadClosureItem.properties.schedule &&
      !isEmpty(this.props.currentRoadClosureItem.properties.schedule)) {
      this.setState({
        isShowingScheduler: true
      })
    }
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
    if (e.target.value === this.props.currentRoadClosureItem.properties.subtype) {
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

  public selectAllModes(e: any) {
    Object.keys(IRoadClosureMode).forEach((mode) => {
      if (!this.props.currentRoadClosureItem.properties.mode || 
        !this.props.currentRoadClosureItem.properties.mode.includes(IRoadClosureMode[mode])) {
          this.props.inputChanged({
            key: 'mode',
            mode,
          });
        }
    });
  }

  public handleChangeMode(e: any) {
    this.props.inputChanged({
      key: 'mode',
      mode: e.target.value,
    })
  }

  public formatDate(date: Date, locale?: string) {
    return moment(date).format("dddd, MMMM Do YYYY, h:mm:ss a");
  }

  public parseDate(str: string, locale?: string) {
    return moment(str, [
      "dddd, MMMM Do YYYY, h:mm:ss a",
      "YYYY-MM-DD",
      "DD/MM/YYYY",
      "DD-MM-YYYY",
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
    if (e[0]) {
      this.props.inputChanged({
        key: 'startTime',
        startTime: moment(e[0]).format('ddd MMM DD YYYY HH:mm:ss'),
      });
      if (!this.state.weekOfYear || this.state.firstDayOfWeek !== moment(e[0])) {
        this.setState({
          firstDayOfWeek: moment().week(moment(e[0]).week()).day(0),
          weekOfYear: moment(e[0]).week()
        });
      }
    }

    if (e[1]) {
      this.props.inputChanged({
        endTime: moment(e[1]).format('ddd MMM DD YYYY HH:mm:ss'),
        key: 'endTime',
      })
    }
  }

  public handleToggleShowingScheduler() {
    if (this.state.isShowingScheduler) {
      this.props.inputRemoved({
        key: 'schedule'
      });
    }
    this.setState({
      isShowingScheduler: !this.state.isShowingScheduler
    })
  }

  public handleToggleCalendarExpanded() {
    this.setState({
      isCalendarExpanded: !this.state.isCalendarExpanded
    })
  }

  public handleClickPreviousWeek() {
    const firstDayMinusOneWeek = this.state.firstDayOfWeek.clone().subtract(1, "week");
    // const newFirstDay = firstDayMinusOneWeek.isBefore(moment(this.props.roadClosure.currentItem.properties.startTime)) ?
    //   moment(this.props.roadClosure.currentItem.properties.startTime)
    //   : firstDayMinusOneWeek;
    
    this.setState({
      firstDayOfWeek: firstDayMinusOneWeek,
      weekOfYear: firstDayMinusOneWeek.week()
    });
  }
  
  public handleClickNextWeek() {
    const firstDayPlusOneWeek = this.state.firstDayOfWeek.clone().add(1, "week");
    
    this.setState({
      firstDayOfWeek: firstDayPlusOneWeek,
      weekOfYear: firstDayPlusOneWeek.week()
    });
  }

  public handleChangeTimeZone(timezone: string) {
    this.props.inputChanged({
      key: 'timezone',
      timezone,
    });
  }

  public handleStreetMouseover(e: any) {
    return;
  }

  public handleSave() {
    this.props.deselectRoadClosure();
  }

  public renderDateButtonText() {
    let output = "Click to pick start and end time";
    if (this.props.currentRoadClosureItem && this.props.currentRoadClosureItem.properties.startTime && this.props.currentRoadClosureItem.properties.endTime) {
      output = this.props.currentRoadClosureItem.properties.startTime + " - " + this.props.currentRoadClosureItem.properties.endTime;
    } else if (this.props.currentRoadClosureItem && this.props.currentRoadClosureItem.properties.startTime) {
      output = this.props.currentRoadClosureItem.properties.startTime + " - " + "?"
    } else if (this.props.currentRoadClosureItem && this.props.currentRoadClosureItem.properties.endTime) {
      output = "?" + " - " + this.props.currentRoadClosureItem.properties.endTime;
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
    const currentDateRange: DateRange = [undefined, undefined];
    if (this.props.roadClosure.currentItem.properties.startTime) {
      currentDateRange[0] = moment(this.props.roadClosure.currentItem.properties.startTime).toDate();
      
    }
    if (this.props.roadClosure.currentItem.properties.endTime) {
      currentDateRange[1] = moment(this.props.roadClosure.currentItem.properties.endTime).toDate();
    }

    const currentDescription = this.props.currentRoadClosureItem.properties.description;

    return (
        <div
          className="SHST-Road-Closure-Form"
        >
            {
              isEmpty(this.props.currentRoadClosureItem.properties.street) ?
              this.renderEmptyMatchedStreetsTable() :
              <RoadClosureFormStreetsGroups
                currentMatchedStreetsFeatures={this.props.currentRoadClosureItem.features}
                currentMatchedStreetsGroups={this.props.currentRoadClosureGroups}
                currentMatchedStreetsGroupsGeometryIdPathMap={this.props.currentRoadClosureGroupsGeometryIdPathMap}
                currentMatchedStreetsGroupsDirections={this.props.currentRoadClosureGroupsDirection}
                geometryIdDirectionFilter={this.props.currentRoadClosureItem.properties.geometryIdDirectionFilter}
                highlightMatchedStreet={this.props.highlightMatchedStreet}
                highlightMatchedStreetsGroup={this.props.highlightMatchedStreetsGroup}
                deleteStreetSegment={this.props.deleteStreetSegment}
                inputChanged={this.props.inputChanged}
                toggleStreetSegmentDirection={this.props.toggleStreetSegmentDirection}
                streets={this.props.currentRoadClosureItem.properties.street}
                isFetchingMatchedStreets={this.props.roadClosure.isFetchingMatchedStreets}
                zoomHighlightMatchedStreetsGroup={this.props.zoomHighlightMatchedStreetsGroup}
                readOnly={this.props.readOnly}
              />
            }
            <FormGroup
              label="Start and end time"
              labelInfo="(required)"
              className={"SHST-Road-Closure-Form-Group-Date-Time"}
            >
              <DateRangeInput
                disabled={this.props.readOnly}
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
              <TimezonePicker
                disabled={this.props.readOnly}
                inputProps={{
                  className: "SHST-Timezone-Picker-Input",
                }}
                popoverProps={{
                  // minimal: true,
                  className: "SHST-Timezone-Picker-Popover",
                  position: Position.BOTTOM_RIGHT
                }}
                onChange={this.handleChangeTimeZone}
                value={this.props.currentRoadClosureItem.properties.timezone}
                valueDisplayFormat={"name"}
              />
            </FormGroup>
            <FormGroup
              label="Schedule"
              labelInfo="(optional)"
              className={"SHST-Road-Closure-Form-Schedule-Input"}
              helperText={this.state.isShowingScheduler ? "Closure will only be active within the start and end times AND within the times specified in Schedule" : ''}
              >
              <Switch
                disabled={!(currentDateRange[0] && currentDateRange[1]) || this.props.readOnly}
                onChange={this.handleToggleShowingScheduler}
                checked={this.state.isShowingScheduler}
                label={"Set a specific schedule for this closure within the specified range"} />
              <Collapse isOpen={this.state.isShowingScheduler}>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                  <RoadClosureFormScheduleEntry
                    key={currentDateRange.toString()}
                    firstWeek={moment(currentDateRange[0]).week()}
                    lastWeek={moment(currentDateRange[1]).week()}
                    weekOfYear={this.state.weekOfYear}
                    inputChanged={this.props.inputChanged}
                    currentDateRange={currentDateRange}
                    schedule={this.props.currentRoadClosureItem.properties.schedule} />
                </div>
                <div className={"SHST-Road-Closure-Form-Schedule-Tables"}>
                <RoadClosureFormScheduleTransposedTable
                  key={0}
                  week={'0'}
                  currentWeek={this.state.weekOfYear}
                  currentDateRange={currentDateRange}
                  inputRemoved={this.props.inputRemoved}
                  firstWeek={moment(currentDateRange[0]).week()}
                  lastWeek={moment(currentDateRange[1]).week()}
                  scheduleByWeek={this.props.currentRoadClosureItem.properties.schedule}
                  />
                </div>
              </Collapse>
            </FormGroup>
            <FormGroup
              label="Description"
              labelFor="text-area"
              labelInfo="(required)"
            >
              <InputGroup
                  disabled={this.props.readOnly}
                  placeholder={"Enter a description of the closure here..."}
                  onChange={this.handleChangeDescription}
                  value={currentDescription}
              />
            </FormGroup>
            <FormGroup
              label="Reference"
              labelFor="text-area"
              labelInfo="(required)"
            >
              <InputGroup
                  disabled={this.props.readOnly}                
                  placeholder={"Enter the name of your organization here..."}
                  onChange={this.handleChangeReference}
                  value={this.props.currentRoadClosureItem.properties.reference}
              />
            </FormGroup>
            <FormGroup
              label="Sub Type"
              labelInfo={"(optional)"}>
              <div className="bp3-select">
                <select
                  disabled={this.props.readOnly}
                  value={this.props.currentRoadClosureItem.properties.subtype}
                  onChange={this.handleChangeSubtype}>
                  <option defaultChecked={true} value={''}>Choose a subtype...</option>
                  <option value="ROAD_CLOSED_HAZARD">Hazard</option>
                  <option value="ROAD_CLOSED_CONSTRUCTION">Construction</option>
                  <option value="ROAD_CLOSED_EVENT">Event</option>
                </select>
              </div>
            </FormGroup>
            <FormGroup
              // selectedValue={this.props.currentRoadClosureItem.properties.mode}
              // onChange={this.handleChangeMode}
              label="Mode"
              labelInfo="(optional)">
              <Button
                disabled={this.props.readOnly}
                text={"Select All"}
                onClick={this.selectAllModes}
              />
              <Checkbox
                disabled={this.props.readOnly}
                checked={
                  this.props.currentRoadClosureItem.properties.mode
                  && this.props.currentRoadClosureItem.properties.mode.includes(IRoadClosureMode.ROAD_CLOSED_PEDESTRIAN)
                }
                onChange={this.handleChangeMode}
                label={"Pedestrian"}
                value={IRoadClosureMode.ROAD_CLOSED_PEDESTRIAN}
              />
              <Checkbox
                disabled={this.props.readOnly}
                checked={
                  this.props.currentRoadClosureItem.properties.mode
                  && this.props.currentRoadClosureItem.properties.mode.includes(IRoadClosureMode.ROAD_CLOSED_BICYCLE)
                }
                onChange={this.handleChangeMode}
                label={"Bicycle"}
                value={IRoadClosureMode.ROAD_CLOSED_BICYCLE}
              />
              <Checkbox
                disabled={this.props.readOnly}
                defaultChecked={true}
                checked={
                  this.props.currentRoadClosureItem.properties.mode
                  && this.props.currentRoadClosureItem.properties.mode.includes(IRoadClosureMode.ROAD_CLOSED_BUS)
                }
                onChange={this.handleChangeMode}
                label={"Bus"}
                value={IRoadClosureMode.ROAD_CLOSED_BUS}
              />
              <Checkbox
                disabled={this.props.readOnly}
                checked={
                  this.props.currentRoadClosureItem.properties.mode
                  && this.props.currentRoadClosureItem.properties.mode.includes(IRoadClosureMode.ROAD_CLOSED_CAR)
                }
                onChange={this.handleChangeMode}
                label={"Car"}
                value={IRoadClosureMode.ROAD_CLOSED_CAR}
              />
              <Checkbox
                disabled={this.props.readOnly}
                checked={
                  this.props.currentRoadClosureItem.properties.mode
                  && this.props.currentRoadClosureItem.properties.mode.includes(IRoadClosureMode.ROAD_CLOSED_TAXI_RIDESHARE)
                }
                onChange={this.handleChangeMode}
                label={"Taxi/Rideshare"}
                value={IRoadClosureMode.ROAD_CLOSED_TAXI_RIDESHARE}
              />

            </FormGroup>
            <Divider />
            <H3>Output</H3>
            <RoadClosureOutputViewer />
            {/* <RoadClosureBottomActionBar>
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
              </RoadClosureBottomActionBar> */}
        </div>
    );
  }
}

export default RoadClosureForm;
