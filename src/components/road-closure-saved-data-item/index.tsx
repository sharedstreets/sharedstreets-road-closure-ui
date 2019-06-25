import {
    Button,
    Card,
    H3,
    H4,
    // H6,
    Menu,
    MenuItem,
    Popover,
} from '@blueprintjs/core';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { SharedStreetsMatchGeomFeatureCollection } from 'src/models/SharedStreets/SharedStreetsMatchGeomFeatureCollection';
import { IRoadClosureUploadUrls } from 'src/utils/upload-url-generator';
import './road-closure-saved-data-item.css';


export interface IRoadClosureSavedDataItemProps {
    item: SharedStreetsMatchGeomFeatureCollection,
    metadata: any,
    uploadUrls: IRoadClosureUploadUrls,
    orgName: string,
    previewClosure: (e: any) => void,
    resetClosurePreview: () => void,
    highlightFeaturesGroup: (e: any) => void,
};

class RoadClosureSavedDataItem extends React.Component<IRoadClosureSavedDataItemProps, any> {
    private directUrlInput: any;
    private geojsonUrlInput: any;
    private wazeUrlInput: any;

    public constructor(props: IRoadClosureSavedDataItemProps) {
        super(props);
        this.handleClickCopyDirectURL = this.handleClickCopyDirectURL.bind(this);
        this.handlePreviewClosure = this.handlePreviewClosure.bind(this);
        this.handleMouseout = this.handleMouseout.bind(this);
        this.handleMouseover = this.handleMouseover.bind(this);

        this.directUrlInput = React.createRef();
        this.geojsonUrlInput = React.createRef();
        this.wazeUrlInput = React.createRef();

        this.state = {
            isHighlighted: false,
        };
    }
    
    public handleClickCopyDirectURL = (e: any) => {
        this.directUrlInput.select();
        document.execCommand('copy');
    }

    public handleSetDirectURLInputRef = (ref: HTMLInputElement | null) => {
        this.directUrlInput = ref;
    }
        
    public handleClickCopyGeoJSONURL = (e: any) => {
        this.geojsonUrlInput.select();
        document.execCommand('copy');
    }

    public handleSetGeoJSONURLInputRef = (ref: HTMLInputElement | null) => {
        this.geojsonUrlInput = ref;
    }
        
    public handleClickCopyWazeURL = (e: any) => {
        this.wazeUrlInput.select();
        document.execCommand('copy');
    }

    public handleSetWazeURLInputRef = (ref: HTMLInputElement | null) => {
        this.wazeUrlInput = ref;
    }

    public handlePreviewClosure = () => {
        Promise.resolve(this.props.resetClosurePreview())
        .then(() => {
            this.props.previewClosure(this.props.item);
        });
    }

    public handleMouseover () {
        if (this.props.item) {
            this.props.highlightFeaturesGroup(this.props.item.features);
            this.setState({
                isHighlighted: true
            });
        }
    }
    
    public handleMouseout() {
        this.props.highlightFeaturesGroup([]);
        this.setState({
            isHighlighted: false,
        })
    }

    
    public render() {
        let cardClassName = 'SHST-Road-Closure-Saved-Data-Item';
        if (this.state.isHighlighted) {
            cardClassName += " SHST-Road-Closure-Saved-Data-Item-Highlighted";
        }
        return (
            <React.Fragment>
            <Card
                onMouseEnter={this.handleMouseover}
                onMouseLeave={this.handleMouseout}
                className={cardClassName}>
                <div>
                    <div className={'SHST-Road-Closure-Saved-Data-Item-Buttons'}>
                        <Popover>
                            <Button
                                rightIcon={"caret-down"}
                                text={"Copy..."}
                                small={true}
                            />
                            <Menu>
                                <MenuItem
                                    text={"link to map editor"}
                                    icon={"edit"}
                                    onClick={this.handleClickCopyDirectURL}
                                />
                                {
                                    this.props.uploadUrls && this.props.uploadUrls.geojsonUploadUrl &&
                                    <MenuItem
                                        text={"link to GeoJSON data"}
                                        icon={"document"}
                                        onClick={this.handleClickCopyGeoJSONURL}
                                    />
                                }
                                    {" "}
                                {
                                    this.props.uploadUrls && this.props.uploadUrls.wazeUploadUrl && 
                                    <MenuItem
                                        text={"link to Waze CIFS data"}
                                        icon={"document"}
                                        onClick={this.handleClickCopyWazeURL}
                                    />
                                }
                            </Menu>
                        </Popover>
                        <Popover>
                            <Button
                                rightIcon={"caret-down"}
                                text={"Open..."}
                                small={true}
                            />
                            <Menu>
                                {
                                    this.props.uploadUrls && this.props.uploadUrls.geojsonUploadUrl &&
                                    <Link to={'edit?url='+this.props.uploadUrls.geojsonUploadUrl}>
                                        <MenuItem
                                            text={"in map editor"}
                                            icon={"edit"}
                                            onClick={this.handleClickCopyDirectURL}
                                        />
                                    </Link>
                                }
                                {
                                    this.props.uploadUrls && this.props.uploadUrls.geojsonUploadUrl &&
                                    <MenuItem
                                        text={"as GeoJSON data"}
                                        icon={"document-open"}
                                        href={this.props.uploadUrls.geojsonUploadUrl}
                                        target={"_blank"}
                                    />
                                }
                                    {" "}
                                {
                                    this.props.uploadUrls && this.props.uploadUrls.wazeUploadUrl && 
                                    <MenuItem
                                        text={"as Waze CIFS data"}
                                        icon={"document-open"}
                                        href={this.props.uploadUrls.wazeUploadUrl}
                                        target={"_blank"}
                                    />
                                }
                            </Menu>
                        </Popover>
                        <Button
                            text={"View on map"}
                            icon={"eye-open"}
                            small={true}
                            onClick={this.handlePreviewClosure}
                        />
                    </div>
                    <div>
                        <H3>{this.props.item && this.props.item.properties.description && this.props.item.properties.description}</H3>
                        <H4>{this.props.item && this.props.item.properties.street && `${Object.keys(this.props.item.properties.street).length} streets matched`}</H4>
                    </div>
                    <div>
                        {this.props.item && this.props.item.properties.startTime && "Starts: " + new Date(this.props.item.properties.startTime)}
                    </div>
                    <div>
                        {this.props.item && this.props.item.properties.startTime && "Ends: " + new Date(this.props.item.properties.endTime)}
                    </div>
                    <div>
                        <em>Last modified on: {new Date(this.props.metadata.lastModified).toString()}</em>
                    </div>
                </div>
            </Card>

            {
                this.props.uploadUrls && this.props.uploadUrls.geojsonUploadUrl && 
                <input
                    ref={this.handleSetDirectURLInputRef}
                    value={window.location.origin+`/${this.props.orgName}/edit?url=`+this.props.uploadUrls.geojsonUploadUrl}
                    type={"text"}
                    style={{
                        // 'display': 'none',
                        'left': '-1000px',
                        'position': 'absolute',
                        'top': '-1000px',
                }} />
            }

            {
                this.props.uploadUrls && this.props.uploadUrls.geojsonUploadUrl && 
                <input
                    ref={this.handleSetGeoJSONURLInputRef}
                    value={this.props.uploadUrls.geojsonUploadUrl}
                    type={"text"}
                    style={{
                        // 'display': 'none',
                        'left': '-1000px',
                        'position': 'absolute',
                        'top': '-1000px',
                }} />
            }

            {
                this.props.uploadUrls && this.props.uploadUrls.wazeUploadUrl && 
                <input
                    ref={this.handleSetWazeURLInputRef}
                    value={this.props.uploadUrls.wazeUploadUrl}
                    type={"text"}
                    style={{
                        // 'display': 'none',
                        'left': '-1000px',
                        'position': 'absolute',
                        'top': '-1000px',
                }} />
            }

            </React.Fragment>
        );
    }
}

export default RoadClosureSavedDataItem;
