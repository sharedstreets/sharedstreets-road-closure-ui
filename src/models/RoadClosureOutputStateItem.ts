import { Feature } from 'geojson';
import { RoadClosureWazeIncidentsItem } from './RoadClosureWazeIncidentsItem';

export enum IRoadClosureOutputFormatName {
    geojson = "geojson",
    waze = "waze",
}

export class RoadClosureOutputStateItem {
    public outputFormat: IRoadClosureOutputFormatName = IRoadClosureOutputFormatName.waze;
    public incidents: RoadClosureWazeIncidentsItem[] | Feature[];
}