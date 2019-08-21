import { 
    Feature,
    LineString,
} from 'geojson';

export interface ISharedStreetsMatchGeomPathProperties {
    color?: string;
    referenceId: string;
    geometryId: string;
    roadClass: string;
    streetname: string;
    fromIntersectionClosed: boolean;
    toIntersectionClosed: boolean;
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

export class SharedStreetsMatchGeomPath implements Feature {
    public type: "Feature" = "Feature";
    public geometry: LineString;
    public properties: ISharedStreetsMatchGeomPathProperties;

    /**
     * constructor
     */
    public constructor(feature: Feature) {
        this.geometry = feature.geometry as LineString;
        this.properties = feature.properties as ISharedStreetsMatchGeomPathProperties;
    }
}