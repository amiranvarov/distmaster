import React from 'react'
import { connect } from 'react-redux'
import { Table } from 'reactstrap';
import * as moment from 'moment'
import { getOrderTotalPrice } from '../../utils/order'


import {fetchOrders, selectOrder} from '../../actions/orders'
import Status from '../Status'
import OrderDetail from './OrderDetail'

import './OrderList.css'
import OrderTable from "../Order/OrdersTable";

class OrderList extends React.Component {

  componentDidMount () {
    // this.props.fetchOrders()
  }

  handleTableChange = (type, state) => {
    const transformedFilter = {};
    for (let key in state.filters) {
      const value = state.filters[key].filterVal;
      if (value.trim() == '') {
        return false;
      }
      // const indexOfFirstDot =  key.indexOf('.');
      // const restOfName = key.substr(indexOfFirstDot +1, key.length)

      transformedFilter[key] = value
    }

    this.props.fetchOrders({
      filter: transformedFilter,
      page: state.page
    })
  };

  onSelect = (customer, index) => {
    this.props.selectOrder(index)
  };

  render () {
    const { list, page, total, selectedOrder } = this.props
    return (
      <div>
        <h1>Заказы</h1>
        <br />
        <br />
        {list && (
          <OrderTable
            data={list}
            page={page}
            sizePerPage={50}
            onTableChange={this.handleTableChange}
            totalSize={total}
            onSelect={this.onSelect}
          />
        )}

        {selectedOrder && <OrderDetail />}

      </div>
    )
  }
}



export default connect(state => {console.log('state', state); return {

    list: state.order.list,
    total: state.order.total,
    page: state.order.page,
    selectedOrder: state.order.list[state.order.selected]
}},
  {
    fetchOrders,
    selectOrder
  }
  )(OrderList)
