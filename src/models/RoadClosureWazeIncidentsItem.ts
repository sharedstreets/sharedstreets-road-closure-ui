import {
    forEach,
    isEmpty,
    parseInt
} from 'lodash';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import {
    IRoadClosureSchedule,
    IRoadClosureScheduleBlock,
    // IRoadClosureScheduleByWeek,
    IStreetsByGeometryId,
    RoadClosureFormStateItem,
} from './RoadClosureFormStateItem';
import {
    ISharedStreetsMatchGeomPathProperties,
    SharedStreetsMatchGeomPath,
} from './SharedStreets/SharedStreetsMatchGeomPath';

export class RoadClosureWazeIncidentsItem {
    public id: string;
    public creationtime: string;
    public updatetime: string;
    public description: string;
    public type: string;
    public subtype: string;
    public mode: string[];
    public location: {
        street: string,
        direction: "BOTH_DIRECTIONS" | "ONE_DIRECTION" | '',
        polyline: string,
        incidentId: string,
        referenceId: string,
        fromStreetnames: string[],
        toStreetnames: string[],
    } = {
        direction: '',
        fromStreetnames: [],
        incidentId: '',
        polyline: '',
        referenceId: '',
        street: '',
        toStreetnames: [],
    };
    public starttime: string;
    public endtime: string;
    public schedule: any;
    public fromIntersectionClosed: boolean;
    public toIntersectionClosed: boolean;

    public constructor(
        matchedStreetSegment: SharedStreetsMatchGeomPath,
        form: RoadClosureFormStateItem,
        bothDirections: boolean,
        schedule?: IRoadClosureSchedule,
        week?: string
    ) {
        this.creationtime = moment().format();
        
        if (schedule && week) {
            this.starttime = form.startTime ? this.setStartTimeByWeek(form.startTime, form.timezone, parseInt(week, 10)) : '';
            this.endtime = form.endTime ? this.setEndTimeByWeek(form.endTime, form.timezone, parseInt(week, 10)) : '';
            if (!isEmpty(this.setSchedule(schedule))) {
                this.schedule = this.setSchedule(schedule);
            }
        } else {
            if (form.timezone) {
                this.starttime = moment.tz(form.startTime, form.timezone).format();
                this.endtime = moment.tz(form.endTime, form.timezone).format();
            } else {
                this.starttime = moment(form.startTime).format();
                this.endtime = moment(form.endTime).format();
            }
        }
        this.type = form.type;
        this.subtype = form.subtype;
        this.description = form.description;
        this.mode = form.mode;
        this.fromIntersectionClosed = !!matchedStreetSegment.properties.fromIntersectionClosed;
        this.toIntersectionClosed = !!matchedStreetSegment.properties.toIntersectionClosed;

        this.location.direction = bothDirections ? "BOTH_DIRECTIONS" : "ONE_DIRECTION";
        this.location.incidentId = uuid();
        this.location.referenceId = matchedStreetSegment.properties.referenceId;
        this.location.fromStreetnames = matchedStreetSegment.properties.fromStreetnames;
        this.location.toStreetnames = matchedStreetSegment.properties.toStreetnames;
        this.location.street = this.setStreetname(matchedStreetSegment.properties, form.street);
        this.location.polyline = this.setPolyline(matchedStreetSegment.geometry);
    }

    private setStartTimeByWeek(startTime: string, timezone: string, week: number) {
        const startTimeAsMoment = moment(startTime);
        const firstDayOfWeek = moment().week(week).day(0)
            .hour(startTimeAsMoment.hour())
            .minute(startTimeAsMoment.minute())
            .second(startTimeAsMoment.second());
        let startTimeText = firstDayOfWeek.format();
        if (moment(startTime).isAfter(firstDayOfWeek)) {
            startTimeText = startTime;
        }
        if (timezone) {
            return moment.tz(startTimeText, timezone).format();
        } else {
            return moment(startTimeText).format()
        }
    }

    private setEndTimeByWeek(endTime: string, timezone: string, week: number) {
        const endTimeAsMoment = moment(endTime);
        const lastDayOfWeek = moment().week(week).day(6)
            .hour(endTimeAsMoment.hour())
            .minute(endTimeAsMoment.minute())
            .second(endTimeAsMoment.second());
        let endTimeText = lastDayOfWeek.format();
        if (moment(endTime).isBefore(lastDayOfWeek)) {
            endTimeText = endTime;
        }
        if (timezone) {
            return moment.tz(endTimeText, timezone).format();
        } else {
            return moment(endTimeText).format()
        }
    }

    private setSchedule(schedule: IRoadClosureSchedule) {
        const output = {};
        Object.keys(schedule).forEach((day) => {
            output[day] = '';
            schedule[day].forEach((scheduleBlock: IRoadClosureScheduleBlock, index: number) => {
                output[day] += `${scheduleBlock.startTime}-${scheduleBlock.endTime}`;
                if (index+1 < schedule[day].length) {
                    output[day] += ',';
                }
            });
        })
        return output;
    }
    

    private setStreetname(matchedStreetSegmentProperties: ISharedStreetsMatchGeomPathProperties, streetObj: IStreetsByGeometryId) : string {
        let output = '';
        if (streetObj[matchedStreetSegmentProperties.geometryId].forward) {
            output = streetObj[matchedStreetSegmentProperties.geometryId].forward.streetname;
        } else {
            output = streetObj[matchedStreetSegmentProperties.geometryId].backward.streetname;
        }
        
        return output ? output : '';
    }

    private setPolyline(matchedStreetSegmentGeometry: GeoJSON.Geometry) : string {
        let output = '';
        if (matchedStreetSegmentGeometry.type === "LineString") {
            forEach(matchedStreetSegmentGeometry.coordinates, (coords) => {
                output += " " + coords.join(" ");
            });
        }
        return output;
    }
}