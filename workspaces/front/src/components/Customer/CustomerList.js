import React from 'react'
import { connect } from 'react-redux'
import { Table } from 'reactstrap';
import * as moment from 'moment'


import {fetchClients, selectClient} from '../../actions/clients.action'
// import OrderStatus from './OrderStatus'
import ClientDetail from './ClientDetail'

// import './OrderList.css'

class CustomerList extends React.Component {

  componentDidMount () {
    this.props.fetchClients()
  }

  render () {
    const { clients, selectClient, selectedClient } = this.props
    return (
      <div style={{width: 800}}>
        <h1>Клиенты</h1>
        <br />
        <br />
        <Table>
          <thead>
          <tr>
            <th>Клиент</th>
          </tr>
          </thead>
          <tbody>
          {clients &&
          clients.map((client) => (
            <tr key={client._id} onClick={() => selectClient(client)} className="OrderListItem">

              <td>{client.user.shop.name}</td>
            </tr>
          ))
          }
          </tbody>
        </Table>

        {selectedClient && <ClientDetail />}

      </div>
    )
  }
}



export default connect(state => ({
    clients: state.client.list,
    selectedClient: state.client.selected
  }),
  {
    fetchClients,
    selectClient
  }
)(CustomerList)
