import {
    Button,
    ButtonGroup,
    Pre,
} from '@blueprintjs/core';
import {
    omit,
} from 'lodash';
import * as React from 'react';
import {
    IRoadClosureOutputFormatName,
    RoadClosureOutputStateItem
} from 'src/models/RoadClosureOutputStateItem';
import RoadClosureBottomActionBar from '../road-closure-bottom-action-bar';
import './road-closure-output-viewer.css';


export interface IRoadClosureOutputViewerProps {
    hideRoadClosureOutput: () => void,
    saveRoadClosure: () => void,
    selectOutputFormat: (format: string) => void,
    viewRoadClosureOutput: () => void,
    outputItem: RoadClosureOutputStateItem,
    outputFormat: IRoadClosureOutputFormatName,
    downloadDataURI: string,
    downloadFileName: string,
    isOutputItemEmpty: boolean,
    outputItemFormattedJSONString: string,
  };


class RoadClosureOutputViewer extends React.Component<IRoadClosureOutputViewerProps, any> {
    public constructor(props: IRoadClosureOutputViewerProps) {
        super(props);
        this.handleClickDownload = this.handleClickDownload.bind(this);
        this.handleClickSave = this.handleClickSave.bind(this);
        this.handleClickCancel = this.handleClickCancel.bind(this);
        this.handleSelectFormat = this.handleSelectFormat.bind(this);
    }

    public handleClickSave() {
        this.props.saveRoadClosure();
    }
    
    public handleClickCancel() {
        this.props.hideRoadClosureOutput();
    }

    public handleClickDownload() {
        return;
    }

    public handleSelectFormat(e: any) {
        this.props.selectOutputFormat(e.target.value);
    }

    public render() {
        let downloadButtonProps = {
            className: "bp3-button bp3-large bp3-intent-success",
            download: this.props.downloadFileName,
            href: this.props.downloadDataURI,
            title: 'Click to download',
        } 

        if (this.props.isOutputItemEmpty) {
            downloadButtonProps.className += " bp3-disabled";
            downloadButtonProps = omit(downloadButtonProps, ['href', 'download']);
            downloadButtonProps.title = "You have to select a road before downloading road closure information"
        }
        return (
            <div className={"SHST-Road-Closure-Output-Viewer"}>
                <div className="bp3-select">
                    <select
                        value={this.props.outputFormat}
                        onChange={this.handleSelectFormat}>
                        <option value="geojson">GeoJSON</option>
                        <option value="waze">Waze</option>
                    </select>
                </div>
                <Pre className={"SHST-Road-Closure-Output-Viewer-Code"}>
                    {this.props.outputItemFormattedJSONString}
                </Pre>
                <RoadClosureBottomActionBar>
                    <ButtonGroup
                        fill={true}>
                        <Button
                            large={true}
                            text={"Back"}
                            onClick={this.handleClickCancel}/>
                        <Button
                            large={true}
                            intent={"primary"}
                            text={"Save"}
                            onClick={this.handleClickSave}/> 
                        <a
                            role="button"
                            {...downloadButtonProps}>
                                Download
                        </a>
                    </ButtonGroup>
                </RoadClosureBottomActionBar>
            </div>
        );
    }
}

export default RoadClosureOutputViewer;
