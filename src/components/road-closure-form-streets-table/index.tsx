import * as React from 'react';
import { RoadClosureFormStateStreet } from 'src/models/RoadClosureFormStateStreet';
// import { SharedStreetsMatchFeatureCollection } from 'src/models/SharedStreets/SharedStreetsMatchFeatureCollection';
import RoadClosureFormStreetsTableRow from '../road-closure-form-streets-table-row';

export interface IRoadClosureFormStreetsTableProps {
    // currentMatchedStreets: SharedStreetsMatchFeatureCollection,
    currentMatchedStreetsFeatures: any,
    // isLoading: boolean,
    streets: any,
    deleteStreetSegment: (e: any) => void,
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
                { Object.keys(this.props.streets).map((referenceId: string) => {
                    const street = this.props.streets[referenceId] as RoadClosureFormStateStreet;
                    return <RoadClosureFormStreetsTableRow
                        inputChanged={this.props.inputChanged}
                        deleteStreetSegment={this.props.deleteStreetSegment}
                        currentMatchedStreetsFeatures={this.props.currentMatchedStreetsFeatures}
                        key={referenceId}
                        street={street} />
                    })
                }
            </tbody>
        </table>;
    }
}

export default RoadClosureFormStreetsTable;
