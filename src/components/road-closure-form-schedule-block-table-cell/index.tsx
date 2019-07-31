import {
  // AnchorButton,
  // Popover,
  Tag,
} from '@blueprintjs/core';
import {
  parseInt
} from 'lodash';
import * as moment from 'moment'; 
import * as React from 'react'; 
import { IRoadClosureScheduleBlock } from 'src/models/RoadClosureFormStateItem';
import './road-closure-form-schedule-block-table-cell.css'

export interface IRoadClosureFormScheduleBlockTableCellProps {
  weekNumber: number,
  day: string,
  scheduleBlocks: IRoadClosureScheduleBlock[]
  onRemove: (e: any, tagProps: any) => void,
}

export interface IRoadClosureFormScheduleBlockTableCellState {
  isPopoverOpen: boolean,
}

class RoadClosureFormScheduleBlockTableCell extends React.Component<IRoadClosureFormScheduleBlockTableCellProps, IRoadClosureFormScheduleBlockTableCellState> {
  public constructor(props: IRoadClosureFormScheduleBlockTableCellProps) {
    super(props);
    this.state = {
      isPopoverOpen: false
    };
  }

  public toggleIsPopoverOpen = () => {
    this.setState({
      isPopoverOpen: !this.state.isPopoverOpen
    })
  }

  public renderScheduleBlockTag = (scheduleBlock: IRoadClosureScheduleBlock, index: number) => {
    const startHour = parseInt(scheduleBlock.startTime.split(":")[0], 10);
    const startMinute = parseInt(scheduleBlock.startTime.split(":")[1], 10);
    const endHour = parseInt(scheduleBlock.endTime.split(":")[0], 10);
    const endMinute = parseInt(scheduleBlock.endTime.split(":")[1], 10);
    const startTimeAsMoment = moment().hour(startHour).minute(startMinute);
    const endTimeAsMoment = moment().hour(endHour).minute(endMinute);

    let startTimeFormat = startTimeAsMoment.minute() === 0 ? 'h' : 'h:mm';
    const endTimeFormat = endTimeAsMoment.minute() === 0 ? 'hA' : 'h:mmA';
    startTimeFormat += startTimeAsMoment.format('a') !== endTimeAsMoment.format('a') ? 'A' : '';
              
    return <Tag fill={true} key={index} id={`${this.props.weekNumber}-${this.props.day}-${index}`} onRemove={this.props.onRemove}>
        {startTimeAsMoment.format(startTimeFormat)}-{endTimeAsMoment.format(endTimeFormat)}
    </Tag>;
  }

  public render() {
    return <div className={"SHST-Road-Closure-Form-Schedule-Block-Table-Cell-Content"}>
      {
        this.props.scheduleBlocks.map((scheduleBlock: IRoadClosureScheduleBlock, index: any) => {
          return <div className={"SHST-Road-Closure-Form-Schedule-Block-Table-Cell-Content-Row"} key={index}>
            {this.renderScheduleBlockTag(scheduleBlock, index)}
          </div>
        })
      }
    </div>
  }
}

export default RoadClosureFormScheduleBlockTableCell;