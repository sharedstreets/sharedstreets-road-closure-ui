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
    currentMatchedStreetsGroups: Array<Array<SharedStreetsMatchPath | SharedStreetsMatchPoint>>,
    // deleteStreetSegment: (e: any) => void,
    // inputChanged: (e: any) => void,
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
            {
                this.props.currentMatchedStreetsGroups.map((group: Array<SharedStreetsMatchPath|SharedStreetsMatchPoint>, index) => {
                    return <RoadClosureFormStreetsGroupItem
                        matchedStreetsGroup={group}
                        index={index}
                        key={index}
                    />
                })
            }
        </div>
    }
}

export default RoadClosureFormStreetsGroups;
