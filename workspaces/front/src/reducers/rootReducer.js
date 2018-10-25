import { combineReducers } from 'redux';
import authReducer from './auth';
import ordersReducer from './order'

export default combineReducers({
    auth: authReducer,
    order: ordersReducer,
});
