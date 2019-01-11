import {
    // InputGroup,
    Button,
    Card,
    Collapse,
} from '@blueprintjs/core';
import {
    head,
    last,
    uniq,
} from 'lodash';
import * as React from 'react';
import { SharedStreetsMatchPath } from 'src/models/SharedStreets/SharedStreetsMatchPath';
import { SharedStreetsMatchPoint } from 'src/models/SharedStreets/SharedStreetsMatchPoint';
import RoadClosureFormStreetsTable from '../road-closure-form-streets-table';
import './road-closure-form-streets-groups-item.css';

export interface IRoadClosureFormStreetsGroupItemProps {
    matchedStreetsGroup: SharedStreetsMatchPath[],
    matchedStreetsGroupsGeometryIdPathMap: { [geomId: string]: { [direction: string] : SharedStreetsMatchPath} },
    matchedStreetsGroupDirections: { forward: boolean, backward: boolean },
    currentMatchedStreetsFeatures: Array<SharedStreetsMatchPath | SharedStreetsMatchPoint>,
    key: number,
    index: number,
    deleteStreetSegment: (payload: any) => void,
    inputChanged: (e: any) => void,
    streets: any,
    geometryIdDirectionFilter: { [ geometryId: string] : { forward: boolean, backward: boolean } },
};

export interface IRoadClosureFormStreetsGroupItemState {
    isCollapsed: boolean;
}

class RoadClosureFormStreetsGroupItem extends React.Component<IRoadClosureFormStreetsGroupItemProps, IRoadClosureFormStreetsGroupItemState> {
    public constructor(props: IRoadClosureFormStreetsGroupItemProps) {
        super(props);
        this.state = {
            isCollapsed: true,
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
        
        let keyDirection = "forward";
        if (!this.props.matchedStreetsGroupDirections.forward) {
            keyDirection = "backward";
        }

        const streetNames = uniq(this.props.matchedStreetsGroup.filter(
            (feature: SharedStreetsMatchPath) => feature.properties.direction === keyDirection && feature.properties.streetname.trim() !== '').map(
            (feature: SharedStreetsMatchPath) => {
                return feature.properties.streetname;
            })
        );

        const fromStreet = head(this.props.matchedStreetsGroup.filter((
            (feature: SharedStreetsMatchPath) => feature.properties.direction === keyDirection))) as SharedStreetsMatchPath;
        
        const toStreet =  last(this.props.matchedStreetsGroup.filter((
            (feature: SharedStreetsMatchPath) => feature.properties.direction === fromStreet.properties.direction))) as SharedStreetsMatchPath;

        const directionIcon = this.props.matchedStreetsGroupDirections.backward && this.props.matchedStreetsGroupDirections.forward ?
            'arrows-horizontal'
            : this.props.matchedStreetsGroupDirections.backward ?
                'arrow-left'
                : 'arrow-right';

        const matchedStreetsGroupFilteredByDirection = this.props.matchedStreetsGroup.filter((path: SharedStreetsMatchPath) => {
            const directionFilter = this.props.geometryIdDirectionFilter[path.properties.geometryId];
            if (directionFilter.forward) {
                if (path.properties.direction === "forward") {
                    return path;
                } else { return false; }
            } else {
                if (path.properties.direction === "backward") {
                    return path;
                } else { return false; }
            }
        });

        return <Card
                elevation={1}>
                    <div className={"SHST-Road-Closure-Form-Streets-Groups-Item-Content"}>
                        <span>{streetNames.join(", ")}</span>
                        <span>
                            {fromStreet.properties.fromStreetnames.join(",") + " "}
                            <Button icon={directionIcon}/>
                            {" " + toStreet.properties.toStreetnames.join(",")}
                        </span>
                    </div>
                    <Button 
                        fill={true}
                        text={!this.state.isCollapsed && !!this.props.matchedStreetsGroup ? 'Hide segments' : 'Show segments'}
                        onClick={this.handleToggleCollapsed}
                    />
                    <Collapse isOpen={!this.state.isCollapsed && !!this.props.matchedStreetsGroup}>
                        <RoadClosureFormStreetsTable
                            streets={this.props.streets}
                            deleteStreetSegment={this.props.deleteStreetSegment}
                            inputChanged={this.props.inputChanged}
                            currentMatchedStreetsFeatures={this.props.currentMatchedStreetsFeatures}
                            matchedStreetsGroup={matchedStreetsGroupFilteredByDirection}
                            matchedStreetsGroupDirections={this.props.matchedStreetsGroupDirections}
                            matchedStreetsGroupsGeometryIdPathMap={this.props.matchedStreetsGroupsGeometryIdPathMap}
                            geometryIdDirectionFilter={this.props.geometryIdDirectionFilter}
                        />
                    </Collapse>
        </Card>
    }
}

export default RoadClosureFormStreetsGroupItem;
