import axios from 'axios'

export const LOGIN_REQUST = 'LOGIN_REQUST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';

export const LOG_OUT = 'LOG_OUT';


export  const login = (credentials) => async (dispatch) => {
    try {
        dispatch({
            type: LOGIN_REQUST,
        });
        await axios.post('/api/auth', credentials);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: {
                username: 'amir.anvarov'
            }
        })
    } catch (error) {
        dispatch({
            type: LOGIN_FAIL,
            payload: error.response.data.error
        })
    }
};

export const logOut = () => async (dispatch) => {
  dispatch({
    type: LOG_OUT
  })
}
