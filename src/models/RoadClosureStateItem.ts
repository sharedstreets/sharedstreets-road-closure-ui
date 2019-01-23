import { RoadClosureFormStateItem } from './RoadClosureFormStateItem';
import { SharedStreetsMatchFeatureCollection } from './SharedStreets/SharedStreetsMatchFeatureCollection';

export class RoadClosureStateItem {
    // public selectedPoints: object[][] = [[]];
    // public linesDrawn: object[] = [{}];
    // public matchedStreets: SharedStreetsMatchFeatureCollection[][] = [[ new SharedStreetsMatchFeatureCollection() ]];
    // public unmatchedStreets: GeoJSON.FeatureCollection[][] = [[{ type: "FeatureCollection", features: [] }]];
    // public invalidStreets: GeoJSON.FeatureCollection[][] = [[{ type: "FeatureCollection", features: [] }]];
    public matchedStreets: SharedStreetsMatchFeatureCollection = new SharedStreetsMatchFeatureCollection();
    public unmatchedStreets: GeoJSON.FeatureCollection = { type: "FeatureCollection", features: [] };
    public invalidStreets: GeoJSON.FeatureCollection = { type: "FeatureCollection", features: [] };
    public form: RoadClosureFormStateItem = new RoadClosureFormStateItem();
    public streetnameReferenceId: any[] = [];
    public geometryIdDirectionFilter: { [ geometryId: string] : { forward: boolean, backward: boolean } } = {};
}