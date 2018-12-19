export class RoadClosureFormStateStreet {
    public matchedStreetIndex: number;
    public streetname: string;
    public referenceId: string;

    public constructor(index: number, streetname: string, refId: string) {
        this.referenceId = refId;
        this.matchedStreetIndex = index;
        this.streetname = streetname;
    }
}