import * as H from 'history';
import { Dispatch } from 'redux';
import {
    ActionType,
    createAsyncAction,
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
};

export const CONTEXT_ACTIONS = {
    HIDE_MESSAGE: createStandardAction('CONTEXT/HIDE_MESSAGE')<boolean>(),
    LOG_IN: createAsyncAction(
        'CONTEXT/LOG_IN_REQUEST',
        'CONTEXT/LOG_IN_SUCCESS',
        'CONTEXT/LOG_IN_FAILURE'
    )<void, any, Error>(),
    LOG_OUT: createAsyncAction(
        'CONTEXT/LOG_OUT_REQUEST',
        'CONTEXT/LOG_OUT_SUCCESS',
        'CONTEXT/LOG_OUT_FAILURE'
    )<void, void, Error>(),
    SET_ORG_NAME: createStandardAction('CONTEXT/SET_ORG_NAME')<string>(),
    SHOW_MESSAGE: createStandardAction('CONTEXT/SHOW_MESSAGE')<IContextMessage>(),
};

// side effects
export const login = (username: string, password: string, history: H.History) => (dispatch: Dispatch<any>, getState: any) => {
    const fakeFetch = () => {
        return {
            namespace: "PANYNJ"
        }
    };

    return Promise.resolve(fakeFetch())
    .then((response) => {
        dispatch(CONTEXT_ACTIONS.LOG_IN.success(response));
        history.push(`/${response.namespace}/`);
    });
};

export const logout = () => (dispatch: Dispatch<any>, getState: any) => {
    return dispatch(CONTEXT_ACTIONS.LOG_OUT.success());
};

// reducer 
export interface IContextState {
    authToken: string,
    isLoggedIn: boolean,
    isLoggingIn: boolean,
    message: IContextMessage,
    orgName: string,
};

const defaultState: IContextState = {
    authToken: '',
    isLoggedIn: false,
    isLoggingIn: false,
    message: {
        intent: "none",
        text: '',
    },
    orgName: '',
};

export const contextReducer = (state: IContextState = defaultState, action: ContextAction) => {
    // let updatedItem: SharedStreetsMatchGeomFeatureCollection;
    switch (action.type) {
        case 'CONTEXT/LOG_IN_SUCCESS': 
            return {
                ...state,
                isLoggedIn: true,
                orgName: action.payload.namespace
            };
        
        case 'CONTEXT/LOG_OUT_SUCCESS': 
            return {
                ...state,
                isLoggedIn: false
            };

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