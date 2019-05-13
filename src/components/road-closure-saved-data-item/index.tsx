import {
    AnchorButton,
    // Button,
    ButtonGroup,
    Card,
    H3,
    H4,
    H6,
} from '@blueprintjs/core';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { SharedStreetsMatchGeomFeatureCollection } from 'src/models/SharedStreets/SharedStreetsMatchGeomFeatureCollection';
import { IRoadClosureUploadUrls } from 'src/utils/upload-url-generator';
import './road-closure-saved-data-item.css';


export interface IRoadClosureSavedDataItemProps {
    key: string,
    item: SharedStreetsMatchGeomFeatureCollection,
    metadata: any,
    uploadUrls: IRoadClosureUploadUrls,
};

// export interface IRoadClosureSavedDataItemState {
//     isSavedUrlsDialogOpen: boolean;
// }

class RoadClosureSavedDataItem extends React.Component<IRoadClosureSavedDataItemProps, any> {
    public constructor(props: IRoadClosureSavedDataItemProps) {
        super(props);
    }
    
    public render() {
        return (
            <>
            <Link to={'edit?url='+this.props.uploadUrls.geojsonUploadUrl}>
                <Card
                    interactive={true}>
                    <div>
                        <div>
                            <H6><em>Last modified on: {new Date(this.props.metadata.lastModified).toString()}</em></H6>
                            <H3>{this.props.item.properties.description && this.props.item.properties.description}</H3>
                            <H4>{this.props.item.properties.street && `${Object.keys(this.props.item.properties.street).length} streets matched`}</H4>
                        </div>
                        <div>
                            {this.props.item.properties.startTime && new Date(this.props.item.properties.startTime) + " to " + new Date(this.props.item.properties.endTime)}
                        </div>
                    </div>
                </Card>
            </Link>
            {(this.props.uploadUrls.geojsonUploadUrl || this.props.uploadUrls.wazeUploadUrl) && 
                <ButtonGroup fill={true}>
                    {
                        this.props.uploadUrls.geojsonUploadUrl &&
                        <AnchorButton
                            href={this.props.uploadUrls.geojsonUploadUrl}
                            target={"_blank"}
                            fill={true}>
                            View GeoJSON
                        </AnchorButton>
                    }
                    {" "}
                    {
                        this.props.uploadUrls.wazeUploadUrl && 
                        <AnchorButton
                            href={this.props.uploadUrls.wazeUploadUrl}
                            target={"_blank"}
                            fill={true}>
                            View Waze
                        </AnchorButton>
                    }
                </ButtonGroup>
            }
            </>
        );
    }
}

export default RoadClosureSavedDataItem;
