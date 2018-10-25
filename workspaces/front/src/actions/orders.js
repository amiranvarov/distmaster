import axios from 'axios'

export const FETCH_ORDERS_REQUST = 'FETCH_ORDERS_REQUST';
export const FETCH_ORDERS_SUCCESS = 'FETCH_ORDERS_SUCCESS';
export const FETCH_ORDERS_FAIL = 'FETCH_ORDERS_FAIL';

export const SELECT_ORDER = 'SELECT_ORDER';
export const UNSELECT_ORDER = 'UNSELECT_ORDER';

// ORDER RESOLVE
export const APPROVE_ORDER_REQUEST = 'APPROVE_ORDER_REQUEST';
export const APPROVE_ORDER_SUCCESS = 'APPROVE_ORDER_SUCCESS';
export const APPROVE_ORDER_FAIL = 'APPROVE_ORDER_FAIL';

export const REJECT_ORDER_REQUEST = 'REJECT_ORDER_REQUEST';
export const REJECT_ORDER_SUCCESS = 'REJECT_ORDER_SUCCESS';
export const REJECT_ORDER_FAIL    = 'REJECT_ORDER_FAIL';


export const fetchOrders = (filter = {}) => async (dispatch) => {
  try {
    dispatch({
      type: FETCH_ORDERS_REQUST,
    });
    const {list, current} = (await axios.get('/orders', filter)).data;
    dispatch({
      type: FETCH_ORDERS_SUCCESS,
      payload: {
        list,
        current
      }
    })
  } catch (error) {
    dispatch({
      type: FETCH_ORDERS_FAIL,
      payload: error.response.data.error
    });
    throw error
  }
};

export const selectOrder = (order) => {
  return {
    type: SELECT_ORDER,
    payload: order
  }
};


export const unselectOrder = () => {
  return {
    type: UNSELECT_ORDER
  }
};

export const approveOrder = ({orderId, deliveryDate}) => async (dispatch) => {
  try {
    dispatch({
      type: APPROVE_ORDER_REQUEST,
    });
    await axios.post(`/orders/${orderId}/approve`, {deliveryDate});
    dispatch({
      type: APPROVE_ORDER_SUCCESS,
      payload: {
        orderId,
      }
    });
  } catch (error) {
    dispatch({
      type: APPROVE_ORDER_FAIL,
    });
    throw error
  }
};

export const rejectOrder = ({orderId, reason}) => async (dispatch) => {
  try {
    dispatch({
      type: REJECT_ORDER_REQUEST,
    });
    await axios.post(`/orders/${orderId}/reject`, { reason });
    dispatch({
      type: REJECT_ORDER_SUCCESS,
      payload: {
        orderId,
      }
    });
  } catch (error) {
    dispatch({
      type: REJECT_ORDER_FAIL,
    });
    throw error
  }
};
