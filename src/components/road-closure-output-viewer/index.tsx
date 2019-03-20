import {
    Button,
    ButtonGroup,
    Classes,
    Dialog,
    H5,
    Pre,
    Spinner,
} from '@blueprintjs/core';
import {
    omit,
} from 'lodash';
import * as React from 'react';
import {
    IRoadClosureOutputFormatName,
    RoadClosureOutputStateItem
} from 'src/models/RoadClosureOutputStateItem';
import { IRoadClosureUploadUrls } from 'src/utils/upload-url-generator';
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
    isEditingExistingClosure: boolean,
    isGeneratingUploadUrl: boolean,
    isSavingOutput: boolean,
    isOutputItemEmpty: boolean,
    outputItemFormattedJSONString: string,
    uploadUrls: IRoadClosureUploadUrls,
  };

export interface IRoadClosureOutputViewerState {
    isSavedUrlsDialogOpen: boolean;
}

class RoadClosureOutputViewer extends React.Component<IRoadClosureOutputViewerProps, IRoadClosureOutputViewerState> {
    public constructor(props: IRoadClosureOutputViewerProps) {
        super(props);
        this.handleClickSave = this.handleClickSave.bind(this);
        this.handleCloseDialog = this.handleCloseDialog.bind(this);
        this.handleClickCancel = this.handleClickCancel.bind(this);
        this.handleSelectFormat = this.handleSelectFormat.bind(this);
        this.state = {
            isSavedUrlsDialogOpen: false,
        };
    }

    public handleClickSave() {
        this.props.saveRoadClosure();
        this.setState({
            isSavedUrlsDialogOpen: true,
        });
    }
    
    public handleCloseDialog(e: any) {
        this.setState({
            isSavedUrlsDialogOpen: false,
        });
    }

    public handleClickCancel() {
        this.props.hideRoadClosureOutput();
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
                            title={"You have to create a road closure before you can save & publish it"}
                            disabled={this.props.isOutputItemEmpty}
                            large={true}
                            intent={"primary"}
                            text={this.props.isEditingExistingClosure ? "Update & Copy URL" : "Save & Copy URL"}
                            loading={this.props.isSavingOutput}
                            onClick={this.handleClickSave}/> 
                        <a
                            role="button"
                            {...downloadButtonProps}>
                                Download
                        </a>
                    </ButtonGroup>
                </RoadClosureBottomActionBar>
                <Dialog
                    isOpen={this.state.isSavedUrlsDialogOpen}
                    usePortal={true}
                    title={"Saved road closure links"}
                    onClose={this.handleCloseDialog}
                >
                    <div className={Classes.DIALOG_BODY}>
                        <H5>GeoJSON</H5>
                            <p>
                                <a target="_blank" href={this.props.uploadUrls.geojsonUploadUrl}>
                                    {this.props.isGeneratingUploadUrl && <Spinner />}
                                    {this.props.uploadUrls.geojsonUploadUrl}
                                </a>
                            </p>
                        <H5>Waze</H5>
                            <p>
                                <a target="_blank" href={this.props.uploadUrls.wazeUploadUrl}>
                                {this.props.isGeneratingUploadUrl && <Spinner />}
                                    {this.props.uploadUrls.wazeUploadUrl}
                                </a>
                            </p>
                    </div>
                </Dialog>
            </div>
        );
    }
}

export default RoadClosureOutputViewer;
