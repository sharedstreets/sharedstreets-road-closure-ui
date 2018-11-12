export class RoadClosureStateItem {
    public id: string;
    public name: string;
    public selectedPoints: object[] = [];
    public matchedStreets: object[] = [];
    public unmatchedStreets: object[] = [];
    public invalidStreets: object[] = [];
}