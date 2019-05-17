import { Card, Spinner } from '@blueprintjs/core';
import * as React from 'react';
import { SharedStreetsMatchGeomPath } from 'src/models/SharedStreets/SharedStreetsMatchGeomPath';
import { SharedStreetsMatchGeomPoint } from 'src/models/SharedStreets/SharedStreetsMatchGeomPoint';
import { selectMatchedStreetsGroupFilteredByDirection } from 'src/selectors/road-closure-group-item';
import RoadClosureFormStreetsGroupItem from '../road-closure-form-streets-groups-item';
// import { RoadClosureFormStateStreet } from 'src/models/RoadClosureFormStateStreet';

export interface IRoadClosureFormStreetsGroupsProps {
    currentMatchedStreetsGroups: SharedStreetsMatchGeomPath[][],
    currentMatchedStreetsGroupsDirections: Array<{ forward: boolean, backward: boolean }>,
    currentMatchedStreetsGroupsGeometryIdPathMap: { [geomId: string]: { [direction: string] : SharedStreetsMatchGeomPath} },
    currentMatchedStreetsFeatures: Array<SharedStreetsMatchGeomPath | SharedStreetsMatchGeomPoint>,
    geometryIdDirectionFilter: { [ geometryId: string] : { forward: boolean, backward: boolean } },
    streets: any,
    isFetchingMatchedStreets: boolean,
    isLoggedIn: boolean,
    deleteStreetSegment: (payload: any) => void,
    highlightMatchedStreet: () => void,
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
                this.props.currentMatchedStreetsGroups.map((group: SharedStreetsMatchGeomPath[], index) => {
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
                        highlightMatchedStreet={this.props.highlightMatchedStreet}
                        highlightMatchedStreetsGroup={this.props.highlightMatchedStreetsGroup}
                        zoomHighlightMatchedStreetsGroup={this.props.zoomHighlightMatchedStreetsGroup}
                        isLoggedIn={this.props.isLoggedIn}
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
