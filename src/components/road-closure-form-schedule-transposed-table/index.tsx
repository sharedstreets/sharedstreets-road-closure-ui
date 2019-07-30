import {
    Colors,
} from '@blueprintjs/core';
import { DateRange } from '@blueprintjs/datetime';
import * as moment from 'moment';
import * as React from 'react';
import {
    // IRoadClosureSchedule,
    IRoadClosureScheduleByWeek,
} from 'src/models/RoadClosureFormStateItem';
import RoadClosureFormScheduleBlockTableCell from '../road-closure-form-schedule-block-table-cell';
import './road-closure-form-schedule-transposed-table.css';

export interface IRoadClosureFormScheduleTransposedTableProps {
    week: string,
    currentWeek: number,
    firstWeek: number,
    lastWeek: number,
    scheduleByWeek: IRoadClosureScheduleByWeek,
    currentDateRange: DateRange,
    expandedCalendar: boolean,
    inputRemoved: (e: any) => void,
};

class RoadClosureFormScheduleTransposedTable extends React.Component<IRoadClosureFormScheduleTransposedTableProps, any> {
    public constructor(props: IRoadClosureFormScheduleTransposedTableProps) {
        super(props);
        this.handleRemoveScheduleBlock = this.handleRemoveScheduleBlock.bind(this);
        this.renderRow = this.renderRow.bind(this);
    }

    public handleRemoveScheduleBlock(e: any, tagProps: any) {
        const weekFromTag = tagProps.id.split("-")[0];
        const dayFromTag = tagProps.id.split("-")[1];
        const scheduleBlockIndex = tagProps.id.split("-")[2];
        this.props.inputRemoved({
            day: dayFromTag,
            index: scheduleBlockIndex,
            key: 'schedule',
            weekOfYear: weekFromTag,
        });
    }

    public renderRow() {
        const output: any[] = [];

        for (let weekNumber=this.props.firstWeek; weekNumber<=this.props.lastWeek; weekNumber++) {
            const cols: any[] = [];

            ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].forEach((day) => {
                if (!this.props.scheduleByWeek || !this.props.scheduleByWeek[weekNumber] || !this.props.scheduleByWeek[weekNumber][day]) {
                    cols.push(
                        <td style={{width: '115px', maxWidth: '115px', height: '10px', padding: '0px', ...headerStyle}}>
                            <div className={"SHST-Road-Closure-Form-Schedule-Block-Table-Cell-Header"}>
                                {moment().week(weekNumber).day(day).format("MMM DD")}
                            </div>
                        </td>
                    )
                } else {
                    const scheduleBlocks: any[] = []
                    scheduleBlocks.push(
                        <RoadClosureFormScheduleBlockTableCell
                            scheduleBlocks={this.props.scheduleByWeek[weekNumber][day]}
                            weekNumber={weekNumber}
                            day={day}
                            onRemove={this.handleRemoveScheduleBlock}
                        />
                    )
                    cols.push(
                        <td style={{width: '115px', maxWidth: '115px', height: '60px', padding: '0px'}}>
                            <div className={"SHST-Road-Closure-Form-Schedule-Block-Table-Cell-Header"}>
                                {moment().week(weekNumber).day(day).format("MMM DD")}
                            </div>
                            {scheduleBlocks}
                        </td>
                    )
                }
            }, this);
            output.push(<tr>{cols}</tr>);
        }
        return output;
    }

    public render() {
        let tableStyle = {};
        if (this.props.week === this.props.currentWeek.toString()) {
            tableStyle = {backgroundColor: Colors.LIGHT_GRAY5}
        }

        return <table className={"SHST-Road-Closure-Form-Scheduler-Table bp3-html-table bp3-small bp3-interactive bp3-html-table-striped"} style={tableStyle}>
            <thead>
                <tr>
                    {/* <th>{'Week of:'}</th> */}
                    <th style={{width: '100px', padding: '0px', textAlign: 'center', verticalAlign: 'middle'}}>Su</th>
                    <th style={{width: '100px', padding: '0px', textAlign: 'center', verticalAlign: 'middle'}}>M</th>
                    <th style={{width: '100px', padding: '0px', textAlign: 'center', verticalAlign: 'middle'}}>Tu</th>
                    <th style={{width: '100px', padding: '0px', textAlign: 'center', verticalAlign: 'middle'}}>W</th>
                    <th style={{width: '100px', padding: '0px', textAlign: 'center', verticalAlign: 'middle'}}>Th</th>
                    <th style={{width: '100px', padding: '0px', textAlign: 'center', verticalAlign: 'middle'}}>F</th>
                    <th style={{width: '100px', padding: '0px', textAlign: 'center', verticalAlign: 'middle'}}>Sa</th>
                </tr>
            </thead>
            <tbody>
                {this.renderRow()}
            </tbody>
        </table>
    }
}

export default RoadClosureFormScheduleTransposedTable;
