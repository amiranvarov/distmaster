import * as React from 'react'
import { connect } from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, Label, Input, Table, Row, Col } from 'reactstrap';
import {
  Card, CardBody
} from 'reactstrap'

import {unselectClient} from '../../actions/clients.action'
import ShopInfo from "./CustomerShopInfo";
import Status from "../Status";
import ApproveForm from "../Order/OrderApproveForm";
import Products from "../Order/Products";
import RejectForm from "../Order/OrderRejectForm";

class ClientDetail extends React.Component {

  toggle = () => {
    this.props.unselectClient();
  }

  render () {
    const { client } = this.props;
    const { shop } = client

    return (
      <Modal isOpen={true} className="modal-lg">
        <ModalHeader toggle={this.toggle}>

        </ModalHeader>
        <ModalBody>
          <Row>
            <Col xs={7}>
              <h5>Телеграм профиль</h5>
              <Table size="sm" borderless>
                <tr>
                  <td>Имя</td>
                  <td>{client.name}</td>
                </tr>
                <tr>
                  <td>Телефон</td>
                  <td>{client.phone}</td>
                </tr>
              </Table>

              <hr />
              <h5>Торговая точка</h5>
              <Table size="sm" borderless>
                <tr>
                  <td>Название</td>
                  <td>{shop.name}</td>
                </tr>
                <tr>
                  <td>Юр. Название</td>
                  <td>{shop.legal_name}</td>
                </tr>
                <tr>
                  <td>Регион</td>
                  <td>{shop.region}</td>
                </tr>
                <tr>
                  <td>Адрес</td>
                  <td>{shop.location_text}</td>
                </tr>
              </Table>

              <hr />
              <h5>Банк</h5>
              <Table size="sm" borderless>
                <tr>
                  <td>Название</td>
                  <td>{shop.bank_name}</td>
                </tr>
                <tr>
                  <td>Расч/счет</td>
                  <td>{shop.bank_account_number}</td>
                </tr>
                <tr>
                  <td>МФО</td>
                  <td>{shop.mfo}</td>
                </tr>
                <tr>
                  <td>ОКЭД</td>
                  <td>{shop.oked}</td>
                </tr>
                <tr>
                  <td>ИНН</td>
                  <td>{shop.inn}</td>
                </tr>
              </Table>

              <hr />
              <h5>Договор</h5>
              <Table size="sm" borderless>
                <tr>
                  <td>Номер</td>
                  <td>{shop.contract_number}</td>
                </tr>
                <tr>
                  <td>От</td>
                  <td>{client.create_time}</td>
                </tr>
              </Table>
            </Col>

            <Col>
              hey
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    )
  }
}


export default connect((state) => ({
  client: state.client.list[state.client.selected]
}), {unselectClient})(ClientDetail);
