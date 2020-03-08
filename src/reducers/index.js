import { combineReducers } from 'redux';
import ActiveUserReducer from './reducer_active_user';

const rootReducer = combineReducers({
    activeUser: ActiveUserReducer,
});

export default rootReducer;
