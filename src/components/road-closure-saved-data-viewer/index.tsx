import {
    Spinner,
} from '@blueprintjs/core';
import * as React from 'react';
import { SharedStreetsMatchGeomFeatureCollection } from 'src/models/SharedStreets/SharedStreetsMatchGeomFeatureCollection';
import { IRoadClosureUploadUrls } from 'src/utils/upload-url-generator';
import RoadClosureSavedDataItem from '../road-closure-saved-data-item';
import './road-closure-saved-data-viewer.css';


export interface IRoadClosureSavedDataViewerProps {
    allRoadClosureItems: SharedStreetsMatchGeomFeatureCollection[],
    allRoadClosureMetadata: any[],
    allRoadClosuresUploadUrls: IRoadClosureUploadUrls[],
    isLoadingAllRoadClosures: boolean,  
    orgName: string,
    loadAllRoadClosures: () => void,
    previewClosure: (e: any) => void,
    resetClosurePreview: () => void,
    highlightFeaturesGroup: (e: any) => void,
    setFilterLevel: (e: string) => void,
    setSortOrder: (e: string) => void,
};

export interface IRoadClosureSavedDataViewerState {
    isSavedUrlsDialogOpen: boolean;
}

class RoadClosureSavedDataViewer extends React.Component<IRoadClosureSavedDataViewerProps, IRoadClosureSavedDataViewerState> {
    public constructor(props: IRoadClosureSavedDataViewerProps) {
        super(props);
        this.handleClickRoadClosure = this.handleClickRoadClosure.bind(this);
        this.handleCloseDialog = this.handleCloseDialog.bind(this);
        this.handleSelectSortOrder = this.handleSelectSortOrder.bind(this);
        this.handleSelectFilterLevel = this.handleSelectFilterLevel.bind(this);
        this.state = {
            isSavedUrlsDialogOpen: false,
        };
    }

    public handleClickRoadClosure(e: any) {
        return;
    }
    
    public handleCloseDialog(e: any) {
        this.setState({
            isSavedUrlsDialogOpen: false,
        });
    }

    public handleSelectSortOrder(e: any) {
        this.props.setSortOrder(e.target.value);
    }

    public handleSelectFilterLevel(e: any) {
        this.props.setFilterLevel(e.target.value);
    }

    public render() {
        return (
            <div className={"SHST-Road-Closure-Saved-Data-Viewer"}>
                <div>
                    <div className="bp3-select">
                        <select onChange={this.handleSelectSortOrder}>
                            <option value={'ascending'}>Ascending</option>
                            <option value="descending">Descending</option>
                        </select>
                    </div>
                    <div className="bp3-select">
                        <select onChange={this.handleSelectFilterLevel}>
                            <option value="all">All</option>
                            <option value="current">Current</option>
                            <option value="past">Past</option>
                            <option value="scheduled">Scheduled</option>
                        </select>
                    </div>
                </div>
                <div className={"SHST-Road-Closure-Saved-Data-Viewer-List"}>
                    {this.props.allRoadClosureItems && this.props.allRoadClosureItems.length === 0 && !this.props.isLoadingAllRoadClosures &&
                        <div className="bp3-non-ideal-state">
                            <div className="bp3-non-ideal-state-visual">
                                <span className="bp3-icon bp3-icon-arrow-top-right" />
                            </div>
                            <h4 className="bp3-heading">
                                Create a new closure!
                            </h4>
                        </div>
                    }
                    {this.props.isLoadingAllRoadClosures &&
                        <div className="bp3-non-ideal-state">
                            <div className="bp3-non-ideal-state-visual">
                                <Spinner />
                            </div>
                            <h4 className="bp3-heading">
                                Loading saved closures...
                            </h4>
                        </div>
                    }
                    {this.props.allRoadClosureItems && 
                        Object.keys(this.props.allRoadClosureItems).map((roadClosureId: any) => {
                            return <React.Fragment key={roadClosureId}>
                                <RoadClosureSavedDataItem
                                        highlightFeaturesGroup={this.props.highlightFeaturesGroup}
                                        previewClosure={this.props.previewClosure}
                                        resetClosurePreview={this.props.resetClosurePreview}
                                        orgName={this.props.orgName}
                                        item={this.props.allRoadClosureItems[roadClosureId]}
                                        metadata={this.props.allRoadClosureMetadata[roadClosureId]}
                                        uploadUrls={this.props.allRoadClosuresUploadUrls[roadClosureId]} />
                            </React.Fragment>
                        })
                    }
                </div>
            </div>
        );
    }
}

export default RoadClosureSavedDataViewer;
