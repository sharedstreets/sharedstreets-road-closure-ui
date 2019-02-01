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
    streets: any,
    deleteStreetSegment: (payload: any) => void,
    inputChanged: (e: any) => void,
    toggleStreetSegmentDirection: (e: any) => void,
};

class RoadClosureFormStreetsGroups extends React.Component<IRoadClosureFormStreetsGroupsProps, any> {
    public constructor(props: IRoadClosureFormStreetsGroupsProps) {
        super(props);
    }

    public render() {
        return <div>
            <label className={"bp3-label"}>
                Selected streets
                <div className={"bp3-text-muted"}>Grouped by contiguity, then name</div>
            </label>
            {
                this.props.currentMatchedStreetsGroups.map((group: SharedStreetsMatchPath[], index) => {
                    if (group.length === 0) {
                        return;
                    }
                    
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
                        toggleStreetSegmentDirection={this.props.toggleStreetSegmentDirection}
                    />
                })
            }
        </div>
    }
}

export default RoadClosureFormStreetsGroups;
