import {
    Button,
    Checkbox,
    Classes,
    ControlGroup,
    Dialog,
    FormGroup,
    // Card,
    // Collapse,
    // H6,
    // Tag,
} from '@blueprintjs/core';
import {
    DateRange,
    TimePicker,
} from '@blueprintjs/datetime';
import {
    // forEach,
    // head,
    // isEmpty,
    // last,
    // uniq,
    parseInt,
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
    currentDateRange: DateRange,
    readOnly: boolean,
    inputChanged: (e: any) => void,
};

export interface IRoadClosureFormScheduleEntryState {
    selectedDays: string[],
    selectedWeeks: number[],
    scheduleBlock: IRoadClosureScheduleBlock,
    isOpen: boolean,
    endTimeBeforeStartTime: boolean,
}

class RoadClosureFormScheduleEntry extends React.Component<IRoadClosureFormScheduleEntryProps, IRoadClosureFormScheduleEntryState> {
    public startTimePickerRef: any;
    public endTimePickerRef: any;
    public initialState: IRoadClosureFormScheduleEntryState;
    public initialSelectedWeeks: number[] = [];
    
    public constructor(props: IRoadClosureFormScheduleEntryProps) {
        super(props);
        for (let weekNumber=this.props.firstWeek; weekNumber<=this.props.lastWeek; weekNumber++) {
            this.initialSelectedWeeks.push(weekNumber);
        }
        this.initialState = {
            endTimeBeforeStartTime: false,
            isOpen: false,
            scheduleBlock: {
                endTime: "23:59",
                startTime: "00:00",
            },
            selectedDays: [],
            selectedWeeks: this.initialSelectedWeeks,
        };
        this.state = this.initialState;
        this.handleClickAdd = this.handleClickAdd.bind(this);
        this.handleChangeDay = this.handleChangeDay.bind(this);
        this.handleChangeWeek = this.handleChangeWeek.bind(this);
        this.handleChangeStartTime = this.handleChangeStartTime.bind(this);
        this.handleChangeEndTime = this.handleChangeEndTime.bind(this);
        this.isEndTimeBeforeStartTime = this.isEndTimeBeforeStartTime.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.renderWeekSelection = this.renderWeekSelection.bind(this);
        this.getHelperText = this.getHelperText.bind(this);
    }

    public handleClose() {
        this.setState({
            isOpen: false,
        });
    }

    public handleOpen() {
        this.setState({
            isOpen: true,
        });
    }

    public handleSetStartTimeRef = (ref: TimePicker | null) => {
        this.startTimePickerRef = ref;
    }

    public handleSetEndTimeRef = (ref: TimePicker | null) => {
        this.endTimePickerRef = ref;
    }

    public handleChangeStartTime(e: Date) {
        const newStartTime = moment(e).format("HH:mm");
        const newScheduleBlock = {
            endTime: this.state.scheduleBlock.endTime,
            startTime: newStartTime,
        }
        this.setState({
            scheduleBlock: newScheduleBlock
        });
    }

    public handleChangeEndTime(e: Date) {
        this.setState({
            scheduleBlock: {
                ...this.state.scheduleBlock,
                endTime: moment(e).format("HH:mm")
            }
        });
    }

    public isEndTimeBeforeStartTime() {
        const startTime = moment(this.state.scheduleBlock.startTime, "HH:mm");
        const endTime = moment(this.state.scheduleBlock.endTime, "HH:mm");
        return endTime.isBefore(startTime);
    }

    public handleClickAdd() {
        this.state.selectedWeeks.forEach((weekNumber) => {
            this.state.selectedDays.forEach((day) => {
                // if (moment().week(weekNumber).day(day)) 
                if (this.state.scheduleBlock.endTime === "00:00") {
                    this.props.inputChanged({
                        day,
                        endTime: `23:59`,
                        key: 'schedule',
                        startTime: this.state.scheduleBlock.startTime,
                        weekOfYear: weekNumber
                    });
                }
                else if (this.isEndTimeBeforeStartTime()) {
                    // account for overlapping by splitting into two days
                    this.props.inputChanged({
                        day,
                        endTime: `23:59`,
                        key: 'schedule',
                        startTime: this.state.scheduleBlock.startTime,
                        weekOfYear: weekNumber
                    });
                    const nextDay = moment().week(weekNumber).day(day).add(1, 'day');
                    this.props.inputChanged({
                        day: nextDay.format('dddd'),
                        endTime: this.state.scheduleBlock.endTime,
                        key: 'schedule',
                        startTime: `00:00`,
                        weekOfYear: nextDay.week()
                    });
                } else {
                    this.props.inputChanged({
                        day,
                        endTime: this.state.scheduleBlock.endTime,
                        key: 'schedule',
                        startTime: this.state.scheduleBlock.startTime,
                        weekOfYear: weekNumber
                    });
                }

            })
        });
        this.setState(this.initialState);
        this.handleClose();
    }

    public handleChangeDay(e: any) {
        if (this.state.selectedDays.includes(e.target.value)) {
            // remove
            this.setState({
                selectedDays: this.state.selectedDays.filter((value) => value !== e.target.value)
            });
        } else {
            // add
            this.setState({
                selectedDays: this.state.selectedDays.concat(e.target.value)
            });
        }
    }

    public handleChangeWeek(e: any) {
        if (e.target.value === 'all') {
            this.setState({
                selectedWeeks: this.initialSelectedWeeks,
            })
        } else {
            this.setState({
                selectedWeeks: [parseInt(e.target.value, 10)]
            })
        }
    }

    public renderWeekSelection() {
        const output: any[] = [];
        const areAllWeeksSelected = this.state.selectedWeeks.length > 1;
        output.push(<option selected={areAllWeeksSelected} value={'all'}>
            Every week from {moment(this.props.currentDateRange[0]).format("ddd MM/DD")} to {moment(this.props.currentDateRange[1]).format("ddd MM/DD")}
        </option>)
        for (let weekNumber=this.props.firstWeek; weekNumber<=this.props.lastWeek; weekNumber++) {
            let weekOf = moment().week(weekNumber).day(0);
            if (weekOf.isBefore(this.props.currentDateRange[0])) {
                weekOf = moment(this.props.currentDateRange[0]);
            }
            output.push(
                <option selected={!areAllWeeksSelected && this.state.selectedWeeks.includes(weekNumber)} value={weekNumber}>Week of {weekOf.format("ddd MM/DD")}</option>
            )
        }
        return output;
    }

    public getHelperText() {
        let output = '';
        if (this.state.scheduleBlock.endTime === "00:00") {
            output += `An end time of 12am/00:00 is treated as 11:59pm/23:59.\n`;
        }
        else if (this.isEndTimeBeforeStartTime()) {
            output += `You're adding an overnight closure (ex: Sunday ${this.state.scheduleBlock.startTime} to 23:59 and Monday 00:00 to ${this.state.scheduleBlock.endTime})`
        }
        return output;
    }

    public render() {
        const startHour = parseInt(this.state.scheduleBlock.startTime.split(":")[0], 10);
        const startMinute = parseInt(this.state.scheduleBlock.startTime.split(":")[1], 10);
        const endHour = parseInt(this.state.scheduleBlock.endTime.split(":")[0], 10);
        const endMinute = parseInt(this.state.scheduleBlock.endTime.split(":")[1], 10);
        const startTimeAsDate = moment().hour(startHour).minute(startMinute).toDate();
        const endTimeAsDate = moment().hour(endHour).minute(endMinute).toDate();

        return <React.Fragment>
            <Button
                disabled={this.props.readOnly}
                intent={'primary'}
                text={"Add a weekly closure schedule"}
                onClick={this.handleOpen} />
            <Dialog
                title={"Add a weekly closure schedule"}
                icon={"calendar"}
                onClose={this.handleClose}
                isOpen={this.state.isOpen}>
                    <div className={Classes.DIALOG_BODY}>
                        <ControlGroup fill={true} vertical={true}>
                        <FormGroup>
                            <div className={"bp3-select"}>
                                <select onChange={this.handleChangeWeek}>
                                    {this.renderWeekSelection()}
                                </select>
                            </div>
                        </FormGroup>
                        <FormGroup>
                        {
                            ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => {
                                return <Checkbox
                                    key={day}
                                    onChange={this.handleChangeDay}
                                    inline={true}
                                    label={moment().day(day).format('dd')}
                                    value={day}
                                    checked={this.state.selectedDays.includes(day)} />
                            })
                        }
                        </FormGroup>
                        <FormGroup
                            label={"Starting time"}
                            // helperText={"Starting time"}
                        >
                            <TimePicker
                                useAmPm={true}
                                showArrowButtons={true}
                                value={startTimeAsDate}
                                onChange={this.handleChangeStartTime}
                                ref={this.handleSetStartTimeRef}
                            />
                        </FormGroup>
                        <FormGroup
                            label={"Ending time"}
                            intent={this.getHelperText() === '' ? 'none' : 'warning'}
                            helperText={this.getHelperText()}
                        >
                            <TimePicker
                                useAmPm={true}
                                showArrowButtons={true}
                                value={endTimeAsDate}
                                onChange={this.handleChangeEndTime}
                                ref={this.handleSetEndTimeRef}
                                />
                        </FormGroup>
                    </ControlGroup>
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button
                            disabled={this.state.scheduleBlock.startTime === this.state.scheduleBlock.endTime}
                            text={"Add weekly closure schedule"}
                            icon={"add"}
                            onClick={this.handleClickAdd} />
                    </div>
                </div>
        </Dialog>
      </React.Fragment>
    }
}

export default RoadClosureFormScheduleEntry;
