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
import {
    RoadClosureExplorerAction,
    roadClosureExplorerReducer
} from './road-closure-explorer';

export type RootAction = RoadClosureAction | RoadClosureExplorerAction | ContextAction;
const rootReducer = combineReducers({
    context: contextReducer,
    roadClosure: roadClosureReducer,
    roadClosureExplorer: roadClosureExplorerReducer,
});
export type RootState = StateType<typeof rootReducer>;


export default rootReducer;