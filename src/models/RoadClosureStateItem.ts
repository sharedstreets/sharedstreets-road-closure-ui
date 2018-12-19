import { RoadClosureFormStateItem } from './RoadClosureFormStateItem';
export class RoadClosureStateItem {
    public selectedPoints: object[][] = [[]];
    public matchedStreets: GeoJSON.FeatureCollection[][] = [[]];
    public unmatchedStreets: GeoJSON.FeatureCollection[][] = [[]];
    public invalidStreets: GeoJSON.FeatureCollection[][] = [[]];
    public form: RoadClosureFormStateItem = new RoadClosureFormStateItem();
    public streetnameReferenceId: any[] = [];
}