import React from 'react'
import * as moment from 'moment'
import { Button, Label, Input } from 'reactstrap';
import {connect} from 'react-redux'

import {approveOrder} from '../../actions/orders'



class OrderApproveForm extends React.Component {

  state = {
    date: moment().add(1, 'day').format('YYYY-MM-DD')
  };

  handleSubmit = (e) => {
    e.preventDefault()

    this.props.approveOrder({
      orderId: this.props.selectedOrder._id,
      deliveryDate: this.state.date
    })
  }

  handleDateChange = (e) => {
    this.setState({
      date: e.target.value
    })
  }

  render () {

    return (
      <form onSubmit={this.handleSubmit}>
        <Label>Дата доставки</Label>
        <Input type={"date"} style={{marginBottom: 12}} value={this.state.date} onChange={this.handleDateChange}/>
        <Button block color={"success"} type="submit">Одобрить</Button>
      </form>
    )
  }
}

export default connect(state => ({
  selectedOrder: state.order.list[state.order.selected]
}), {approveOrder})(OrderApproveForm)
