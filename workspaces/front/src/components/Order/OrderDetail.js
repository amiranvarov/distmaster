import React from 'react'
import { connect } from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, Label, Input } from 'reactstrap';
import {
  Row, Col, Card, CardBody
} from 'reactstrap'

import {unselectOrder} from '../../actions/orders'

import ShopInfo from '../Customer/CustomerShopInfo'
import CustomerContactInfo from '../Customer/CustomerContactInfo'
import OrderStatus from './OrderStatus'
import ApproveForm from './OrderApproveForm'
import RejectForm from './OrderRejectForm'
import Products from './Products'



class OrderDetail extends React.Component {

  state = {
    rejectFormVisible: false
  }

  toggle = () => {
    this.props.unselectOrder();
  }

  toggleRejectForm = () => {
    this.setState({rejectFormVisible: !this.state.rejectFormVisible})
  }

  render () {
    const { order } = this.props;

    return (
      <Modal isOpen={true} className="modal-lg">
        <ModalHeader toggle={this.toggle}>
          Детали заказа
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <ShopInfo user={order.user} />
            </Col>
            <Col>
              <Card>
                <CardBody>
                  <Row>
                    <Col>
                      <h2>Заказ</h2>
                    </Col>
                    <Col>
                      {order.status === 'review' && <Button outline color="danger" className={"float-right"} size={"sm"} onClick={this.toggleRejectForm}>Отменить</Button>}
                    </Col>
                  </Row>
                  <div>
                    <small><strong>Форма оплаты:</strong></small> {order.payment_type === 'transfer'? ' Перечисленые' : 'Наличные'}
                  </div>
                  {order.payment_type === 'transfer' && (
                    <div>
                      <small><strong>Номер договора:</strong></small> {order.invoice_id}
                    </div>
                  )}
                  <div>
                    <small><strong>Статус:</strong></small> {" "}
                    <OrderStatus status={order.status} />
                  </div>
                  <hr />
                  {order.status == 'review' && <ApproveForm />}
                </CardBody>
              </Card>
            </Col>
          </Row>
          <br />
          <h3>Товары</h3>
          <Products products={order.products} />

          <RejectForm isOpen={this.state.rejectFormVisible} onClose={this.toggleRejectForm}/>
        </ModalBody>
      </Modal>
    )
  }
}

export default connect((state) => ({
  order: state.order.selected
}), {unselectOrder})(OrderDetail);

