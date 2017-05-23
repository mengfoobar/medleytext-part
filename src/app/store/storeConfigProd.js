import { createStore } from 'redux';
import rootReducer from '../reducers';

// Middleware you want to use in production:

export default function configureStore(initialState) {
    return createStore(rootReducer, initialState);
};