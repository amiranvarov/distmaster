import React from 'react'
import {Table} from 'reactstrap'
import {
  generateProductName,
  getOrderTotalPrice,
  getProductRowCost
} from '../../utils/order'


export const Products = ({products}) => (
  <Table>
    <thead>
    <tr>
      <th>№</th>
      <th>Наменование</th>
      <th>В упаковке</th>
      <th>Кол упаковок</th>
      <th>Цена за ед.</th>
      <th>Сумма</th>
    </tr>
    </thead>
    <tbody>
    {
      products.map((product, index) => (
        <tr key={index}>
          <td>{(index + 1)}</td>
          <td>{generateProductName(product)}</td>
          <td>({product.pack})</td>
          <td>{product.quantity}</td>
          <td>{(product.pack * product.price['shop']).toLocaleString()}</td>
          <td>{getProductRowCost(product, 'shop').toLocaleString()}</td>
        </tr>
      ))
    }
    <tr>
      <th></th>
      <th>Итог</th>
      <th></th>
      <th></th>
      <th></th>
      <th>{getOrderTotalPrice(products, 'shop').toLocaleString()}</th>
    </tr>
    </tbody>
    <tfoot>
    </tfoot>
  </Table>
);

export default Products
