import { RoadClosureFormStateItem } from './RoadClosureFormStateItem';

export class RoadClosureStateItem {
    public selectedPoints: object[] = [];
    public matchedStreets: object[] = [];
    public unmatchedStreets: object[] = [];
    public invalidStreets: object[] = [];
    public form: RoadClosureFormStateItem = new RoadClosureFormStateItem();
}