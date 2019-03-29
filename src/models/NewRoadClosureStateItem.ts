import { FeatureCollection } from 'geojson';

export class NewRoadClosureStateItem implements FeatureCollection {
    public type: "FeatureCollection" = "FeatureCollection";
    public features: any[] = [];
    public properties: any = {};
}