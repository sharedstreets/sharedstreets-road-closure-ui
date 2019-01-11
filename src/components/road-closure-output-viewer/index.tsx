import {
    Button,
    ButtonGroup,
    Pre,
} from '@blueprintjs/core';
import * as React from 'react';
import RoadClosureBottomActionBar from '../road-closure-bottom-action-bar';
import './road-closure-output-viewer.css';

export interface IRoadClosureOutputViewerProps {
    hideRoadClosureOutput: () => void,
    viewRoadClosureOutput: () => void,
    output: any,
  };


class RoadClosureOutputViewer extends React.Component<IRoadClosureOutputViewerProps, any> {
    public constructor(props: IRoadClosureOutputViewerProps) {
        super(props);
        this.handleClickDownload = this.handleClickDownload.bind(this);
        this.handleClickCopy = this.handleClickCopy.bind(this);
        this.handleClickCancel = this.handleClickCancel.bind(this);
    }

    public handleClickCopy() {
        return;
    }
    
    public handleClickCancel() {
        this.props.hideRoadClosureOutput();
    }

    public handleClickDownload() {
        return;
    }

    public render() {
        return (
            <div className={"SHST-Road-Closure-Output-Viewer"}>
                <div className="bp3-select">
                    <select>
                        <option defaultChecked={true} value="geojson">GeoJSON</option>
                        <option value={'sdot'}>SDOT [Draft]</option>
                    </select>
                </div>
                <Pre className={"SHST-Road-Closure-Output-Viewer-Code"}>
                    {JSON.stringify(this.props.output, null, 2)}
                </Pre>
                <RoadClosureBottomActionBar>
                    <ButtonGroup
                        fill={true}>
                        <Button
                            large={true}
                            text={"Cancel"}
                            onClick={this.handleClickCancel}/>
                        <Button
                            large={true}
                            text={"Copy"}
                            onClick={this.handleClickCopy}/>
                        <Button
                            intent="success"
                            large={true}
                            text={"Download"}
                            onClick={this.handleClickDownload}
                        />
                    </ButtonGroup>
                </RoadClosureBottomActionBar>
            </div>
        );
    }
}

export default RoadClosureOutputViewer;
