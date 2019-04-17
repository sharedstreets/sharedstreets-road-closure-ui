import { RoadClosureFormStateStreet } from './RoadClosureFormStateStreet';

export interface IStreetsByGeometryId {
    [geometryId: string] : {
        forward: RoadClosureFormStateStreet,
        backward: RoadClosureFormStateStreet
    }
};

export class RoadClosureFormStateItem {
    public incidentId: string;
    public street: IStreetsByGeometryId;
    public type: string = "ROAD_CLOSED";
    public startTime: string;
    public endTime: string;
    public timezone: string;
    public description: string;
    public reference: string;
    public subtype: string;
    public geometryIdDirectionFilter: { [ geometryId: string] : { forward: boolean, backward: boolean } } = {};
}
