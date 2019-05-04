import * as React from 'react';

import { SharedStreetsMatchPath } from 'src/models/SharedStreets/SharedStreetsMatchPath';
import { SharedStreetsMatchPoint } from 'src/models/SharedStreets/SharedStreetsMatchPoint';
import RoadClosureFormStreetsTableRow from '../road-closure-form-streets-table-row';

export interface IRoadClosureFormStreetsTableProps {
    currentMatchedStreetsFeatures: Array<SharedStreetsMatchPath | SharedStreetsMatchPoint>,
    matchedStreetsGroup: SharedStreetsMatchPath[],
    matchedStreetsGroupDirections: { forward: boolean, backward: boolean },
    matchedStreetsGroupsGeometryIdPathMap: { [geomId: string]: { [direction: string] : SharedStreetsMatchPath} },
    geometryIdDirectionFilter: { [ geometryId: string] : { forward: boolean, backward: boolean } },
    streets: any,
    deleteStreetSegment: (payload: any) => void,
    highlightMatchedStreet: (e: any) => void,
    inputChanged: (e: any) => void,
};

class RoadClosureFormStreetsTable extends React.Component<IRoadClosureFormStreetsTableProps, any> {
    public constructor(props: IRoadClosureFormStreetsTableProps) {
        super(props);
    }

    public render() {

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
                        if (!this.props.streets[path.properties.geometryId]) {
                            return;
                        }
                        // const directionFilter = this.props.geometryIdDirectionFilter[path.properties.geometryId];
                        
                        let street = this.props.streets[path.properties.geometryId].forward;
                        if (path.properties.referenceId === this.props.streets[path.properties.geometryId].backward.referenceId) {
                            street = this.props.streets[path.properties.geometryId].backward;
                        }
                            

                        const currentFeature = this.props.currentMatchedStreetsFeatures.filter((feature) => feature instanceof SharedStreetsMatchPath)
                            .filter((feature: SharedStreetsMatchPath) => feature.properties.geometryId === path.properties.geometryId
                                                                        && feature.properties.referenceId === path.properties.referenceId
                            ) as SharedStreetsMatchPath[];

                        return <RoadClosureFormStreetsTableRow
                            highlightMatchedStreet={this.props.highlightMatchedStreet}
                            currentFeature={currentFeature[0]}
                            inputChanged={this.props.inputChanged}
                            deleteStreetSegment={this.props.deleteStreetSegment}
                            key={path.properties.geometryId}
                            street={street} />
                    })
                }
            </tbody>
        </table>;
    }
}

export default RoadClosureFormStreetsTable;
