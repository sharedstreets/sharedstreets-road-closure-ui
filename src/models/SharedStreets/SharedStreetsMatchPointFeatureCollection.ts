import {
    Feature,
    FeatureCollection,
} from 'geojson';
import { SharedStreetsMatchPointPoint } from './SharedStreetsMatchPointPoint';

export class SharedStreetsMatchPointFeatureCollection implements FeatureCollection {
    public type: "FeatureCollection" = "FeatureCollection";
    public features: SharedStreetsMatchPointPoint[] = [];

    public addFeaturesFromGeoJSON(fc: FeatureCollection) {
        const features = fc.features;
        const newFeaturesArray: SharedStreetsMatchPointPoint[] = features.map((feature: Feature) => {
            const point = new SharedStreetsMatchPointPoint(feature);
            return point;
        });
        this.features = newFeaturesArray;
    }
}