import * as React from 'react'
import { connect } from 'react-redux'
import {Table} from 'reactstrap'
import {fetchAgents, selectAgent} from "../../actions/agents.action";
import Status from '../Status'
import AgentDetail from "./AgentDetail";
import * as moment from 'moment'


export class AgentList extends React.Component {

  componentWillMount() {
    this.props.fetchAgents();
  }

  componentDidUpdate () {
    console.log('list', this.props.list)
  }

  render () {
    const {
      list,
      selectAgent,
      selectedAgent
    } = this.props
    return (
      <React.Fragment>
        <h1>Агенты</h1>
        <Table>
          <thead>
            <tr>
              <th>Имя</th>
              <th>Номер</th>
              <th>Дата</th>
              <th>Регион</th>
            </tr>
          </thead>
          <tbody>
          {
            list && list.length > 0 && list.map((agent, index) => {
              return (
                <tr key={index} onClick={() => selectAgent(index)}>
                  <td>{agent.name}</td>
                  <td>{agent.phone}</td>
                  <td>{moment(agent.create_time).format('YYYY-MM-DD hh:mm')}</td>
                  <td>
                    {agent.region === 'none' ? 'Не указано' : agent.region === 'all' ? 'Все регионы' : agent.region}
                  </td>
                </tr>
              )
            })
          }
          </tbody>
        </Table>
        {selectedAgent && <AgentDetail />}
      </React.Fragment>
    )
  }
}


export default connect(state => ({
    list: state.agent.list,
    selectedAgent: state.agent.list[state.agent.selected]
  }),
  {
    fetchAgents,
    selectAgent
  }
)(AgentList)

