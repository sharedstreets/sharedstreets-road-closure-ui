import { lineString } from '@turf/helpers';
import { createSelector } from 'reselect';
import { RootState } from 'src/store/configureStore';

export const currentRoadClosureItemSelector = (state: RootState) => {
    return state.roadClosure.items[state.roadClosure.currentIndex];
};

export const linestringSelector = createSelector(
    currentRoadClosureItemSelector,
    (item) => {
        const coords: any = [];
        item.selectedPoints.forEach((v: any) => {
          coords.push([v.lng, v.lat])
        });
        const linestring = lineString(coords);
        return linestring;
    }
);