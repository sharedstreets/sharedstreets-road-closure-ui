import { Reducer } from 'redux';
import { RoadClosureStateItem } from 'src/models/road-closure';
 import {
     ActionType,
     createAction
} from 'typesafe-actions';


// actions
export const ACTIONS = {
    POINT_SELECTED: createAction('ROAD_CLOSURE_MAP/POINT_SELECTED'),
    VIEWPORT_CHANGED: createAction('ROAD_CLOSURE_MAP/VIEWPORT_CHANGED'),
};
export type RoadClosureAction = ActionType<typeof ACTIONS>;

// side effects

// reducer
export interface IRoadClosureState {
    current: RoadClosureStateItem | {},
    items: RoadClosureStateItem[],
};

const defaultState : IRoadClosureState = {
    current: {},
    items: [],
};

export const roadClosureReducer: Reducer<IRoadClosureState> = (state: IRoadClosureState = defaultState, action: RoadClosureAction) => {
    switch (action.type) {
        default:
            return state;
    }
}