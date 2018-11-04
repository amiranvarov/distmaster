import {

  FETCH_AGENTS_REQUST,
  FETCH_AGENTS_FAIL,
  FETCH_AGENTS_SUCCESS,

  SELECT_AGENT,
  UNSELECT_AGENT,

  APPROVE_AGENT_FAIL,
  APPROVE_AGENT_SUCCESS,
  APPROVE_AGENT_REQUEST,

  REJECT_AGENT_FAIL,
  REJECT_AGENT_REQUEST,
  REJECT_AGENT_SUCCESS,

  UPDATE_AGENT_REQUEST,
  UPDATE_AGENT_FAIL,
  UPDATE_AGENT_SUCCESS

} from '../actions/agents.action'

import _ from 'lodash'
import {update, deepUpdate} from 'immupdate'
import {UPDATE_CLIENT_FAIL, UPDATE_CLIENT_REQUEST, UPDATE_CLIENT_SUCCESS} from "../actions/clients.action";

const initialState = {
  loading: false,
  error: null,
  list: [],
  current: 0
};

export default (state = initialState, action) => {
  console.log('Action', action)
  switch (action.type) {
    case FETCH_AGENTS_REQUST:
      return {
        ...state,
        loading: true
      };
    case FETCH_AGENTS_SUCCESS:
      return {
        ...state,
        list: action.payload.list,
      };
    case FETCH_AGENTS_FAIL:
      return {
        ...state,
        error: action.payload
      };
    case SELECT_AGENT:
      return {
        ...state,
        selected: action.payload
      };

    case UNSELECT_AGENT:
      return {
        ...state,
        selected: null
      };

    case APPROVE_AGENT_SUCCESS:
      return {
        ...state,
        list: _.filter(state.list, function (f) { return f._id !== action.payload.agentId; }),
        selected: null
      };

    case REJECT_AGENT_SUCCESS:
      return {
        ...state,
        list: _.filter(state.list, function (f) { return f._id !== action.payload.agentId; }),
        selected: null
      };

    case UPDATE_AGENT_REQUEST:
      return {
        ...state,
        update: {
          requesting: true,
          error: null,
          success: false
        }
      };

    case UPDATE_AGENT_FAIL:
      return {
        ...state,
        update: {
          requesting: false,
          error: action.payload.error,
          success: false
        }
      };

    case UPDATE_AGENT_SUCCESS:
      const agenIndex = state.list.findIndex(agent => agent._id === action.payload.agent._id)

      state.list = deepUpdate(state.list)
        .at(agenIndex)
        .set(action.payload.agent);

      return {
        ...state,
        selected: null,
        update: {
          requesting: false,
          error: null,
          success: true
        }
      };


    default:
      return state
  }
}
