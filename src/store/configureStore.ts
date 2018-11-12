import { combineReducers } from "redux";
import { StateType } from 'typesafe-actions';

import {
    RoadClosureAction,
    roadClosureReducer
} from './road-closure';

export type RootAction = RoadClosureAction;

const rootReducer = combineReducers({
    roadClosure: roadClosureReducer,
});
export type RootState = StateType<typeof rootReducer>;


export default rootReducer;