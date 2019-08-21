import {
    Button,
    Checkbox,
    InputGroup
} from '@blueprintjs/core';
import {
    isEmpty
} from 'lodash';
import * as React from 'react';
import { RoadClosureFormStateStreet } from 'src/models/RoadClosureFormStateStreet';
import { SharedStreetsMatchGeomPath } from 'src/models/SharedStreets/SharedStreetsMatchGeomPath';
// import { SharedStreetsMatchPoint } from 'src/models/SharedStreets/SharedStreetsMatchPoint';
import { getIntersectionValidityForPath } from 'src/selectors/road-closure-intersection';
import './road-closure-form-streets-table-row.css'

export interface IRoadClosureFormStreetsTableRowProps {
    // matchedStreetsGroup: Array<SharedStreetsMatchPath|SharedStreetsMatchPoint>,
    currentFeature: SharedStreetsMatchGeomPath,
    key: string,
    street: RoadClosureFormStateStreet
    deleteStreetSegment: (payload: any) => void,
    inputChanged: (e: any) => void,
    highlightMatchedStreet: (e: any) => void,
};

class RoadClosureFormStreetsTableRow extends React.Component<IRoadClosureFormStreetsTableRowProps, any> {
    public constructor(props: IRoadClosureFormStreetsTableRowProps) {
        super(props);
        this.handleDispatchStreetName = this.handleDispatchStreetName.bind(this);
        this.handleChangeIntersectionStatusChanged = this.handleChangeIntersectionStatusChanged.bind(this);
        this.handleChangeStreetName = this.handleChangeStreetName.bind(this);
        this.handleDeleteStreetSegment = this.handleDeleteStreetSegment.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.state = {
            fromIntersection: false,
            isHighlighted: false,
            streetnameValue: this.props.street.streetname,
            toIntersection: false,
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

    public handleDispatchStreetName(e: any): any {
        this.props.inputChanged({
            geometryId: this.props.street.geometryId,
            key: 'street',
            referenceId: this.props.street.referenceId,
            street: this.state.streetnameValue,
        });
    }

    public handleChangeIntersectionStatusChanged(e: any): any {
        this.props.inputChanged({
            geometryId: this.props.street.geometryId,
            // intersectionId: this.props.street.intersectionsStatus
            intersectionId: this.props.currentFeature.properties[`${e.target.id}Id`],
            key: "intersection",
            referenceId: this.props.street.referenceId,
            value: e.target.checked,
        });
    }

    public handleChangeStreetName(e: any): any {
        this.setState({
            streetnameValue: e.target.value
        })
    }

    public render() {
        const {
            geometryId,
            // streetname,
            // matchedStreetIndex,
        } = this.props.street;
        // const refIds = Object.keys(this.props.street);
        // const {
        //     streetname,
        //     geometryId,
        //     matchedStreetIndex,
        // }  = this.props.street[refIds[0]];
        const intersectionValidity = getIntersectionValidityForPath(this.props.currentFeature);
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
                        // value={streetname}
                        value={this.state.streetnameValue}
                        // onBlur={this.handleDispatchStreetName}
                        onChange={this.handleChangeStreetName}
                        rightElement={
                            <Button 
                                disabled={this.state.streetnameValue === this.props.street.streetname}
                                onClick={this.handleDispatchStreetName}
                                minimal={true}
                                icon={"tick"}
                                intent={"success"}
                            />
                        }
                    />
                </td>
                <td>
                    <Checkbox
                        disabled={!intersectionValidity.fromIntersection}
                        onChange={this.handleChangeIntersectionStatusChanged}
                        id={'fromIntersection'}
                        checked={this.props.street.intersectionsStatus && this.props.street.intersectionsStatus[this.props.street.fromIntersectionId]}
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
                <td>
                    <Checkbox
                        disabled={!intersectionValidity.toIntersection}
                        onChange={this.handleChangeIntersectionStatusChanged}
                        id={'toIntersection'}
                        checked={this.props.street.intersectionsStatus && this.props.street.intersectionsStatus[this.props.street.toIntersectionId]}
                    />
                </td>
            </tr>
    }
}

export default RoadClosureFormStreetsTableRow;
