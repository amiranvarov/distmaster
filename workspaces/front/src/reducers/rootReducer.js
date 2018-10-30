import { combineReducers } from 'redux';
import authReducer from './auth';
import ordersReducer from './order'
import clientsReducer from './client.reducer'

export default combineReducers({
    auth: authReducer,
    order: ordersReducer,
    client: clientsReducer
});
