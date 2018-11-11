import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter, Comparator } from 'react-bootstrap-table2-filter';
import * as moment from 'moment'


const columns = [{
  dataField: 'shop.name',
  text: 'Название магазина',
  filter: textFilter()
}, {
  dataField: 'shop.legal_name',
  text: 'Юр. Название',
  filter: textFilter()
}, {
  dataField: 'shop.contract_number',
  text: 'Номер договора',
  filter: textFilter(),
}, {
  dataField: 'shop.region',
  text: 'Регион',
  filter: textFilter(),
},
  {
    dataField: 'create_time',
    text: 'Дата регистрации',
    formatter: (col, row) => (
      <div>{moment(col).format('YYYY-MM-DD hh:mm')}</div>
    )
  }
];

const CustomersTable = ({ data, page, sizePerPage, onTableChange, totalSize, onSelect }) => (
  <div>
    <BootstrapTable
      remote
      keyField="_id"
      data={ data }
      columns={ columns }
      filter={ filterFactory() }
      pagination={ paginationFactory({ page, sizePerPage, totalSize }) }
      onTableChange={ onTableChange }
      rowEvents={{onClick: (e, row, rowIndex) => onSelect(row, rowIndex)}}
    />
  </div>
);

export default CustomersTable
