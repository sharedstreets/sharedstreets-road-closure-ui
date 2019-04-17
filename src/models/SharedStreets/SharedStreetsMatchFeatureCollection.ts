import { 
    Feature,
    FeatureCollection,
} from 'geojson';
import { RoadClosureFormStateItem } from '../RoadClosureFormStateItem';
import { SharedStreetsMatchPath } from './SharedStreetsMatchPath';
import { SharedStreetsMatchPoint } from './SharedStreetsMatchPoint';

export class SharedStreetsMatchFeatureCollection implements FeatureCollection {
    public type: "FeatureCollection" = "FeatureCollection";
    public features: Array<SharedStreetsMatchPath | SharedStreetsMatchPoint> = [];
    public properties: RoadClosureFormStateItem = new RoadClosureFormStateItem();
    

    public addFeaturesFromGeojson(newFeatures: Feature[]) {
        const newFeaturesArray: Array<SharedStreetsMatchPath | SharedStreetsMatchPoint> = newFeatures.map((feature: Feature) => {
            if (feature.geometry.type === "Point") {
                const point = new SharedStreetsMatchPoint(feature);
                return point;
            }
            else {
                const path = new SharedStreetsMatchPath(feature);
                return path;
            }
        });
        this.features = this.features.concat(newFeaturesArray);
    }
}