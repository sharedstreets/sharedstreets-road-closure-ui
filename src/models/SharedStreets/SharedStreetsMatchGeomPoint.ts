import { 
    Feature,
    Point,
} from 'geojson';

export interface ISharedStreetsMatchGeomPointProperties {
    id: string;
}

export class SharedStreetsMatchGeomPoint implements Feature {
    public type: "Feature" = "Feature";
    public geometry: Point;
    public properties: ISharedStreetsMatchGeomPointProperties;

    /**
     * constructor
     */
    public constructor(feature: Feature) {
        this.geometry = feature.geometry as Point;
        this.properties = feature.properties as ISharedStreetsMatchGeomPointProperties;
    }
}