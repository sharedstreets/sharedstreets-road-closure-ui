import { Card, Spinner } from '@blueprintjs/core';
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
    isFetchingMatchedStreets: boolean,
    deleteStreetSegment: (payload: any) => void,
    inputChanged: (e: any) => void,
    toggleStreetSegmentDirection: (e: any) => void,
};

class RoadClosureFormStreetsGroups extends React.Component<IRoadClosureFormStreetsGroupsProps, any> {
    public constructor(props: IRoadClosureFormStreetsGroupsProps) {
        super(props);
    }

    public render() {
        return <div className="SHST-Streets-Card">
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
            {
                this.props.isFetchingMatchedStreets &&
                <Card>
                    <Spinner />
                    <h4
                        className="bp3-heading"
                        style={{
                            textAlign: "center"
                        }}
                        >
                        Searching for SharedStreets matched streets
                    </h4>
                </Card>
            }
        </div>
    }
}

export default RoadClosureFormStreetsGroups;
