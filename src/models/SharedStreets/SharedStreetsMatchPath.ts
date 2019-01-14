import { 
    Feature,
    LineString,
} from 'geojson';

export interface ISharedStreetsMatchPathProperties {
    referenceId: string;
    geometryId: string;
    roadClass: string;
    streetname: string;
    fromIntersectionId: string;
    toIntersectionId: string;
    fromStreetnames: string[];
    toStreetnames: string[];
    referenceLength: number;
    point: number;
    section: number[];
    direction: string;
    side: string;
    originalFeature: Feature;
}

export class SharedStreetsMatchPath implements Feature {
    public type: "Feature" = "Feature";
    public geometry: LineString;
    public properties: ISharedStreetsMatchPathProperties;

    /**
     * constructor
     */
    public constructor(feature: Feature) {
        this.geometry = feature.geometry as LineString;
        this.properties = feature.properties as ISharedStreetsMatchPathProperties;
    }
}