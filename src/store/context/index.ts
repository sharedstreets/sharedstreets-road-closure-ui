//  import { Dispatch } from 'redux';
import {
    ActionType,
    // createAsyncAction,
    createStandardAction,
} from 'typesafe-actions';
// import { v4 as uuid } from 'uuid';
// import { v4 } from '../../utils/uuid-regex';
// import { fetchAction } from '../api';
// import { RootState } from '../configureStore';




// actions
export type ContextAction = ActionType<typeof CONTEXT_ACTIONS>;

export interface IContextMessage {
    text: string;
    intent: string;
}

export const CONTEXT_ACTIONS = {
    HIDE_MESSAGE: createStandardAction('CONTEXT/HIDE_MESSAGE')<boolean>(),
    SET_ORG_NAME: createStandardAction('CONTEXT/SET_ORG_NAME')<string>(),
    SHOW_MESSAGE: createStandardAction('CONTEXT/SHOW_MESSAGE')<IContextMessage>(),
};

// side effects
// reducer
export interface IContextState {
    message: IContextMessage,
    orgName: string,
};

const defaultState: IContextState = {
    message: {
        intent: "none",
        text: '',
    },
    orgName: '',
};

export const contextReducer = (state: IContextState = defaultState, action: ContextAction) => {
    // let updatedItem: SharedStreetsMatchGeomFeatureCollection;
    switch (action.type) {
        case 'CONTEXT/SHOW_MESSAGE':
            return {
                ...state,
                message: action.payload
            };

        case 'CONTEXT/HIDE_MESSAGE':
            return {
                ...state,
                message: {
                    intent: 'none',
                    text: '',
                }
            };
        case 'CONTEXT/SET_ORG_NAME':
            return {
                ...state,
                orgName: action.payload
            }

        default:
            return state;
    }
};