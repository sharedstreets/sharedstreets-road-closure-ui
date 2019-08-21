export class RoadClosureFormStateStreet {
    public streetname: string;
    public referenceId: string;
    public geometryId: string;
    public fromIntersectionId: string;
    public toIntersectionId: string;
    public intersectionsStatus: { [intersectionId: string]: boolean };
}