import React from "react";
import { Row, Col } from 'reactstrap';
import {Route} from 'react-router-dom'

import OrderList from '../Order/OrderList'
import CustomerList from '../Customer/CustomerList'
import ProductList from '../Product/ProductList'
import AgentList from '../Agent/AgentList'

const Dashboard = () => (
    <div style={{marginTop: 24}}>
        <Row>
            <Col>
              <Route path="/" exact={true} component={OrderList} />
              <Route path="/orders" component={OrderList} />
              <Route path="/clients" component={CustomerList} />
              <Route path="/products" component={ProductList} />
              <Route path="/agents" component={AgentList} />
            </Col>
        </Row>
    </div>
);

export default Dashboard;
