import {
    IRoadClosureOutputFormatName,
} from '../models/RoadClosureOutputStateItem';
import { IRoadClosureState } from '../store/road-closure';
import { currentRoadClosureItemOutput } from './road-closure';

export const getFileNameFromOutputItem = (state: IRoadClosureState) => {
    if (isOutputItemEmpty(state)) { 
        return "";
    }
    let dynamicName = '';
    if (state.currentItem.properties.reference) {
        dynamicName += '-';
        dynamicName += state.currentItem.properties.reference;
    }
    if (state.currentItem.properties.description) {
        dynamicName += '-';
        dynamicName += state.currentItem.properties.description.substr(0, 10).split(" ").join("_");
    }
    // if (state.currentItem.properties.startTime) {
    //     dynamicName += '-';
    //     dynamicName += state.currentItem.properties.startTime.split(" ").join("-");
    // }
    // if (state.currentItem.properties.endTime) {
    //     dynamicName += '-';
    //     dynamicName += state.currentItem.properties.endTime.split(" ").join("-");
    // }
    dynamicName += '-';
    if (state.output.outputFormat === IRoadClosureOutputFormatName.waze) {
        return "sharedstreets-CIFS"+dynamicName+"road-closure.json";
    } else {
        return "sharedstreets"+dynamicName+"road-closure.geojson";
    }
}

export const isOutputItemEmpty = (state: IRoadClosureState) => {
    const item = currentRoadClosureItemOutput(state);
    if (state.output.outputFormat === IRoadClosureOutputFormatName.waze) {
        return item.incidents && item.incidents!.length === 0;
    } else {
        return item.features && item.features!.length === 0;
    }
}

export const getDataURIFromOutputItem = (state: IRoadClosureState) => {
    if (isOutputItemEmpty(state)) {
        return "";
    }

    return "data: text/json;charset=utf-8," + encodeURIComponent(getFormattedJSONStringFromOutputItem(state));
}

export const getFormattedJSONStringFromOutputItem = (state: IRoadClosureState, outputFormat?: IRoadClosureOutputFormatName) => {
    if (isOutputItemEmpty(state)) {
        return '';
    }
    let outputFormatName = state.output.outputFormat;
    if (outputFormat) {
        outputFormatName = outputFormat;
    }
    const item = currentRoadClosureItemOutput(state, outputFormatName);
    if (outputFormatName === IRoadClosureOutputFormatName.waze) {
        return JSON.stringify(item, null, 2);
    } else {
        return JSON.stringify(item, null, 2);
    }
} 