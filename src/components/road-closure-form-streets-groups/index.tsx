import {
    // Button,
    // InputGroup,
    // Card,
} from '@blueprintjs/core';
import * as React from 'react';
import { SharedStreetsMatchPath } from 'src/models/SharedStreets/SharedStreetsMatchPath';
import { SharedStreetsMatchPoint } from 'src/models/SharedStreets/SharedStreetsMatchPoint';
import RoadClosureFormStreetsGroupItem from '../road-closure-form-streets-groups-item';
// import { RoadClosureFormStateStreet } from 'src/models/RoadClosureFormStateStreet';

export interface IRoadClosureFormStreetsGroupsProps {
    currentMatchedStreetsGroups: SharedStreetsMatchPath[][],
    currentMatchedStreetsGroupsDirections: Array<{ forward: boolean, backward: boolean }>,
    currentMatchedStreetsGroupsGeometryIdPathMap: { [geomId: string]: { [direction: string] : SharedStreetsMatchPath} },
    currentMatchedStreetsFeatures: Array<SharedStreetsMatchPath | SharedStreetsMatchPoint>,
    geometryIdDirectionFilter: { [ geometryId: string] : { forward: boolean, backward: boolean } },
    deleteStreetSegment: (payload: any) => void,
    inputChanged: (e: any) => void,
    streets: any,
};

class RoadClosureFormStreetsGroups extends React.Component<IRoadClosureFormStreetsGroupsProps, any> {
    public constructor(props: IRoadClosureFormStreetsGroupsProps) {
        super(props);
        // this.handleChangeStreetName = this.handleChangeStreetName.bind(this);
        // this.handleDeleteStreetSegment = this.handleDeleteStreetSegment.bind(this);
    }

    public componentDidUpdate() {
        // tslint:disable-next-line
        console.log(this.props.currentMatchedStreetsGroups);
    }

    // public handleDeleteStreetSegment(e: any) {
    //     this.props.deleteStreetSegment(this.props.street.referenceId);
    // }

    // public handleChangeStreetName(e: any): any {
    //     this.props.inputChanged({
    //       key: 'street',
    //       referenceId: this.props.street.referenceId,
    //       street: e.target.value,
    //     });
    //   }

    public render() {
        // const {
        //     referenceId,
        //     streetname,
        //     matchedStreetIndex,
        // } = this.props.street;

        return <div>
            <label className={"bp3-label"}>
                Selections
                <div className={"bp3-text-muted"}>Click a group to see individual street segments</div>
            </label>
            {
                this.props.currentMatchedStreetsGroups.map((group: SharedStreetsMatchPath[], index) => {
                    return <RoadClosureFormStreetsGroupItem
                        streets={this.props.streets}
                        deleteStreetSegment={this.props.deleteStreetSegment}
                        inputChanged={this.props.inputChanged}
                        matchedStreetsGroup={group}
                        matchedStreetsGroupsGeometryIdPathMap={this.props.currentMatchedStreetsGroupsGeometryIdPathMap}
                        currentMatchedStreetsFeatures={this.props.currentMatchedStreetsFeatures}
                        matchedStreetsGroupDirections={this.props.currentMatchedStreetsGroupsDirections[index]}
                        index={index}
                        key={index}
                        geometryIdDirectionFilter={this.props.geometryIdDirectionFilter}
                    />
                })
            }
        </div>
    }
}

export default RoadClosureFormStreetsGroups;
