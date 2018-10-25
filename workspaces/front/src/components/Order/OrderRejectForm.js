import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, Label, Input, Tex } from 'reactstrap';
import ShopInfo from "../Customer/CustomerShopInfo";
import OrderStatus from "./OrderStatus";
import ApproveForm from "./OrderApproveForm";
import Products from "./Products";
import { connect } from 'react-redux'
import { rejectOrder } from '../../actions/orders'

class OrderRejectForm extends React.Component {

  state = {
    reason: ''
  };

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.rejectOrder({
      userId: this.props.selectedOrder._id,
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

    return (
      <Modal isOpen={this.props.isOpen}>
        <ModalHeader toggle={this.handleClose}>
          Детали заказа
        </ModalHeader>
        <ModalBody>
          <form onSubmit={this.handleSubmit}>
            <Label>Причина отказа</Label>
            <Input type="textarea" onChange={this.handleChange} style={{marginBottom: 12}}/>
          </form>
          <Button color="danger" type={"submit"} block>Отклонить</Button>
        </ModalBody>
      </Modal>
    )
  }
}


export default connect(null, {
  rejectOrder
})(OrderRejectForm)
