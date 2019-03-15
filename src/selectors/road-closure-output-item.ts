import {
    IRoadClosureOutputFormatName,
} from 'src/models/RoadClosureOutputStateItem';
import { IRoadClosureState } from 'src/store/road-closure';
import { currentRoadClosureItemOutput } from './road-closure';

export const getFileNameFromOutputItem = (state: IRoadClosureState) => {
    if (isOutputItemEmpty(state)) { 
        return "";
    }
    if (state.output.outputFormat === IRoadClosureOutputFormatName.waze) {
        return "waze-cifs-sharedstreets-road-closure-data.json";
    } else {
        return "sharedstreets-road-closure-data.geojson";
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
        return JSON.stringify(item.incidents!, null, 2);
    } else {
        return JSON.stringify(item.features!, null, 2);
    }
}