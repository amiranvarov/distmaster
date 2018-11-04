import axios from 'axios'
import _ from 'lodash'
import {UPDATE_CLIENT_FAIL, UPDATE_CLIENT_REQUEST, UPDATE_CLIENT_SUCCESS} from "./clients.action";

export const FETCH_AGENTS_REQUST = 'FETCH_AGENTS_REQUST';
export const FETCH_AGENTS_SUCCESS = 'FETCH_AGENTS_SUCCESS';
export const FETCH_AGENTS_FAIL = 'FETCH_AGENTS_FAIL';

export const SELECT_AGENT = 'SELECT_AGENT';
export const UNSELECT_AGENT = 'UNSELECT_AGENT';

// ORDER RESOLVE
export const APPROVE_AGENT_REQUEST = 'APPROVE_AGENT_REQUEST';
export const APPROVE_AGENT_SUCCESS = 'APPROVE_ORDER_SUCCESS';
export const APPROVE_AGENT_FAIL = 'APPROVE_ORDER_FAIL';

export const REJECT_AGENT_REQUEST = 'REJECT_AGENT_REQUEST';
export const REJECT_AGENT_SUCCESS = 'REJECT_AGENT_SUCCESS';
export const REJECT_AGENT_FAIL    = 'REJECT_AGENT_FAIL';

export const UPDATE_AGENT_REQUEST = 'UPDATE_AGENT_REQUEST';
export const UPDATE_AGENT_SUCCESS = 'UPDATE_AGENT_SUCCESS';
export const UPDATE_AGENT_FAIL    = 'UPDATE_AGENT_FAIL';


export const fetchAgents = (filter = {}) => async (dispatch) => {
  try {
    dispatch({
      type: FETCH_AGENTS_REQUST,
    });
    const {list} = (await axios.get('/api/agents', filter)).data;
    dispatch({
      type: FETCH_AGENTS_SUCCESS,
      payload: {
        list,
      }
    })
  } catch (error) {
    dispatch({
      type: FETCH_AGENTS_FAIL,
      payload: _.get(error, 'response.data.error')
    });
    throw error
  }
};

export const selectAgent= (index) => {
  return {
    type: SELECT_AGENT,
    payload: index
  }
};


export const unselectAgent = () => {
  return {
    type: UNSELECT_AGENT
  }
};

export const approveAgent = ({agentId, region }) => async (dispatch) => {
  try {
    dispatch({
      type: APPROVE_AGENT_REQUEST,
    });
    await axios.post(`/api/agents/${agentId}/approve`, {region});
    dispatch({
      type: APPROVE_AGENT_SUCCESS,
      payload: {
        agentId,
      }
    });
  } catch (error) {
    dispatch({
      type: APPROVE_AGENT_FAIL,
    });
    throw error
  }
};

export const rejectAgent = ({agentId, reason}) => async (dispatch) => {
  try {
    dispatch({
      type: REJECT_AGENT_REQUEST,
    });
    await axios.post(`/api/orders/${agentId}/reject`, { reason });
    dispatch({
      type: REJECT_AGENT_REQUEST,
      payload: {
        agentId,
      }
    });
  } catch (error) {
    dispatch({
      type: REJECT_AGENT_FAIL,
    });
    throw error
  }
};

export const updateAgent = ({meta: form, data}) => async  dispatch => {
  try {
    dispatch({
      type: UPDATE_AGENT_REQUEST,
    });
    const response = await axios.put(`/api/agents/${data._id}`, data);
    dispatch({
      type: UPDATE_AGENT_SUCCESS,
      payload: {
        agent: response.data,
      }
    });
  } catch (error) {
    dispatch({
      type: UPDATE_AGENT_FAIL,
    });
    throw error
  }
}
