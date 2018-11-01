import {
  FETCH_CLIENTS_FAIL,
  FETCH_CLIENTS_SUCCESS,
  FETCH_CLIENTS_REQUST,

  SELECT_CLIENT,
  UNSELECT_CLIENT,

  APPROVE_CLIENT_REQUEST,
  APPROVE_CLIENT_FAIL,
  APPROVE_CLIENT_SUCCESS,

  REJECT_CLIENT_REQUEST,
  REJECT_CLIENT_SUCCESS,
  REJECT_CLIENT_FAIL,

  UPDATE_CLIENT_REQUEST,
  UPDATE_CLIENT_SUCCESS,
  UPDATE_CLIENT_FAIL

} from '../actions/clients.action'

import _ from 'lodash'
import {update, deepUpdate} from 'immupdate'

const initialState = {
  loading: false,
  error: null,
  list: [],
  current: 0
};

export default (state = initialState, action) => {

  switch (action.type) {
    case FETCH_CLIENTS_REQUST:
      return {
        ...state,
        loading: true
      };
    case FETCH_CLIENTS_SUCCESS:
      return {
        ...state,
        list: action.payload.list,
        page: action.payload.page,
        total: action.payload.total,
      };
    case FETCH_CLIENTS_FAIL:
      return {
        ...state,
        error: action.payload
      };
    case SELECT_CLIENT:
      return {
        ...state,
        selected: action.payload
      };

    case UNSELECT_CLIENT:
      return {
        ...state,
        selected: null
      };

    case APPROVE_CLIENT_SUCCESS:
      return {
        ...state,
        list: _.filter(state.list, function (f) { return f._id !== action.payload.orderId; }),
        selected: null
      };

    case REJECT_CLIENT_SUCCESS:
      return {
        ...state,
        list: _.filter(state.list, function (f) { return f._id !== action.payload.orderId; }),
        selected: null
      };

    case UPDATE_CLIENT_REQUEST:
      return {
        ...state,
        update: {
          requesting: true,
          error: null,
          success: false
        }
      };

    case UPDATE_CLIENT_FAIL:
      return {
        ...state,
        update: {
          requesting: false,
          error: action.payload.error,
          success: false
        }
      };

    case UPDATE_CLIENT_SUCCESS:
      const clientIndex = state.list.findIndex(client => client._id === action.payload.client._id)

      state.list = deepUpdate(state.list)
        .at(clientIndex)
        .set(action.payload.client);

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
