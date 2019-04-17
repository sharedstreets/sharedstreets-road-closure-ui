import { Feature } from 'geojson';
import { RoadClosureWazeIncidentsItem } from './RoadClosureWazeIncidentsItem';

export enum IRoadClosureOutputFormatName {
    geojson = "geojson",
    waze = "waze",
}

export class RoadClosureOutputStateItem {
    public outputFormat: IRoadClosureOutputFormatName = IRoadClosureOutputFormatName.geojson;
    public type?: string;
    public features?: Feature[];
    public incidents?: RoadClosureWazeIncidentsItem[];
    public properties?: any;

    public constructor(outputFormat: string = "") {
        switch (outputFormat) {
            case IRoadClosureOutputFormatName.waze:
                this.incidents = [];
            case IRoadClosureOutputFormatName.geojson:
            default:
                this.features = [];
                this.type = "FeatureCollection";
        }
    }
}