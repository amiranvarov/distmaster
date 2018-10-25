import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, Label, Input, Tex, Alert } from 'reactstrap';
import ShopInfo from "../Customer/CustomerShopInfo";
import OrderStatus from "./OrderStatus";
import ApproveForm from "./OrderApproveForm";
import Products from "./Products";
import { connect } from 'react-redux'
import { rejectOrder } from '../../actions/orders'

class OrderRejectForm extends React.Component {

  state = {
    reason: '',
    error: null
  };

  handleSubmit = (e) => {
    e.preventDefault();


    if(this.state.reason.trim().length < 5) {
      return this.setState({error: 'Кажется вы не указали причину отказа'})
    }

    this.props.rejectOrder({
      orderId: this.props.selectedOrder._id,
      reason: this.state.reason
    })
  };

  handleChange = (e) => {
    this.setState({
      reason: e.target.value
    })
  };

  handleClose = () => {
    this.props.onClose();
  }

  render () {
    const { error } = this.state;

    return (
      <Modal isOpen={this.props.isOpen}>
        <ModalHeader toggle={this.handleClose}>
          Детали заказа
        </ModalHeader>
        <ModalBody>
          <form onSubmit={this.handleSubmit}>
            {error && <Alert color={"danger"}>{error}</Alert>}
            <Label>Причина отказа</Label>
            <Input type="textarea" value={this.state.reason} onChange={this.handleChange} style={{marginBottom: 12}}/>
            <Button color="danger" type={"submit"} block>Отклонить</Button>
          </form>
        </ModalBody>
      </Modal>
    )
  }
}


export default connect(state => ({
  selectedOrder: state.order.selected
}), {
  rejectOrder
})(OrderRejectForm)
