export class RoadClosureFormStateItem {
    public incidentId: string;
    public street: string;
    public type: string = "ROAD_CLOSED";
    public startTime: string;
    public endTime: string;
    public description: string;
    public reference: string;
    public subtype: string;
}