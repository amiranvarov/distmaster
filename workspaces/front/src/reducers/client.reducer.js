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
  REJECT_CLIENT_FAIL

} from '../actions/clients.action'

import _ from 'lodash'

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

    default:
      return state
  }
}
