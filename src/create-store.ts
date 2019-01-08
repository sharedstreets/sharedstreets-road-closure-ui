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
            (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__({
                trace: true
            })
        )
    );

    return store;
}