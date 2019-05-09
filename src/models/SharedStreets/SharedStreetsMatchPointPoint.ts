import { 
    Feature,
    Point,
} from 'geojson';

export interface ISharedStreetsMatchPointPointProperties {
    score: number,
    location: number,
    referenceLength: number,
    geometryId: string, // '918dec21c54607050c51b0090222c761',
    referenceId: string, // 'cfa6857155527c8c712f8190e524dbf5',
    streetname: string, // 'North el Camino Real',
    direction: string, // 'backward',
    bearing: number, // 131.51799105045117,
    snappedSide: string, // 'left',
    interceptAngle: number, // 269.9996250339488
  }

export class SharedStreetsMatchPointPoint implements Feature {
    public type: "Feature" = "Feature";
    public geometry: Point;
    public properties: ISharedStreetsMatchPointPointProperties;

    public constructor(feature: Feature) {
        this.geometry = feature.geometry as Point;
        this.properties = feature.properties as ISharedStreetsMatchPointPointProperties;
    }
}