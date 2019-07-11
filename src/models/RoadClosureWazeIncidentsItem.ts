import {
    forEach,
} from 'lodash';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import {
    IRoadClosureSchedule,
    IRoadClosureScheduleBlock,
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

    public constructor(matchedStreetSegment: SharedStreetsMatchGeomPath, form: RoadClosureFormStateItem, bothDirections: boolean) {
        this.creationtime = moment().format();
        if (form.timezone) {
            this.starttime = form.startTime ? moment.tz(form.startTime, form.timezone).format() : '';
            this.endtime = form.endTime ? moment.tz(form.endTime, form.timezone).format() : '';
        } else {
            this.starttime = form.startTime ? moment(form.startTime).format() : '';
            this.endtime = form.endTime ? moment(form.endTime).format() : '';
        }
        this.schedule = this.setSchedule(form.schedule);
        this.type = form.type;
        this.subtype = form.subtype;
        this.description = form.description;
        this.mode = form.mode;

        this.location.direction = bothDirections ? "BOTH_DIRECTIONS" : "ONE_DIRECTION";
        this.location.incidentId = uuid();
        this.location.referenceId = matchedStreetSegment.properties.referenceId;
        this.location.fromStreetnames = matchedStreetSegment.properties.fromStreetnames;
        this.location.toStreetnames = matchedStreetSegment.properties.toStreetnames;
        this.location.street = this.setStreetname(matchedStreetSegment.properties, form.street);
        this.location.polyline = this.setPolyline(matchedStreetSegment.geometry);
    }

    private setSchedule(schedule: IRoadClosureSchedule) {
        const output = {};
        Object.keys(schedule).forEach((day) => {
            output[day] = '';
            schedule[day].forEach((scheduleBlock: IRoadClosureScheduleBlock, index) => {
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