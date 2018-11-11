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
import {deepUpdate} from "immupdate";

const initialState = {
  loading: false,
  error: null,
  list: [],
  current: 0
};


export default (state = initialState, action) => {

  let orderIndex = null;

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
        page: action.payload.page,
        total: action.payload.total,
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
      orderIndex = state.list.findIndex(order => order._id === action.payload.orderId);
      state.list = deepUpdate(state.list)
        .at(orderIndex)
        .at('status')
        .set('approve');

      return {
        ...state,
        selected: null
      };

    case REJECT_ORDER_SUCCESS:
      orderIndex = state.list.findIndex(order => order._id === action.payload.orderId);
      state.list = deepUpdate(state.list)
        .at(orderIndex)
        .at('status')
        .set('reject');
      return {
        ...state,
        selected: null
      };

    default:
      return state
  }
}
