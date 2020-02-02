import { combineReducers } from 'redux';
import ActiveUserReducer from './reducer_active_user';
import LeaveTypes from './reducer_leave_types';

const rootReducer = combineReducers({
    activeUser: ActiveUserReducer,
    leaveTypes: LeaveTypes
});

export default rootReducer;
