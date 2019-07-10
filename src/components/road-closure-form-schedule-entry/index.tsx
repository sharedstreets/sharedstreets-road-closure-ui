import {
    // InputGroup,
    Button,
    ControlGroup,
    // Card,
    // Collapse,
    // H5,
    // Tag,
} from '@blueprintjs/core';
import {
    TimePicker,
} from '@blueprintjs/datetime';
import {
    // forEach,
    // head,
    // isEmpty,
    // last,
    // uniq,
} from 'lodash';
// import * as moment from 'moment';
import * as React from 'react';
import { IRoadClosureSchedule, IRoadClosureScheduleBlock } from 'src/models/RoadClosureFormStateItem';
import './road-closure-form-schedule-entry.css';

export interface IRoadClosureFormScheduleEntryProps {
    schedule: IRoadClosureSchedule
    inputChanged: (e: any) => void,
};

export interface IRoadClosureFormScheduleEntryState {
    day: string,
    scheduleBlock: IRoadClosureScheduleBlock,
}

class RoadClosureFormScheduleEntry extends React.Component<IRoadClosureFormScheduleEntryProps, IRoadClosureFormScheduleEntryState> {
    public startTimePickerRef: any;
    public endTimePickerRef: any;
    
    public constructor(props: IRoadClosureFormScheduleEntryProps) {
        super(props);
        this.state = {
            day: "Sunday",
            scheduleBlock: {
                endTime: "00:00",
                startTime: "00:00",
            }
        };
        this.handleClickAdd = this.handleClickAdd.bind(this);
        this.handleChangeDay = this.handleChangeDay.bind(this);
    }

    public handleSetStartTimeRef = (ref: TimePicker | null) => {
        this.startTimePickerRef = ref;
    }

    public handleSetEndTimeRef = (ref: TimePicker | null) => {
        this.endTimePickerRef = ref;
    }

    public handleClickAdd() {
        const endHourText = this.endTimePickerRef.state.hourText;
        const endMinuteText = this.endTimePickerRef.state.minuteText;
        const startHourText = this.startTimePickerRef.state.hourText;
        const startMinuteText = this.startTimePickerRef.state.minuteText;

        this.props.inputChanged({
            day: this.state.day,
            endTime: `${endHourText}:${endMinuteText}`,
            key: 'schedule',
            startTime: `${startHourText}:${startMinuteText}`,
          });
    }

    public handleChangeDay(e: any) {
        this.setState({
            day: e.target.value,
        });
    }

    public render() {

        return <ControlGroup>
        <div className={"bp3-select"}>
          <select onChange={this.handleChangeDay}>
            <option value={"Sunday"}>Sunday</option>
            <option value={"Monday"}>Monday</option>
            <option value={"Tuesday"}>Tuesday</option>
            <option value={"Wednesday"}>Wednesday</option>
            <option value={"Thursday"}>Thursday</option>
            <option value={"Friday"}>Friday</option>
            <option value={"Saturday"}>Saturday</option>
          </select>
        </div>
        <TimePicker
            // onChange={this.handleChangeStart}
            ref={this.handleSetStartTimeRef}
        />
        <TimePicker
            // onChange={this.handleChangeEnd}
            ref={this.handleSetEndTimeRef}
        />
        <Button icon={"add"} onClick={this.handleClickAdd} />
      </ControlGroup>
    }
}

export default RoadClosureFormScheduleEntry;
