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
            const firstDayOfWeek = moment().week(weekNumber).day(0);
            // if (firstDayOfWeek.isBefore(this.props.currentDateRange[0])) {
            //     firstDayOfWeek = moment(this.props.currentDateRange[0]);
            // }
            const cols = [];
            cols.push(
                <td style={{textAlign: "center", verticalAlign: "middle"}}>{firstDayOfWeek.format("MM/DD")}</td>
            );

            ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].forEach((day) => {
                if (!this.props.scheduleByWeek || !this.props.scheduleByWeek[weekNumber] || !this.props.scheduleByWeek[weekNumber][day]) {
                    cols.push(
                        // TODO - make this display the possible entries
                        <td style={{width: '100px', padding: '0px', textAlign: "center", verticalAlign: "middle"}}>{''}</td>
                    )
                } else {
                    if (this.props.expandedCalendar) {
                        const scheduleBlocks: any[] = []
                        this.props.scheduleByWeek[weekNumber][day].forEach((scheduleBlock, index) => {
                            const startHour = parseInt(scheduleBlock.startTime.split(":")[0], 10);
                            const startMinute = parseInt(scheduleBlock.startTime.split(":")[1], 10);
                            const endHour = parseInt(scheduleBlock.endTime.split(":")[0], 10);
                            const endMinute = parseInt(scheduleBlock.endTime.split(":")[1], 10);
                            const startTimeAsMoment = moment().hour(startHour).minute(startMinute);
                            const endTimeAsMoment = moment().hour(endHour).minute(endMinute);

                            let startTimeFormat = startTimeAsMoment.minute() === 0 ? 'h' : 'h:mm';
                            const endTimeFormat = endTimeAsMoment.minute() === 0 ? 'hA' : 'h:mmA';
                            startTimeFormat += startTimeAsMoment.format('a') !== endTimeAsMoment.format('a') ? 'A' : '';

                            scheduleBlocks.push(
                                <Tag id={`${weekNumber}-${day}-${index}`} onRemove={this.handleRemoveScheduleBlock}>
                                    {startTimeAsMoment.format(startTimeFormat)}-{endTimeAsMoment.format(endTimeFormat)}
                                </Tag>
                            );
                        }, this);
                        cols.push(
                            <td style={{width: '100px', padding: '0px', textAlign: "center", verticalAlign: "middle"}}>
                                {scheduleBlocks}
                            </td>
                        )
                    } else {
                        cols.push(
                            <td style={{width: '100px', padding: '0px', textAlign: "center", verticalAlign: "middle"}}>
                                <Tag>{this.props.scheduleByWeek[weekNumber][day].length} ⛔️</Tag>
                            </td>
                        );
                    }
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
