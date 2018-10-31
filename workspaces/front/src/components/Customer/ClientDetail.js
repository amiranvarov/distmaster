import * as React from 'react'
import { connect } from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, Label, Input, Table, Row, Col } from 'reactstrap';
import {
  Card, CardBody
} from 'reactstrap'
import { Field, reduxForm } from 'redux-form'
import './ClientDetail.css'

import {unselectClient, updateClient} from '../../actions/clients.action'
import ShopInfo from "./CustomerShopInfo";
import Status from "../Status";
import ApproveForm from "../Order/OrderApproveForm";
import Products from "../Order/Products";
import RejectForm from "../Order/OrderRejectForm";

class ClientDetail extends React.Component {

  toggle = () => {
    this.props.unselectClient();
  }

  componentDidMount = () => {
    const { load } = this.props;

  }


  render () {
    console.log('Props', this.props)
    const {
      client,
      handleSubmit,
      submitting,
      error,
      submitFailed,
    } = this.props;
    const { shop } = client

    return (
      <Modal isOpen={true} className="modal-lg">
        <ModalHeader toggle={this.toggle}>

        </ModalHeader>
        <ModalBody className="client-detail">
          <Row>
            <Col xs={7}>
              <form onSubmit={handleSubmit}>
                <h5>Телеграм профиль</h5>
                <Table size="sm" borderless>
                  <tbody>
                    <tr>
                      <td>Имя</td>
                      <td>
                        <Field
                          name="name"
                          component={"input"}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Телефон</td>
                      <td>{client.phone}</td>
                    </tr>
                  </tbody>
                </Table>

                <hr />
                <h5>Торговая точка</h5>
                <Table size="sm" borderless>
                  <tbody>
                    <tr>
                      <td>Название</td>
                      <td>
                        <Field
                          name="shop.name"
                          component="input"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Юр. Название</td>
                      <td>
                        <Field
                          name="shop.legal_name"
                          component="input"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Регион</td>
                      <td>
                        <Field
                          name="shop.region"
                          component="select"
                        >
                          <option value="Ахангаран">Ахангаран</option>
                          <option value="Алмалык">Алмалык</option>
                          <option value="Ангрен">Ангрен</option>
                          <option value="Пискент">Пискент</option>
                          <option value="Бука">Бука</option>
                          <option value="Нурафшан (Туйтепа)">Нурафшан (Туйтепа)</option>
                        </Field>
                      </td>
                    </tr>
                    <tr>
                      <td>Адрес</td>
                      <td>
                        <Field
                          name="shop.location_text"
                          component="textarea"
                        />
                      </td>
                    </tr>
                  </tbody>
                </Table>

                <hr />
                <h5>Банк</h5>
                <Table size="sm" borderless>
                  <tbody>
                    <tr>
                      <td>Название</td>
                      <td>
                        <Field
                          name="shop.bank_name"
                          component="input"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Расч/счет</td>
                      <td>
                        <Field
                          name="shop.bank_account_number"
                          component="input"
                        />
                       </td>
                    </tr>
                    <tr>
                      <td>МФО</td>
                      <td>
                        <Field
                          name="shop.mfo"
                          component="input"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>ОКЭД</td>
                      <td>
                        <Field
                          name="shop.oked"
                          component="input"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>ИНН</td>
                      <td>
                        <Field
                          name="shop.inn"
                          component="input"
                        />
                      </td>
                    </tr>
                  </tbody>
                </Table>

                <hr />
                <h5>Договор</h5>
                <Table size="sm" borderless>
                  <tbody>
                    <tr>
                      <td>Номер</td>
                      <td>
                        <Field
                          name="shop.contract_number"
                          component="input"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>От</td>
                      <td>
                        <Field
                          name="create_time"
                          component="input"
                        />
                      </td>
                    </tr>
                  </tbody>
                </Table>
                <input type={"submit"} value={"Отправить"} />
              </form>
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



const onSubmit = (data, dispatch, { form }) => {
  console.log('Data', data)
  dispatch(updateClient({ meta: { form }, data }))
}

const ClientDetailForm = reduxForm({
  form: 'clientDetail',
  onSubmit
  // enableReinitialize: true,
})(ClientDetail);


export default connect((state) => ({
  initialValues: state.client.list[state.client.selected],
  client: state.client.list[state.client.selected]
}), {unselectClient})(ClientDetailForm);
