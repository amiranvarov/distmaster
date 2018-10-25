import React from "react";
import { Row, Col } from 'reactstrap';
import {Route} from 'react-router-dom'

import OrderList from '../Order/OrderList'
import CustomerList from '../Customer/CustomerList'
import ProductList from '../Product/ProductList'

import Menu from '../Menu'

const Dashboard = () => (
    <div style={{marginTop: 24}}>
        <Row>
            <Col xs="3">
                <Menu />
            </Col>
            <Col>
              <Route path="/orders" component={OrderList} />
              <Route path="/clients" component={CustomerList} />
              <Route path="/products" component={ProductList} />
            </Col>
        </Row>
    </div>
);

export default Dashboard;
