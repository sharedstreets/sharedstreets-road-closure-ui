import {
    Button,
    InputGroup
} from '@blueprintjs/core';
import * as React from 'react';
import { RoadClosureFormStateStreet } from 'src/models/RoadClosureFormStateStreet';

export interface IRoadClosureFormStreetsTableRowProps {
    currentMatchedStreetsFeatures: any,
    key: string,
    street: RoadClosureFormStateStreet
    deleteStreetSegment: (e: any) => void,
    inputChanged: (e: any) => void,
};

class RoadClosureFormStreetsTableRow extends React.Component<IRoadClosureFormStreetsTableRowProps, any> {
    public constructor(props: IRoadClosureFormStreetsTableRowProps) {
        super(props);
        this.handleChangeStreetName = this.handleChangeStreetName.bind(this);
        this.handleDeleteStreetSegment = this.handleDeleteStreetSegment.bind(this);
    }

    public handleDeleteStreetSegment(e: any) {
        this.props.deleteStreetSegment(this.props.street.referenceId);
    }

    public handleChangeStreetName(e: any): any {
        this.props.inputChanged({
          key: 'street',
          referenceId: this.props.street.referenceId,
          street: e.target.value,
        });
      }

    public render() {
        const {
            referenceId,
            streetname,
            matchedStreetIndex,
        } = this.props.street;

        return <tr key={referenceId}>
                <td>
                    <Button
                        id={referenceId}
                        onClick={this.handleDeleteStreetSegment}
                        icon={"delete"}
                    />
                </td>
                <td>
                    <InputGroup
                        key={"input-"+referenceId}
                        id={referenceId}
                        value={streetname}
                        onChange={this.handleChangeStreetName}
                    />
                </td>
                <td>
                    {this.props.currentMatchedStreetsFeatures[matchedStreetIndex].properties.fromStreetnames.join(", ")}
                </td>
                <td>
                    {this.props.currentMatchedStreetsFeatures[matchedStreetIndex].properties.toStreetnames.join(", ")}
                </td>
            </tr>
    }
}

export default RoadClosureFormStreetsTableRow;
