import {
    forEach,
} from 'lodash';
import {
    IStreetsByGeometryId,
    RoadClosureFormStateItem
} from './RoadClosureFormStateItem';
import {
    ISharedStreetsMatchPathProperties,
    SharedStreetsMatchPath,
} from './SharedStreets/SharedStreetsMatchPath';

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

    public constructor(matchedStreetSegment: SharedStreetsMatchPath, form: RoadClosureFormStateItem) {
        this.creationtime = new Date().toISOString();
        this.starttime = form.startTime;
        this.endtime = form.endTime;
        this.type = form.type;
        this.subtype = form.subtype;

        this.location.direction = matchedStreetSegment.properties.direction;
        this.location.referenceId = matchedStreetSegment.properties.referenceId;
        this.location.fromStreetnames = matchedStreetSegment.properties.fromStreetnames;
        this.location.toStreetnames = matchedStreetSegment.properties.toStreetnames;
        this.location.street = this.setStreetname(matchedStreetSegment.properties, form.street);
        this.location.polyline = this.setPolyline(matchedStreetSegment.geometry);
    }
    

    private setStreetname(matchedStreetSegmentProperties: ISharedStreetsMatchPathProperties, streetObj: IStreetsByGeometryId) : string {
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