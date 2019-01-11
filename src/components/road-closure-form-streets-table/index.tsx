import * as React from 'react';
// import { RoadClosureFormStateStreet } from 'src/models/RoadClosureFormStateStreet';
// import { SharedStreetsMatchFeatureCollection } from 'src/models/SharedStreets/SharedStreetsMatchFeatureCollection';
import { SharedStreetsMatchPath } from 'src/models/SharedStreets/SharedStreetsMatchPath';
import { SharedStreetsMatchPoint } from 'src/models/SharedStreets/SharedStreetsMatchPoint';
import RoadClosureFormStreetsTableRow from '../road-closure-form-streets-table-row';

export interface IRoadClosureFormStreetsTableProps {
    // currentMatchedStreets: SharedStreetsMatchFeatureCollection,
    currentMatchedStreetsFeatures: Array<SharedStreetsMatchPath | SharedStreetsMatchPoint>,
    matchedStreetsGroup: SharedStreetsMatchPath[],
    matchedStreetsGroupDirections: { forward: boolean, backward: boolean },
    matchedStreetsGroupsGeometryIdPathMap: { [geomId: string]: { [direction: string] : SharedStreetsMatchPath} },
    geometryIdDirectionFilter: { [ geometryId: string] : { forward: boolean, backward: boolean } },
    // isLoading: boolean,
    streets: any,
    deleteStreetSegment: (payload: any) => void,
    inputChanged: (e: any) => void,
};

class RoadClosureFormStreetsTable extends React.Component<IRoadClosureFormStreetsTableProps, any> {
    public constructor(props: IRoadClosureFormStreetsTableProps) {
        super(props);
    }

    public render() {
        // we only want to render fields for the first direction selected
        // const firstPath = this.props.matchedStreetsGroup[0] as SharedStreetsMatchPath;
        // const firstDirection = firstPath.properties.direction;

        return <table className={"SHST-Matched-Streets-Table bp3-html-table bp3-condensed"}>
            <thead>
                <tr>
                <th>Actions</th>
                <th>Street name</th>
                <th>From</th>
                <th>To</th>
                </tr>
            </thead>
            <tbody>
                { this.props.matchedStreetsGroup.map((path: SharedStreetsMatchPath) => {
                        const directionFilter = this.props.geometryIdDirectionFilter[path.properties.geometryId];
                        const street = directionFilter.forward ?
                            this.props.streets[path.properties.geometryId].forward
                            : this.props.streets[path.properties.geometryId].backward;
                        // tslint:disable-next-line
                        console.log(street);
                        return <RoadClosureFormStreetsTableRow
                            currentMatchedStreetsFeatures={this.props.currentMatchedStreetsFeatures as SharedStreetsMatchPath[]}
                            inputChanged={this.props.inputChanged}
                            deleteStreetSegment={this.props.deleteStreetSegment}
                            // matchedStreetsGroup={this.props.matchedStreetsGroup}
                            key={path.properties.geometryId}
                            street={street} />
                    })
                }
            </tbody>
        </table>;
    }
}

export default RoadClosureFormStreetsTable;
