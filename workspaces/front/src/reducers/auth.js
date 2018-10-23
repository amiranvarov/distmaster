import {
    LOGIN_REQUST,
    LOGIN_FAIL,
    LOGIN_SUCCESS
} from '../actions/auth'

const initialState = {
    loading: false,
    error: null,
    loggedIn: false,
};

export default (state = {}, action) => {
    switch (action.type) {
        case LOGIN_REQUST:
            return {
                ...initialState,
            };
        case LOGIN_FAIL:
            return {
                ...initialState,
                error: action.payload
            };
        case LOGIN_SUCCESS:
            return {
                ...initialState,
                loggedIn: true,
                user: action.payload
            };
        default:
            return initialState
    }
}
