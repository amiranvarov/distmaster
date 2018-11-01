import axios from 'axios'

export const FETCH_CLIENTS_REQUST = 'FETCH_CLIENTS_REQUST';
export const FETCH_CLIENTS_SUCCESS = 'FETCH_CLIENTS_SUCCESS';
export const FETCH_CLIENTS_FAIL = 'FETCH_CLIENTS_FAIL';

export const SELECT_CLIENT = 'SELECT_CLIENT';
export const UNSELECT_CLIENT = 'UNSELECT_CLIENT';

// ORDER RESOLVE
export const APPROVE_CLIENT_REQUEST = 'APPROVE_CLIENT_REQUEST';
export const APPROVE_CLIENT_SUCCESS = 'APPROVE_CLIENT_SUCCESS';
export const APPROVE_CLIENT_FAIL = 'APPROVE_CLIENT_FAIL';

export const REJECT_CLIENT_REQUEST = 'REJECT_CLIENT_REQUEST';
export const REJECT_CLIENT_SUCCESS = 'REJECT_CLIENT_SUCCESS';
export const REJECT_CLIENT_FAIL    = 'REJECT_CLIENT_FAIL';

export const UPDATE_CLIENT_REQUEST = 'UPDATE_CLIENT_REQUEST';
export const UPDATE_CLIENT_SUCCESS = 'UPDATE_CLIENT_SUCCESS';
export const UPDATE_CLIENT_FAIL    = 'UPDATE_CLIENT_FAIL';


export const fetchClients = (options = {}) => async (dispatch) => {
  try {
    dispatch({
      type: FETCH_CLIENTS_REQUST,
    });
    const {list, page, total} = (await axios.get('/api/clients', {params: options})).data;
    dispatch({
      type: FETCH_CLIENTS_SUCCESS,
      payload: {
        list,
        page,
        total
      }
    })
  } catch (error) {
    dispatch({
      type: FETCH_CLIENTS_FAIL,
      payload: error.response.data.error
    });
    throw error
  }
};

export const selectClient = (index) => {
  return {
    type: SELECT_CLIENT,
    payload: index
  }
};


export const unselectClient = () => {
  return {
    type: UNSELECT_CLIENT
  }
};

export const approveClient = ({clientId}) => async (dispatch) => {
  try {
    dispatch({
      type: APPROVE_CLIENT_REQUEST,
    });
    await axios.post(`/api/clients/${clientId}/approve`);
    dispatch({
      type: APPROVE_CLIENT_SUCCESS,
      payload: {
        clientId,
      }
    });
  } catch (error) {
    dispatch({
      type: APPROVE_CLIENT_FAIL,
    });
    throw error
  }
};

export const rejectClient = ({clientId, reason}) => async (dispatch) => {
  try {
    dispatch({
      type: REJECT_CLIENT_REQUEST,
    });
    await axios.post(`/api/client/${clientId}/reject`, { reason });
    dispatch({
      type: REJECT_CLIENT_SUCCESS,
      payload: {
        clientId,
      }
    });
  } catch (error) {
    dispatch({
      type: REJECT_CLIENT_FAIL,
    });
    throw error
  }
};

export const updateClient = ({meta: form, data}) => async  dispatch => {
  try {
    dispatch({
      type: UPDATE_CLIENT_REQUEST,
    });
    const response = await axios.put(`/api/clients/${data._id}`, data);
    dispatch({
      type: UPDATE_CLIENT_SUCCESS,
      payload: {
        client: response.data,
      }
    });
  } catch (error) {
    dispatch({
      type: UPDATE_CLIENT_FAIL,
    });
    throw error
  }
}
