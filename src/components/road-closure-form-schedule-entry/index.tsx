import {
    Button,
    ControlGroup,
    FormGroup,
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
    // parseInt,
} from 'lodash';
import * as moment from 'moment';
import * as React from 'react';
import {
    // IRoadClosureSchedule,
    IRoadClosureScheduleBlock,
    IRoadClosureScheduleByWeek
} from 'src/models/RoadClosureFormStateItem';
import './road-closure-form-schedule-entry.css';

export interface IRoadClosureFormScheduleEntryProps {
    firstWeek: number,
    lastWeek: number,
    schedule: IRoadClosureScheduleByWeek
    weekOfYear: number,
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

        const startTime = moment(`${startHourText}:${startMinuteText}`, "HH:mm");
        const endTime = moment(`${endHourText}:${endMinuteText}`, "HH:mm");

        if (endTime.isBefore(startTime)) {
            for (let weekNumber=this.props.firstWeek; weekNumber<=this.props.lastWeek; weekNumber++) {
                // account for overlapping by splitting into two days
                this.props.inputChanged({
                    day: this.state.day,
                    endTime: `23:59`,
                    key: 'schedule',
                    startTime: `${startHourText}:${startMinuteText}`,
                    weekOfYear: weekNumber
                });
                const nextDay = moment().week(weekNumber).day(this.state.day).add(1, 'day');
                this.props.inputChanged({
                    day: nextDay.format('dddd'),
                    endTime: `${endHourText}:${endMinuteText}`,
                    key: 'schedule',
                    startTime: `00:00`,
                    weekOfYear: nextDay.week()
                });
            }
        } else {
            for (let weekNumber=this.props.firstWeek; weekNumber<=this.props.lastWeek; weekNumber++) {
                this.props.inputChanged({
                    day: this.state.day,
                    endTime: `${endHourText}:${endMinuteText}`,
                    key: 'schedule',
                    startTime: `${startHourText}:${startMinuteText}`,
                    weekOfYear: weekNumber
                });
            }
        }
    }

    public handleChangeDay(e: any) {
        this.setState({
            day: e.target.value,
        });
    }

    public render() {

        return <ControlGroup fill={true}>
        <FormGroup
            label={"Add for every week in range"}
            // labelInfo={"(can edit individual days in calendar below)"}
            // helperText={`Schedule closure for every ${this.state.day}`}
            helperText={"If end time before start time, will split into two contiguous days"}
        >
            <div id={"SHST-Road-Closure-Form-Schedule-Select-Day"} className={"bp3-select"}>
            <select onChange={this.handleChangeDay}>
                <option value={"Sunday"}>Every Sunday</option>
                <option value={"Monday"}>Every Monday</option>
                <option value={"Tuesday"}>Every Tuesday</option>
                <option value={"Wednesday"}>Every Wednesday</option>
                <option value={"Thursday"}>Every Thursday</option>
                <option value={"Friday"}>Every Friday</option>
                <option value={"Saturday"}>Every Saturday</option>
            </select>
            </div>
        </FormGroup>
        <FormGroup
            label={"Starting time"}
            // helperText={"Starting time"}
        >
        <TimePicker
            // onChange={this.handleChangeStart}
            ref={this.handleSetStartTimeRef}
        />
        </FormGroup>
        <FormGroup
            label={"Ending time"}
        >
        <TimePicker
            // onChange={this.handleChangeEnd}
            ref={this.handleSetEndTimeRef}
        />
        </FormGroup>
        <FormGroup
            label={"Add"}
            // helperText={"Adds entire selected range"}
        >
            <Button text={"Add"} icon={"add"} onClick={this.handleClickAdd} />
        </FormGroup>
      </ControlGroup>
    }
}

export default RoadClosureFormScheduleEntry;
