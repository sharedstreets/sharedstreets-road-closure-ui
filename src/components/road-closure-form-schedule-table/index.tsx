import {
    Colors,
    Tag,
} from '@blueprintjs/core';
import { DateRange } from '@blueprintjs/datetime';
import {
    // forEach,
    // head,
    // isEmpty,
    // last,
    // uniq,
} from 'lodash';
import * as moment from 'moment';
import * as React from 'react';
import { IRoadClosureSchedule } from 'src/models/RoadClosureFormStateItem';
import './road-closure-form-schedule-table.css';

export interface IRoadClosureFormScheduleTableProps {
    week: string,
    currentWeek: number,
    schedule: IRoadClosureSchedule,
    currentDateRange: DateRange, 
    inputRemoved: (e: any) => void,
};

class RoadClosureFormScheduleTable extends React.Component<IRoadClosureFormScheduleTableProps, any> {
    public constructor(props: IRoadClosureFormScheduleTableProps) {
        super(props);
        this.handleRemoveScheduleBlock = this.handleRemoveScheduleBlock.bind(this);
    }

    public handleRemoveScheduleBlock(e: any, tagProps: any) {
        // if (e.target.parentElement.parentElement.previousElementSibling.textContent) {
        const dayFromTag = tagProps.id.split("-")[0];
        const scheduleBlockIndex = tagProps.id.split("-")[1];
        this.props.inputRemoved({
            day: dayFromTag,
            // endTime: scheduleBlockParts[1],
            index: scheduleBlockIndex,
            key: 'schedule',
            // startTime: scheduleBlockParts[0]
        });
    }

    public render() {
        let tableStyle = {};
        if (this.props.week === this.props.currentWeek.toString()) {
            tableStyle = {backgroundColor: Colors.LIGHT_GRAY5}
        }
        // let headerStyle = {};
        // if () {
        //     headerStyle = {};
        // }
        return <table className={"SHST-Road-Closure-Form-Scheduler-Table bp3-html-table bp3-small"} style={tableStyle}>
                <thead>
                    <tr>
                        <th style={{width: '100px', padding: '0px'}}>
                        Su {moment().week(Number.parseInt(this.props.week,10)).day(0).format("MM/DD")}
                        </th>
                        <th style={{width: '100px', padding: '0px'}}>
                        M {moment().week(Number.parseInt(this.props.week,10)).day(1).format("MM/DD")}
                        </th>
                        <th style={{width: '100px', padding: '0px'}}>
                        Tu {moment().week(Number.parseInt(this.props.week,10)).day(2).format("MM/DD")}
                        </th>
                        <th style={{width: '100px', padding: '0px'}}>
                        W {moment().week(Number.parseInt(this.props.week,10)).day(3).format("MM/DD")}
                        </th>
                        <th style={{width: '100px', padding: '0px'}}>
                        Th {moment().week(Number.parseInt(this.props.week,10)).day(4).format("MM/DD")}
                        </th>
                        <th style={{width: '100px', padding: '0px'}}>
                        F {moment().week(Number.parseInt(this.props.week,10)).day(5).format("MM/DD")}
                        </th>
                        <th style={{width: '100px', padding: '0px'}}>
                        Sa {moment().week(Number.parseInt(this.props.week,10)).day(6).format("MM/DD")}
                        </th>
                    </tr>
            </thead>
            <tbody>
                <tr>
                    <td style={{width: '100px', padding: '0px'}}>
                        { this.props.schedule && this.props.schedule.Sunday && 
                            this.props.schedule.Sunday.map((scheduleBlock, index) => {
                                return <Tag id={`Sunday-${index}`} key={`Sunday-${index}`} onRemove={this.handleRemoveScheduleBlock}>
                                    {scheduleBlock.startTime}-{scheduleBlock.endTime}
                                </Tag>;
                            })
                        }
                    </td>
                    <td style={{width: '100px', padding: '0px'}}>
                        { this.props.schedule && this.props.schedule.Monday && 
                            this.props.schedule.Monday.map((scheduleBlock, index) => {
                                return <Tag id={`Monday-${index}`} key={`Monday-${index}`} onRemove={this.handleRemoveScheduleBlock}>
                                    {scheduleBlock.startTime}-{scheduleBlock.endTime}
                                </Tag>;
                            })
                        }
                    </td>
                    <td style={{width: '100px', padding: '0px'}}>
                        { this.props.schedule && this.props.schedule.Tuesday && 
                            this.props.schedule.Tuesday.map((scheduleBlock, index) => {
                                return <Tag id={`Tuesday-${index}`} key={`Tuesday-${index}`} onRemove={this.handleRemoveScheduleBlock}>
                                    {scheduleBlock.startTime}-{scheduleBlock.endTime}
                                </Tag>;
                            })
                        }
                    </td>
                    <td style={{width: '100px', padding: '0px'}}>
                        { this.props.schedule && this.props.schedule.Wednesday && 
                            this.props.schedule.Wednesday.map((scheduleBlock, index) => {
                                return <Tag id={`Wednesday-${index}`} key={`Wednesday-${index}`} onRemove={this.handleRemoveScheduleBlock}>
                                    {scheduleBlock.startTime}-{scheduleBlock.endTime}
                                </Tag>;
                            })
                        }
                    </td>
                    <td style={{width: '100px', padding: '0px'}}>
                        { this.props.schedule && this.props.schedule.Thursday && 
                            this.props.schedule.Thursday.map((scheduleBlock, index) => {
                                return <Tag id={`Thursday-${index}`} key={`Thursday-${index}`} onRemove={this.handleRemoveScheduleBlock}>
                                    {scheduleBlock.startTime}-{scheduleBlock.endTime}
                                </Tag>;
                            })
                        }
                    </td>
                    <td style={{width: '100px', padding: '0px'}}>
                        { this.props.schedule && this.props.schedule.Friday && 
                            this.props.schedule.Friday.map((scheduleBlock, index) => {
                                return <Tag id={`Friday-${index}`} key={`Friday-${index}`} onRemove={this.handleRemoveScheduleBlock}>
                                    {scheduleBlock.startTime}-{scheduleBlock.endTime}
                                </Tag>;
                            })
                        }
                    </td>
                    <td style={{width: '100px', padding: '0px'}}>
                        { this.props.schedule && this.props.schedule.Saturday && 
                            this.props.schedule.Saturday.map((scheduleBlock, index) => {
                                return <Tag id={`Saturday-${index}`} key={`Saturday-${index}`} onRemove={this.handleRemoveScheduleBlock}>
                                    {scheduleBlock.startTime}-{scheduleBlock.endTime}
                                </Tag>;
                            })
                        }
                    </td>
                </tr>
            </tbody>
        </table>
    }
}

export default RoadClosureFormScheduleTable;
