export const isValidGeoJSONFile = (obj: any): boolean => {
    if (!obj.type) {
        return false;
    }

    if (obj.type !== "FeatureCollection") {
        return false;
    }

    return true;
}