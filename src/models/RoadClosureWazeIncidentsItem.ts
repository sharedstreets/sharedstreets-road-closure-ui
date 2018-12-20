import {
    forEach,
} from 'lodash';
import { RoadClosureFormStateItem } from './RoadClosureFormStateItem';
import { RoadClosureFormStateStreet } from './RoadClosureFormStateStreet';

export class RoadClosureWazeIncidentsItem {
    public id: string;
    public creationtime: string;
    public updatetime: string;
    public description: string;
    public type: string;
    public subtype: string;
    public location: {
        street: string,
        direction: string,
        polyline: string,
        referenceId: string,
        fromStreetnames: string[],
        toStreetnames: string[],
    } = {
        direction: '',
        fromStreetnames: [],
        polyline: '',
        referenceId: '',
        street: '',
        toStreetnames: [],
    };
    public starttime: string;
    public endtime: string;

    public constructor(matchedStreetSegment: GeoJSON.Feature, form: RoadClosureFormStateItem) {
        this.creationtime = new Date().toISOString();
        this.starttime = form.startTime;
        this.endtime = form.endTime;
        this.type = form.type;
        this.subtype = form.subtype;

        this.location.referenceId = matchedStreetSegment.properties!.referenceId;
        this.location.street = this.setStreetname(matchedStreetSegment.properties, form.street);
        this.location.polyline = this.setPolyline(matchedStreetSegment.geometry);
        this.location.fromStreetnames = matchedStreetSegment.properties!.fromStreetnames;
        this.location.toStreetnames = matchedStreetSegment.properties!.toStreetnames;
    }

    private setStreetname(matchedStreetSegmentProperties: any, streetArray: RoadClosureFormStateStreet[] | Array<{}>) : string {
        let output = '';
        forEach(streetArray, (streetRefIdMap: RoadClosureFormStateStreet) => {
            if (streetRefIdMap[matchedStreetSegmentProperties.referenceId]) {
                output = streetRefIdMap[matchedStreetSegmentProperties.referenceId].streetname;
            }
        });

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