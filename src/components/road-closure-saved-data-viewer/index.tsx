import {
    Button,
    Popover,
    Spinner,
} from '@blueprintjs/core';
import {
    // DateTimePicker
    DateRange,
    DateRangePicker,
} from '@blueprintjs/datetime';
import * as moment from 'moment';
import * as React from 'react';
import { SharedStreetsMatchGeomFeatureCollection } from 'src/models/SharedStreets/SharedStreetsMatchGeomFeatureCollection';
import { IRoadClosureUploadUrls } from 'src/utils/upload-url-generator';
import RoadClosureSavedDataItem from '../road-closure-saved-data-item';
import './road-closure-saved-data-viewer.css';


export interface IRoadClosureSavedDataViewerProps {
    allRoadClosureItems: SharedStreetsMatchGeomFeatureCollection[],
    allRoadClosureMetadata: any[],
    allRoadClosuresUploadUrls: IRoadClosureUploadUrls[],
    filterRange: DateRange,
    isLoadingAllRoadClosures: boolean,  
    orgName: string,
    totalItemCount: number,
    loadAllRoadClosures: () => void,
    previewClosure: (e: any) => void,
    resetClosurePreview: () => void,
    highlightFeaturesGroup: (e: any) => void,
    setFilterLevel: (e: string, r?: DateRange) => void,
    setFilterRange: (e: DateRange) => void,
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
        this.handleSelectFilterRange = this.handleSelectFilterRange.bind(this);
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

    public handleSelectFilterRange(e: DateRange) {
        this.props.setFilterRange(e);
    }

    public render() {
        return (
            <div className={"SHST-Road-Closure-Saved-Data-Viewer"}>
                <div className={"SHST-Road-Closure-Saved-Data-Viewer-Filter"}>
                    <div>
                        <div className="bp3-select">
                            <select onChange={this.handleSelectSortOrder}>
                                <option value="start">Start time</option>
                                <option value="end">End time</option>
                                <option value="descending">Most recently modified</option>
                                <option value='ascending'>Least recently modified</option>
                            </select>
                        </div>
                        <div className="bp3-select">
                            <select onChange={this.handleSelectFilterLevel}>
                                <option value="all">All</option>
                                <option value="current">Happening now</option>
                                <option value="past">Completed</option>
                                <option value="scheduled">Coming up</option>
                            </select>
                        </div>
                        <Popover>
                            <Button text={
                                (this.props.filterRange[0] && this.props.filterRange[1]) ?
                                    `${moment(this.props.filterRange[0]).format("MMM D")} to ${moment(this.props.filterRange[1]).format("MMM D")}`
                                    : "Filter by date range"
                            } />
                            <DateRangePicker
                                value={this.props.filterRange}
                                onChange={this.handleSelectFilterRange}
                                allowSingleDayRange={true}
                                shortcuts={[
                                    {
                                        dateRange: [undefined, undefined],
                                        label: 'No date range filter',
                                    },
                                    {
                                        dateRange: [moment().toDate(), moment().subtract(30, "day").toDate()],
                                        label: 'Past 30 days',
                                    },
                                    {
                                        dateRange: [moment().toDate(), moment().add(7, "day").toDate()],
                                        label: 'Next 7 days',
                                    },
                                    {
                                        dateRange: [moment().toDate(), moment().add(14, "day").toDate()],
                                        label: 'Next 14 days',
                                    },
                                    {
                                        dateRange: [moment().toDate(), moment().add(30, "day").toDate()],
                                        label: 'Next 30 days',
                                    },
                                    {
                                        dateRange: [moment().toDate(), moment().add(60, "day").toDate()],
                                        label: 'Next 60 days',
                                    },
                                    {
                                        dateRange: [moment().toDate(), moment().add(90, "day").toDate()],
                                        label: 'Next 90 days',
                                    },
                                    // {
                                    //     dateRange: [moment(moment().month()).day(0).toDate(), moment(moment().month()).day(moment().daysInMonth()-1).toDate()],
                                    //     label: `All of ${moment().month()}`
                                    // },
                                    // {
                                    //     dateRange: [moment(moment().month()).add(1, "month").day(0).toDate(), moment(moment().month()).add(1, "month").day(moment(moment().month()).add(1, "month").daysInMonth()-1).toDate()],
                                    //     label: `Next month`
                                    // },
                                ]}
                            />
                        </Popover>
                    </div>
                    {
                        this.props.allRoadClosureItems && 
                        <span>
                            Showing {this.props.allRoadClosureItems.length} of {this.props.totalItemCount} items.
                        </span>
                    }
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
                    {this.props.allRoadClosureItems && this.props.allRoadClosureItems.length > 0 && 
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
