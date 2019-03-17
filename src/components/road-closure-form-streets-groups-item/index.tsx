import {
    // InputGroup,
    Button,
    Card,
    Collapse,
    H5,
} from '@blueprintjs/core';
import {
    head,
    isEmpty,
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
    streets: any,
    geometryIdDirectionFilter: { [ geometryId: string] : { forward: boolean, backward: boolean } },
    deleteStreetSegment: (payload: any) => void,
    inputChanged: (e: any) => void,
    toggleStreetSegmentDirection: (e: any) => void
};

export interface IRoadClosureFormStreetsGroupItemState {
    isCollapsed: boolean;
    canToggleDirection: boolean;
    directionOptions: Array<{ forward: boolean, backward: boolean}>
}

class RoadClosureFormStreetsGroupItem extends React.Component<IRoadClosureFormStreetsGroupItemProps, IRoadClosureFormStreetsGroupItemState> {
    public constructor(props: IRoadClosureFormStreetsGroupItemProps) {
        super(props);
        this.state = {
            canToggleDirection: this.props.matchedStreetsGroupDirections.forward &&
                this.props.matchedStreetsGroupDirections.backward,
            directionOptions: [
                { forward: true, backward: true },
                { forward: true, backward: false },
                { forward: false, backward: true }
            ],
            isCollapsed: true,
        };
        this.handleToggleCollapsed = this.handleToggleCollapsed.bind(this);
        this.handleToggleDirection = this.handleToggleDirection.bind(this);
    }

    public handleToggleCollapsed() {
        this.setState({
            isCollapsed: !this.state.isCollapsed 
        });
    }

    public handleToggleDirection() {
        const filters = this.props.matchedStreetsGroup.map((path: SharedStreetsMatchPath) =>
                this.props.geometryIdDirectionFilter[path.properties.geometryId]);
            
        const directionFilter = uniq(filters)[0];
       
        let nextIndex = this.state.directionOptions.findIndex((option) => {
            if (directionFilter) {
                return option.backward === directionFilter.backward && option.forward === directionFilter.forward
            } else {
                return false;
            }
        })+1;

        nextIndex = nextIndex === this.state.directionOptions.length ?
            0 : nextIndex;

        this.props.toggleStreetSegmentDirection({
            direction: this.state.directionOptions[nextIndex],
            geometryIds: this.props.matchedStreetsGroup.map((path: SharedStreetsMatchPath) => path.properties.geometryId),
        });
        return;
    }

    public render() {
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

        let directionIcon: 'arrows-horizontal'|'arrow-left'|'arrow-right' = this.props.matchedStreetsGroupDirections.backward && this.props.matchedStreetsGroupDirections.forward ?
            'arrows-horizontal'
            : this.props.matchedStreetsGroupDirections.backward ?
                'arrow-left'
                : 'arrow-right';

        const matchedStreetsGroupFilteredByDirection = this.props.matchedStreetsGroup.filter((path: SharedStreetsMatchPath) => {
            const directionFilter = this.props.geometryIdDirectionFilter[path.properties.geometryId];
            if (directionFilter && directionFilter.forward) {
                if (path.properties.direction === "forward") {
                    return true;
                } else { return false; }
            }
            else if (directionFilter && directionFilter.backward) {
                if (path.properties.direction === "backward") {
                    return true;
                } else { return false; }
            } 
            else {
                return false
            }
        });

        if (this.state.canToggleDirection && this.props.matchedStreetsGroup) {
            const filters = this.props.matchedStreetsGroup.map((path: SharedStreetsMatchPath) =>
                this.props.geometryIdDirectionFilter[path.properties.geometryId]);
            
            const directionFilter = uniq(filters)[0];
            if (directionFilter) {
                directionIcon = directionFilter.backward && directionFilter.forward ?
                    'arrows-horizontal'
                    : directionFilter.backward ?
                        'arrow-left'
                        : 'arrow-right';
            }
        }

        if (matchedStreetsGroupFilteredByDirection.length === 0) {
            return null; 
        }
        return <Card
                elevation={1}>
                    <div className={"SHST-Road-Closure-Form-Streets-Groups-Item-Content"}>
                        <H5>{streetNames.filter((name) => !isEmpty(name)).join(", ")}</H5>
                        <div>
                            {fromStreet.properties.fromStreetnames.filter((name) => !isEmpty(name)).join(",") + " "}
                            {
                                fromStreet.properties.fromStreetnames.filter((name) => !isEmpty(name)).length === 0 &&
                                "No streetname found"
                            }
                            {" "}
                            <Button
                                onClick={this.handleToggleDirection}
                                disabled={!this.state.canToggleDirection}
                                icon={directionIcon}
                                />
                            {" " + toStreet.properties.toStreetnames.filter((name) => !isEmpty(name)).join(",")}
                            {
                                toStreet.properties.toStreetnames.filter((name) => !isEmpty(name)).length === 0 &&
                                "No streetname found"
                            }
                        </div>
                    </div>
                    <Button 
                        fill={true}
                        text={!this.state.isCollapsed && !!this.props.matchedStreetsGroup ? 'Hide segments' : 'Show segments'}
                        onClick={this.handleToggleCollapsed}
                    />
                    <Collapse
                        className={'SHST-Road-Closure-Form-Streets-Groups-Item-Collapse'}
                        isOpen={!this.state.isCollapsed && !!this.props.matchedStreetsGroup}>
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
