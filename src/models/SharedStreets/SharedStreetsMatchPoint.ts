import { 
    Feature,
    Point,
} from 'geojson';

export interface ISharedStreetsMatchPointProperties {
    id: string;
}

export class SharedStreetsMatchPoint implements Feature {
    public type: "Feature" = "Feature";
    public geometry: Point;
    public properties: ISharedStreetsMatchPointProperties;

    /**
     * constructor
     */
    public constructor(feature: Feature) {
        this.geometry = feature.geometry as Point;
        this.properties = feature.properties as ISharedStreetsMatchPointProperties;
    }
}