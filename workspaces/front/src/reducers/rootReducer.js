import { combineReducers } from 'redux';
import authReducer from './auth';
import ordersReducer from './order'
import clientsReducer from './client.reducer'
import agentReducer from './agent.reducer'
import { reducer as formReducer } from 'redux-form'

export default combineReducers({
    auth: authReducer,
    order: ordersReducer,
    client: clientsReducer,
  agent: agentReducer,
  form: formReducer
});
