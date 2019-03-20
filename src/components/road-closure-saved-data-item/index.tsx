import {
    // Button,
    // ButtonGroup,
    Card,
    H3,
    H4,
    Tag,
} from '@blueprintjs/core';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { RoadClosureStateItem } from 'src/models/RoadClosureStateItem';
import { IRoadClosureUploadUrls } from 'src/utils/upload-url-generator';
import './road-closure-saved-data-item.css';


export interface IRoadClosureSavedDataItemProps {
    key: string,
    item: RoadClosureStateItem,
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
            <Link to={'edit?url='+this.props.uploadUrls.stateUploadUrl}>
                <Card
                    interactive={true}>
                    <div>
                        <div>
                            <H3>{this.props.item.form.description && this.props.item.form.description}</H3>
                            <H4>{this.props.item.form.street && `${Object.keys(this.props.item.form.street).length} streets matched`}</H4>
                        </div>
                        <div>
                            {this.props.item.form.startTime && new Date(this.props.item.form.startTime) + " to " + new Date(this.props.item.form.endTime)}
                        </div>
                        <div>
                            {this.props.uploadUrls.geojsonUploadUrl && <Tag>GeoJSON</Tag>}
                            {" "}
                            {this.props.uploadUrls.wazeUploadUrl&& <Tag>Waze</Tag>}
                        </div>
                    </div>
                </Card>
            </Link>
        );
    }
}

export default RoadClosureSavedDataItem;
