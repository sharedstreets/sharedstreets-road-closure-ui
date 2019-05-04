import {
    Button,
    InputGroup
} from '@blueprintjs/core';
import {
    isEmpty
} from 'lodash';
import * as React from 'react';
import { RoadClosureFormStateStreet } from 'src/models/RoadClosureFormStateStreet';
import { SharedStreetsMatchPath } from 'src/models/SharedStreets/SharedStreetsMatchPath';
// import { SharedStreetsMatchPoint } from 'src/models/SharedStreets/SharedStreetsMatchPoint';
import './road-closure-form-streets-table-row.css'

export interface IRoadClosureFormStreetsTableRowProps {
    // matchedStreetsGroup: Array<SharedStreetsMatchPath|SharedStreetsMatchPoint>,
    currentFeature: SharedStreetsMatchPath,
    key: string,
    street: RoadClosureFormStateStreet
    deleteStreetSegment: (payload: any) => void,
    inputChanged: (e: any) => void,
    highlightMatchedStreet: (e: any) => void,
};

class RoadClosureFormStreetsTableRow extends React.Component<IRoadClosureFormStreetsTableRowProps, any> {
    public constructor(props: IRoadClosureFormStreetsTableRowProps) {
        super(props);
        this.handleChangeStreetName = this.handleChangeStreetName.bind(this);
        this.handleDeleteStreetSegment = this.handleDeleteStreetSegment.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.state ={
            isHighlighted: false,
        }
    }

    public handleMouseEnter(e: any) {
        this.props.highlightMatchedStreet(this.props.street);
        this.setState({
            isHighlighted: true,
        })
    }
    public handleMouseLeave(e: any) {
        this.props.highlightMatchedStreet({});
        this.setState({
            isHighlighted: false,
        })
    }

    public handleDeleteStreetSegment(e: any) {
        this.props.deleteStreetSegment(this.props.street);
    }

    public handleChangeStreetName(e: any): any {
        this.props.inputChanged({
            geometryId: this.props.street.geometryId,
            key: 'street',
            referenceId: this.props.street.referenceId,
            street: e.target.value,
        });
      }

    public render() {
        const {
            geometryId,
            streetname,
            // matchedStreetIndex,
        } = this.props.street;
        // const refIds = Object.keys(this.props.street);
        // const {
        //     streetname,
        //     geometryId,
        //     matchedStreetIndex,
        // }  = this.props.street[refIds[0]];
        return <tr
                    className={
                        this.state.isHighlighted ?
                        'SHST-Road-Closure-Form-Streets-Table-Row-Highlighted'
                        : 'SHST-Road-Closure-Form-Streets-Table-Row'
                    }
                    onMouseEnter={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
                    key={geometryId}>
                <td>
                    <Button
                        id={geometryId}
                        onClick={this.handleDeleteStreetSegment}
                        icon={"delete"}
                    />
                </td>
                <td>
                    <InputGroup
                        key={"input-"+geometryId}
                        id={geometryId}
                        value={streetname}
                        onChange={this.handleChangeStreetName}
                    />
                </td>
                <td>
                    {this.props.currentFeature.properties.fromStreetnames.filter((name) => !isEmpty(name)).join(", ")}
                    {
                        this.props.currentFeature.properties.fromStreetnames.filter((name) => !isEmpty(name)).length === 0 && 
                        "No streetname found"
                    }
                    
                </td>
                <td>
                    {this.props.currentFeature.properties.toStreetnames.filter((name) => !isEmpty(name)).join(", ")}
                    {
                        this.props.currentFeature.properties.toStreetnames.filter((name) => !isEmpty(name)).length === 0 && 
                        "No streetname found"
                    }
                </td>
            </tr>
    }
}

export default RoadClosureFormStreetsTableRow;
