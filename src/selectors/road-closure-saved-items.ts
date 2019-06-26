import {
    sortBy,
    unzip,
    zip,
} from 'lodash';
import * as moment from 'moment';
import { IRoadClosureExplorerState } from 'src/store/road-closure-explorer';

export const sortRoadClosureSavedItemsByLastModified = (state: IRoadClosureExplorerState, sortOrder = 'ascending') => {
    if (
        state.allRoadClosureItems.length === 0 &&
        state.allRoadClosureMetadata.length === 0 &&
        state.allRoadClosuresUploadUrls.length === 0
    ) {
        return {
            allRoadClosureItems: [],
            allRoadClosureMetadata: [],
            allRoadClosuresUploadUrls: [],
        } 
    }

    const zipped = zip(
        state.allRoadClosureItems,
        state.allRoadClosureMetadata,
        state.allRoadClosuresUploadUrls,
    );
    
    let sorted: any[] = sortBy(zipped, (x) => x[1].lastModified);
    if (sortOrder === 'descending') {
        sorted = sorted.reverse();
    }
    const unzipped = unzip(sorted);
    return {
        allRoadClosureItems: unzipped[0],
        allRoadClosureMetadata: unzipped[1],
        allRoadClosuresUploadUrls: unzipped[2],
    }
};

export const filterRoadClosureSavedItems = (state: any, filterLevel = 'all') => {
    if (
        state.allRoadClosureItems.length === 0 &&
        state.allRoadClosureMetadata.length === 0 &&
        state.allRoadClosuresUploadUrls.length === 0
    ) {
        return {
            allRoadClosureItems: [],
            allRoadClosureMetadata: [],
            allRoadClosuresUploadUrls: [],
        } 
    }

    let zipped: any[] = zip(
        state.allRoadClosureItems,
        state.allRoadClosureMetadata,
        state.allRoadClosuresUploadUrls,
    );
    
    // let sorted: any[] = sortBy(zipped, (x) => x[1].lastModified);
    const now = moment();
    switch (filterLevel) {
        case 'current':
            zipped = zipped.filter((i) => {
                    return (i[0]!.properties.endTime && moment(i[0]!.properties.endTime).isSameOrAfter(now)) &&
                    (i[0]!.properties.startTime && moment(i[0]!.properties.startTime).isSameOrBefore(now))
                }
            );
            break;
        case 'past':
            zipped = zipped.filter((i) => moment(i[0]!.properties.endTime).isBefore(now));
            break;
        case 'scheduled':
            zipped = zipped.filter((i) => moment(i[0]!.properties.startTime).isAfter(now));
            break;
    }
    const unzipped = unzip(zipped);
    return {
        allRoadClosureItems: unzipped[0] ? unzipped[0] : [],
        allRoadClosureMetadata: unzipped[1] ? unzipped[1] : [],
        allRoadClosuresUploadUrls: unzipped[2] ? unzipped[2] : [],
    }
}