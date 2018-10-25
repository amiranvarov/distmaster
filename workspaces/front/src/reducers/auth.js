import {
  LOGIN_REQUST,
  LOGIN_FAIL,
  LOGIN_SUCCESS, LOG_OUT
} from '../actions/auth'

const initialState = {
    loading: false,
    error: null,
    loggedIn: false,
};

export default (state = initialState, action) => {

    console.log('Auth action', action)
    switch (action.type) {
        case LOGIN_REQUST:
            return {
                ...state,
            };
        case LOGIN_FAIL:
            return {
                ...state,
                error: action.payload
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                loggedIn: true,
                user: action.payload
            };

      case LOG_OUT:
        return {
          ...state,
          loggedIn: false,
        };
      default:
            return state
    }
}
