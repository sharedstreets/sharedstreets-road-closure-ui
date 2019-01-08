import {
    // Button,
    // InputGroup,
    Card,
    Collapse,
} from '@blueprintjs/core';
import * as React from 'react';
import { SharedStreetsMatchPath } from 'src/models/SharedStreets/SharedStreetsMatchPath';
import { SharedStreetsMatchPoint } from 'src/models/SharedStreets/SharedStreetsMatchPoint';
// import RoadClosureFormStreetsTable from '../road-closure-form-streets-table';
// import { RoadClosureFormStateStreet } from 'src/models/RoadClosureFormStateStreet';

export interface IRoadClosureFormStreetsGroupItemProps {
    matchedStreetsGroup: Array<SharedStreetsMatchPath | SharedStreetsMatchPoint>,
    key: number,
    index: number,
    // deleteStreetSegment: (e: any) => void,
    // inputChanged: (e: any) => void,
};

export interface IRoadClosureFormStreetsGroupItemState {
    isCollapsed: boolean;
}

class RoadClosureFormStreetsGroupItem extends React.Component<IRoadClosureFormStreetsGroupItemProps, IRoadClosureFormStreetsGroupItemState> {
    public constructor(props: IRoadClosureFormStreetsGroupItemProps) {
        super(props);
        this.state = {
            isCollapsed: false,
        };
        this.handleToggleCollapsed = this.handleToggleCollapsed.bind(this);
        // this.handleChangeStreetName = this.handleChangeStreetName.bind(this);
        // this.handleDeleteStreetSegment = this.handleDeleteStreetSegment.bind(this);
    }

    public handleToggleCollapsed() {
        this.setState({
            isCollapsed: !this.state.isCollapsed 
        });
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

        return <Card onClick={this.handleToggleCollapsed}>
            <div>Index: {this.props.index}</div>
            <div>Matched Paths: {this.props.matchedStreetsGroup.length}</div>
            <div>Street: {this.props.matchedStreetsGroup.map((val: SharedStreetsMatchPath|SharedStreetsMatchPoint) => {
                    if (val instanceof SharedStreetsMatchPath) {
                        return val.properties.streetname;
                    } else {
                        return '';
                    }
                }).join(", ")}
            </div>
            <div>Direction: {this.props.matchedStreetsGroup.map((val: SharedStreetsMatchPath|SharedStreetsMatchPoint) => {
                    if (val instanceof SharedStreetsMatchPath) {
                        return val.properties.direction;
                    } else {
                        return '';
                    }
                }).join(", ")}
            </div>
        <Collapse isOpen={!this.state.isCollapsed}>
            {/* <RoadClosureFormStreetsTable
                currentMatchedStreetsFeatures={this.props.matchedStreetsGroup}
            /> */}
        </Collapse>
        </Card>
    }
}

export default RoadClosureFormStreetsGroupItem;
