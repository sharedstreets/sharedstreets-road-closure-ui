export class RoadClosureFormStateItem {
    public incidentId: string;
    public street: Array<{}> = [];
    public type: string = "ROAD_CLOSED";
    public startTime: string;
    public endTime: string;
    public description: string;
    public reference: string;
    public subtype: string;
}