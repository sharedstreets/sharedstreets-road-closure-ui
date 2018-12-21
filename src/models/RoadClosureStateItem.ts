import { RoadClosureFormStateItem } from './RoadClosureFormStateItem';
export class RoadClosureStateItem {
    public selectedPoints: object[][] = [[]];
    public linesDrawn: object[] = [{}];
    public matchedStreets: GeoJSON.FeatureCollection[][] = [[{ type: "FeatureCollection", features: [] }]];
    public unmatchedStreets: GeoJSON.FeatureCollection[][] = [[{ type: "FeatureCollection", features: [] }]];
    public invalidStreets: GeoJSON.FeatureCollection[][] = [[{ type: "FeatureCollection", features: [] }]];
    public form: RoadClosureFormStateItem = new RoadClosureFormStateItem();
    public streetnameReferenceId: any[] = [];
}