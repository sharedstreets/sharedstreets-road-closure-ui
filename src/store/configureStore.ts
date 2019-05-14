import { combineReducers } from "redux";
import { StateType } from 'typesafe-actions';

import {
    ContextAction,
    contextReducer,
} from './context';
import {
    RoadClosureAction,
    roadClosureReducer
} from './road-closure';

export type RootAction = RoadClosureAction | ContextAction;
const rootReducer = combineReducers({
    context: contextReducer,
    roadClosure: roadClosureReducer,
});
export type RootState = StateType<typeof rootReducer>;


export default rootReducer;