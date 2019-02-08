import { Feature } from 'geojson';
import { RoadClosureWazeIncidentsItem } from './RoadClosureWazeIncidentsItem';

export enum IRoadClosureOutputFormatName {
    geojson = "geojson",
    waze = "waze",
}

export class RoadClosureOutputStateItem {
    public outputFormat: IRoadClosureOutputFormatName = IRoadClosureOutputFormatName.geojson;
    public incidents: RoadClosureWazeIncidentsItem[] | Feature[];
}