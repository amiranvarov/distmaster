import {
  FETCH_ORDERS_FAIL,
  FETCH_ORDERS_SUCCESS,
  FETCH_ORDERS_REQUST,

  SELECT_ORDER,
  UNSELECT_ORDER,

  APPROVE_ORDER_REQUEST,
  APPROVE_ORDER_FAIL,
  APPROVE_ORDER_SUCCESS,

  REJECT_ORDER_REQUEST,
  REJECT_ORDER_SUCCESS,
  REJECT_ORDER_FAIL

} from '../actions/orders'

import _ from 'lodash'

const initialState = {
  loading: false,
  error: null,
  list: [],
  current: 0
};

export default (state = initialState, action) => {

  switch (action.type) {
    case FETCH_ORDERS_REQUST:
      return {
        ...state,
        loading: true
      };
    case FETCH_ORDERS_SUCCESS:
      return {
        ...state,
        list: action.payload.list,
        current: action.payload.current
      };
    case FETCH_ORDERS_FAIL:
      return {
        ...state,
        error: action.payload
      };
    case SELECT_ORDER:
      return {
        ...state,
        selected: action.payload
      };

    case UNSELECT_ORDER:
      return {
        ...state,
        selected: null
      };

    case APPROVE_ORDER_SUCCESS:
      return {
        ...state,
        list: _.filter(state.list, function (f) { return f._id !== action.payload.orderId; }),
        selected: null
      };

    case REJECT_ORDER_SUCCESS:
      return {
        ...state,
        list: _.filter(state.list, function (f) { return f._id !== action.payload.orderId; }),
        selected: null
      };

    default:
      return state
  }
}
