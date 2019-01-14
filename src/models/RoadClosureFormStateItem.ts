import { RoadClosureFormStateStreet } from './RoadClosureFormStateStreet';

export class RoadClosureFormStateItem {
    public incidentId: string;
    public street: Array<{ [ geometryId: string] : { forward: RoadClosureFormStateStreet, backward: RoadClosureFormStateStreet } }> = [];
    public type: string = "ROAD_CLOSED";
    public startTime: string;
    public endTime: string;
    public description: string;
    public reference: string;
    public subtype: string;
}