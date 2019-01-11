export class RoadClosureFormStateStreet {
    public matchedStreetIndex: number;
    public streetname: string;
    public referenceId: string;
    public geometryId: string;

    public constructor(index: number, streetname: string, refId: string, geomId: string) {
        this.referenceId = refId;
        this.geometryId = geomId;
        this.matchedStreetIndex = index;
        this.streetname = streetname;
    }
}