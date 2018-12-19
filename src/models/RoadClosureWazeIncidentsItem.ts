import { RoadClosureFormStateItem } from './RoadClosureFormStateItem';

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

        // this.location.street = formx
        this.location.polyline = this.setPolyline();

    }

    private setPolyline() : string {
        return '';
    }
}