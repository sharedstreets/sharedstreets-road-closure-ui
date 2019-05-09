import { 
    Feature,
    FeatureCollection,
} from 'geojson';
import { RoadClosureFormStateItem } from '../RoadClosureFormStateItem';
import { SharedStreetsMatchGeomPath } from './SharedStreetsMatchGeomPath';
import { SharedStreetsMatchGeomPoint } from './SharedStreetsMatchGeomPoint';

export class SharedStreetsMatchGeomFeatureCollection implements FeatureCollection {
    public type: "FeatureCollection" = "FeatureCollection";
    public features: Array<SharedStreetsMatchGeomPath | SharedStreetsMatchGeomPoint> = [];
    public properties: RoadClosureFormStateItem = new RoadClosureFormStateItem();
    

    public addFeaturesFromGeojson(newFeatures: Feature[]) {
        const newFeaturesArray: Array<SharedStreetsMatchGeomPath | SharedStreetsMatchGeomPoint> = newFeatures.map((feature: Feature) => {
            if (feature.geometry.type === "Point") {
                const point = new SharedStreetsMatchGeomPoint(feature);
                return point;
            }
            else {
                const path = new SharedStreetsMatchGeomPath(feature);
                return path;
            }
        });
        this.features = this.features.concat(newFeaturesArray);
    }
}