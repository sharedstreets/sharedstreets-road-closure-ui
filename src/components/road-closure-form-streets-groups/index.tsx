import { Card, Spinner } from '@blueprintjs/core';
import * as React from 'react';
import { SharedStreetsMatchPath } from 'src/models/SharedStreets/SharedStreetsMatchPath';
import { SharedStreetsMatchPoint } from 'src/models/SharedStreets/SharedStreetsMatchPoint';
import { selectMatchedStreetsGroupFilteredByDirection } from 'src/selectors/road-closure-group-item';
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
    highlightMatchedStreetsGroup: () => void,
    inputChanged: (e: any) => void,
    toggleStreetSegmentDirection: (e: any) => void,
    zoomHighlightMatchedStreetsGroup: (e: any) => void,
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
                        matchedStreetsGroupFilteredByDirection={selectMatchedStreetsGroupFilteredByDirection(group, this.props.geometryIdDirectionFilter)}
                        matchedStreetsGroupsGeometryIdPathMap={this.props.currentMatchedStreetsGroupsGeometryIdPathMap}
                        currentMatchedStreetsFeatures={this.props.currentMatchedStreetsFeatures}
                        matchedStreetsGroupDirections={this.props.currentMatchedStreetsGroupsDirections[index]}
                        index={index}
                        key={index}
                        geometryIdDirectionFilter={this.props.geometryIdDirectionFilter}
                        toggleStreetSegmentDirection={this.props.toggleStreetSegmentDirection}
                        highlightMatchedStreetsGroup={this.props.highlightMatchedStreetsGroup}
                        zoomHighlightMatchedStreetsGroup={this.props.zoomHighlightMatchedStreetsGroup}
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
