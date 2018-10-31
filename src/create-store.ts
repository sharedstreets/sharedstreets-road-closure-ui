import {
    applyMiddleware,
    compose,
    createStore,
} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './store/configureStore';

export default () => {
    const store = createStore(
        rootReducer,
        compose (
            applyMiddleware(thunk),
            (window as any).devToolsExtension ? (window as any).devToolsExtension() : (f: any) => f
        )
    );

    return store;
}