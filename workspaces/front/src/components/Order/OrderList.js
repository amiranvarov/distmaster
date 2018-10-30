import React from 'react'
import { connect } from 'react-redux'
import { Table } from 'reactstrap';
import * as moment from 'moment'
import { getOrderTotalPrice } from '../../utils/order'


import {fetchOrders, selectOrder} from '../../actions/orders'
import Status from '../Status'
import OrderDetail from './OrderDetail'

import './OrderList.css'

class OrderList extends React.Component {

  componentDidMount () {
    this.props.fetchOrders()
  }

  render () {
    const { orders, selectedOrder, selectOrder } = this.props
    return (
      <div style={{width: 800}}>
        <h1>Заказы</h1>
        <br />
        <br />
        <Table>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Клиент</th>
              <th>Регион</th>
              <th>Сумма</th>
              <th>Ф/О</th>
              <th>Cтатус</th>
            </tr>
          </thead>
          <tbody>
          {orders &&
            orders.map((order) => (
              <tr key={order._id} onClick={() => selectOrder(order)} className="OrderListItem">
                <td>
                  <div>{moment.unix(order.create_time).format('DD/MM/YYYY hh:mm')}</div>
                </td>
                <td>{order.user.shop.name}</td>
                <td>{order.user.shop.region}</td>
                <td>{getOrderTotalPrice(order.products, 'shop').toLocaleString()}</td>
                <td>{order.payment_type  == 'transfer' ? 'ПЕРЕЧ' : 'НАЛ'}</td>
                <th><Status status={order.status}/></th>
              </tr>
            ))
          }
          </tbody>
        </Table>

        {selectedOrder && <OrderDetail />}

      </div>
    )
  }
}



export default connect(state => {console.log('state', state); return {
  orders: state.order.list,
  selectedOrder: state.order.selected
}},
  {
    fetchOrders,
    selectOrder
  }
  )(OrderList)
