import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, {textFilter, Comparator, selectFilter} from 'react-bootstrap-table2-filter';
import * as moment from 'moment'
import {getOrderTotalPrice} from "../../utils/order";
import Status from "../Status";


const selectOptions = {
  all: 'Все',
  approve: 'Одобрено',
  reject: 'Отлконено',
  review: 'на рассмотрении'
};
let qualityFilter = null;

const columns = [
  {
    dataField: 'create_time',
    text: 'Дата и время',
    formatter: (col, row) => (
      <div>{moment(col).format('YYYY-MM-DD hh:mm')}</div>
    )
  },
  {
    dataField: 'user.shop.name',
    text: 'Клиент',
  },
  {
    dataField: 'user.shop.region',
    text: 'Регион',
  },
  {
    dataField: 'products',
    text: 'Сумма',
    formatter: (col, row) => (
      <div>{getOrderTotalPrice(col, 'shop').toLocaleString()}</div>
    )
  },
  {
    dataField: 'payment_type',
    text: 'Ф/О',
    formatter: (col, row) => (
      <div>{col === 'transfer' ? 'ПЕРЕЧ' : 'НАЛ'}</div>
    )
  },
  {
    dataField: 'status',
    text: 'Статус',
    formatter: (col, row) => (
      <Status status={col}/>
    ),
    filter: selectFilter({
      options: selectOptions,
      className: 'test-classname',
      withoutEmptyOption: true,
      comparator: Comparator.LIKE,
      defaultValue: selectOptions.all,
      getFilter: (filter) => { // qualityFilter was assigned once the component has been mounted.
        qualityFilter = filter;
      }
    })
  },
];

const OrdersTable = ({data, page, sizePerPage, onTableChange, totalSize, onSelect}) => (
  <div>
    {console.log(sizePerPage, page, totalSize)}
    <BootstrapTable
      remote
      keyField="_id"
      data={data}
      columns={columns}
      filter={filterFactory()}
      pagination={paginationFactory({page, sizePerPage, totalSize})}
      onTableChange={onTableChange}
      rowEvents={{onClick: (e, row, rowIndex) => onSelect(row, rowIndex)}}
    />
  </div>
);

export default OrdersTable
