import React from 'react'
import { connect } from 'react-redux'
import { Table } from 'reactstrap';
import * as moment from 'moment'


import {fetchClients, selectClient} from '../../actions/clients.action'
// import OrderStatus from './OrderStatus'
import ClientDetail from './ClientDetail'
import CustomerTable from './CustomersTable'

// import './OrderList.css'

class CustomerList extends React.Component {

  componentDidMount () {
    this.props.fetchClients()
  }

  handleTableChange = (type, state) => {
    const transformedFilter = {};
    for (let key in state.filters) {
      const value = state.filters[key].filterVal;
      if (value.trim() == '') {
        return false;
      }
      // const indexOfFirstDot =  key.indexOf('.');
      // const restOfName = key.substr(indexOfFirstDot +1, key.length)

      transformedFilter[key] = value
    }

    this.props.fetchClients({
      filter: transformedFilter,
      page: state.page
    })
  }

  onSelect = (customer, index) => {
    this.props.selectClient(index)
  }

  render () {
    const { list, page, total, selectClient, selectedClient } = this.props
    return (
      <div>
        <h1>Клиенты</h1>
        <br />
        <br />
        {list && (
          <CustomerTable
            data={list}
            page={page}
            sizePerPage={50}
            onTableChange={this.handleTableChange}
            totalSize={total}
            onSelect={this.onSelect}
          />
        )}

        {selectedClient && <ClientDetail />}

      </div>
    )
  }
}



export default connect(state => ({
    list: state.client.list,
    total: state.client.total,
    page: state.client.page,
    selectedClient: state.client.list[state.client.selected]
  }),
  {
    fetchClients,
    selectClient
  }
)(CustomerList)
