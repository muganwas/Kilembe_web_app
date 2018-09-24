import { combineReducers, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
//import logger from 'redux-logger';
import promise from 'redux-promise-middleware';
import genInfoReducer from './redux/reducers/genInfoReducer';

const middleware = applyMiddleware(promise(), thunk);
const allReducers = combineReducers({
    genInfo: genInfoReducer
})
const store = createStore(
    allReducers, 
    middleware 
)

export default store