import * as React from 'react'
import {connect} from 'react-redux'
import { Modal, ModalHeader, ModalBody,  ModalFooter, Table, Row, Col} from 'reactstrap';
import {Field, reduxForm} from 'redux-form'


import {unselectAgent, updateAgent} from '../../actions/agents.action'
import Status from "../Status";
import SelectRegion from '../SelectRegion'
import _ from 'lodash'

class AgentDetail extends React.Component {

  toggle = () => {
    this.props.unselectAgent();
  };

  componentDidMount = () => {
    const {load} = this.props;

  };


  render() {
    const {
      agent,
      handleSubmit,
    } = this.props;

    return (
      <Modal isOpen={true}>
        <ModalHeader toggle={this.toggle}>

        </ModalHeader>
        <ModalBody className="client-detail">
          <Row>
            <Col>
              <form onSubmit={handleSubmit}>
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
                    <td>{agent.phone}</td>
                  </tr>
                  <tr>
                    <td>Дата регистрации</td>
                    <td>{agent.create_time}</td>
                  </tr>
                  <tr>
                    <td>Регион</td>
                    <td>
                      <SelectRegion name={"region"}/>
                    </td>
                  </tr>
                  </tbody>
                </Table>
                <br />
                <input type={"submit"} value={"Сохранить"} />
              </form>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    )
  }
}


const onSubmit = (data, dispatch, {form}) => {
  dispatch(updateAgent({meta: {form}, data}))
}

const AgentDetailForm = reduxForm({
  form: 'agentDetail',
  onSubmit
})(AgentDetail);


export default connect((state) => ({
  initialValues: state.agent.list[state.agent.selected],
  agent: state.agent.list[state.agent.selected]
}), {
  unselectAgent
})(AgentDetailForm);
