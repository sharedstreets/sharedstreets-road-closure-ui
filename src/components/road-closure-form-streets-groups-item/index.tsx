import {
    // InputGroup,
    Button,
    ButtonGroup,
    Card,
    Collapse,
    H5,
} from '@blueprintjs/core';
import {
    forEach,
    head,
    isEmpty,
    last,
    uniq,
} from 'lodash';
import * as React from 'react';
import { SharedStreetsMatchGeomPath } from 'src/models/SharedStreets/SharedStreetsMatchGeomPath';
import { SharedStreetsMatchGeomPoint } from 'src/models/SharedStreets/SharedStreetsMatchGeomPoint';
import RoadClosureFormStreetsTable from '../road-closure-form-streets-table';
import './road-closure-form-streets-groups-item.css';

export interface IRoadClosureFormStreetsGroupItemProps {
    matchedStreetsGroup: SharedStreetsMatchGeomPath[],
    matchedStreetsGroupFilteredByDirection: SharedStreetsMatchGeomPath[],
    matchedStreetsGroupsGeometryIdPathMap: { [geomId: string]: { [direction: string] : SharedStreetsMatchGeomPath} },
    matchedStreetsGroupDirections: { forward: boolean, backward: boolean },
    currentMatchedStreetsFeatures: Array<SharedStreetsMatchGeomPath | SharedStreetsMatchGeomPoint>,
    key: number,
    index: number,
    streets: any,
    geometryIdDirectionFilter: { [ geometryId: string] : { forward: boolean, backward: boolean } },
    deleteStreetSegment: (payload: any) => void,
    inputChanged: (e: any) => void,
    toggleStreetSegmentDirection: (e: any) => void,
    highlightMatchedStreet: (e: any) => void,
    highlightMatchedStreetsGroup: (e: any) => void,
    zoomHighlightMatchedStreetsGroup: (e: any) => void,
};

export interface IRoadClosureFormStreetsGroupItemState {
    isHighlighted: boolean;
    isCollapsed: boolean;
    directionOptions: Array<{ forward: boolean, backward: boolean}>
}

class RoadClosureFormStreetsGroupItem extends React.Component<IRoadClosureFormStreetsGroupItemProps, IRoadClosureFormStreetsGroupItemState> {
    public constructor(props: IRoadClosureFormStreetsGroupItemProps) {
        super(props);
        this.state = {
            directionOptions: [
                { forward: true, backward: true },
                { forward: true, backward: false },
                { forward: false, backward: true }
            ],
            isCollapsed: true,
            isHighlighted: false,
        };
        this.handleToggleCollapsed = this.handleToggleCollapsed.bind(this);
        this.handleToggleDirection = this.handleToggleDirection.bind(this);
        this.handleDeleteGroup = this.handleDeleteGroup.bind(this);
        this.handleMouseover = this.handleMouseover.bind(this);
        this.handleMouseout = this.handleMouseout.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    public canToggleDirection() {
        return this.props.matchedStreetsGroupDirections && 
        this.props.matchedStreetsGroupDirections.forward &&
        this.props.matchedStreetsGroupDirections.backward;
    }

    public handleClick() {
        this.props.zoomHighlightMatchedStreetsGroup(this.props.matchedStreetsGroup);
    }

    public handleMouseover () {
        this.props.highlightMatchedStreetsGroup(this.props.matchedStreetsGroup);
        this.setState({
            isHighlighted: true
        });
    }
    
    public handleMouseout() {
        this.props.highlightMatchedStreetsGroup([]);
        this.setState({
            isHighlighted: false,
        })
    }

    public handleDeleteGroup () {
        forEach(this.props.matchedStreetsGroup, (feature: SharedStreetsMatchGeomPath) => {
            const street = this.props.streets[feature.properties.geometryId];
            let segment = {};
            if (street.forward.referenceId === feature.properties.referenceId) {
                segment = street.forward;
            }
            if (street.backward.referenceId === feature.properties.referenceId) {
                segment = street.backward;
            }
            this.props.deleteStreetSegment(segment);
        });
    }

    public handleToggleCollapsed() {
        this.setState({
            isCollapsed: !this.state.isCollapsed 
        });
    }

    public handleToggleDirection() {
        const filters = this.props.matchedStreetsGroup.map((path: SharedStreetsMatchGeomPath) =>
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
            geometryIds: this.props.matchedStreetsGroup.map((path: SharedStreetsMatchGeomPath) => path.properties.geometryId),
        });
        return;
    }

    public render() {
        let keyDirection = "forward";
        if (!this.props.matchedStreetsGroupDirections.forward) {
            keyDirection = "backward";
        }

        const streetNames = uniq(this.props.matchedStreetsGroup.filter(
            (feature: SharedStreetsMatchGeomPath) => feature.properties.direction === keyDirection && feature.properties.streetname.trim() !== '').map(
            (feature: SharedStreetsMatchGeomPath) => {
                return feature.properties.streetname;
            })
        );

        const fromStreet = head(this.props.matchedStreetsGroup.filter((
            (feature: SharedStreetsMatchGeomPath) => feature.properties.direction === keyDirection))) as SharedStreetsMatchGeomPath;
        
        const toStreet =  last(this.props.matchedStreetsGroup.filter((
            (feature: SharedStreetsMatchGeomPath) => feature.properties.direction === fromStreet.properties.direction))) as SharedStreetsMatchGeomPath;

        if (this.props.matchedStreetsGroup.length === 0) {
            return null; 
        }
        return <Card
                className={this.state.isHighlighted ? 'SHST-Road-Closure-Form-Streets-Groups-Item-Card-Highlighted' : ''}
                onMouseEnter={this.handleMouseover}
                onMouseLeave={this.handleMouseout}
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
                                disabled={true}
                                icon={'arrow-right'}
                                small={true}
                                />
                            {" " + toStreet.properties.toStreetnames.filter((name) => !isEmpty(name)).join(",")}
                            {
                                toStreet.properties.toStreetnames.filter((name) => !isEmpty(name)).length === 0 &&
                                "No streetname found"
                            }
                        </div>
                    </div>
                    <ButtonGroup
                        fill={true}
                    >
                        <Button
                            title={'Delete this group'}
                            icon={"delete"}
                            intent={"danger"}
                            onClick={this.handleDeleteGroup}
                        />
                        <Button
                            title={'Zoom into this group'}
                            icon={"zoom-in"}
                            intent={"primary"}
                            onClick={this.handleClick}
                        />
                        <Button 
                            fill={true}
                            text={!this.state.isCollapsed && !!this.props.matchedStreetsGroup ? 'Hide segments' : 'Show segments'}
                            onClick={this.handleToggleCollapsed}
                        />
                    </ButtonGroup>
                    <Collapse
                        className={'SHST-Road-Closure-Form-Streets-Groups-Item-Collapse'}
                        isOpen={!this.state.isCollapsed && !!this.props.matchedStreetsGroup}>
                        <RoadClosureFormStreetsTable
                            streets={this.props.streets}
                            deleteStreetSegment={this.props.deleteStreetSegment}
                            inputChanged={this.props.inputChanged}
                            currentMatchedStreetsFeatures={this.props.currentMatchedStreetsFeatures}
                            matchedStreetsGroup={this.props.matchedStreetsGroup}
                            matchedStreetsGroupDirections={this.props.matchedStreetsGroupDirections}
                            matchedStreetsGroupsGeometryIdPathMap={this.props.matchedStreetsGroupsGeometryIdPathMap}
                            geometryIdDirectionFilter={this.props.geometryIdDirectionFilter}
                            highlightMatchedStreet={this.props.highlightMatchedStreet}
                        />
                    </Collapse>
        </Card>
    }
}

export default RoadClosureFormStreetsGroupItem;
