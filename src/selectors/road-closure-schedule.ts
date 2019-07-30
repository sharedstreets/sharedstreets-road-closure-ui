import {
    parseInt
} from 'lodash';
import * as moment from 'moment';
import { IRoadClosureScheduleBlock } from 'src/models/RoadClosureFormStateItem';
import { IRoadClosureState } from 'src/store/road-closure';

export const calendarIntervalSelector = (state: IRoadClosureState) => {
    const output: any[] = [];
    if (state.currentItem.properties.schedule) {
        Object.keys(state.currentItem.properties.schedule).forEach((week) => {
            Object.keys(state.currentItem.properties.schedule[week]).forEach((day) => {
                state.currentItem.properties.schedule[week][day].forEach((scheduleBlock: IRoadClosureScheduleBlock) => {
                    const startInterval = moment()
                            .day(day)
                            .week(parseInt(week, 10))
                            .hour(parseInt(scheduleBlock.startTime.split(":")[0], 10))
                            .minutes(parseInt(scheduleBlock.startTime.split(":")[1], 10));
                    const endInterval = moment()
                            .day(day)
                            .week(parseInt(week, 10))
                            .hour(parseInt(scheduleBlock.endTime.split(":")[0], 10))
                            .minutes(parseInt(scheduleBlock.endTime.split(":")[1], 10));
                    output.push({
                        end: endInterval,
                        start: startInterval,
                    });
                })
            })
        });
    }
    return output;
}