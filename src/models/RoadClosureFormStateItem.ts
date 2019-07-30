import { RoadClosureFormStateStreet } from './RoadClosureFormStateStreet';

export interface IStreetsByGeometryId {
    [geometryId: string] : {
        forward: RoadClosureFormStateStreet,
        backward: RoadClosureFormStateStreet
    }
};

export enum IRoadClosureMode {
    ROAD_CLOSED_BICYCLE = "ROAD_CLOSED_BICYCLE",
    ROAD_CLOSED_BUS = "ROAD_CLOSED_BUS",
    ROAD_CLOSED_CAR = "ROAD_CLOSED_CAR",
    ROAD_CLOSED_TAXI_RIDESHARE = "ROAD_CLOSED_TAXI_RIDESHARE",
    ROAD_CLOSED_PEDESTRIAN = "ROAD_CLOSED_PEDESTRIAN",
};

export interface IRoadClosureScheduleBlock {
    startTime: string,
    endTime: string,
}

export interface IRoadClosureScheduleByWeek {
    [week: number]: IRoadClosureSchedule
}

export interface IRoadClosureSchedule {
    [day: string]: IRoadClosureScheduleBlock[]
}

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
    public mode: IRoadClosureMode[] = [];
    public schedule: IRoadClosureScheduleByWeek = {};
    public geometryIdDirectionFilter: { [ geometryId: string] : { forward: boolean, backward: boolean } } = {};
}
