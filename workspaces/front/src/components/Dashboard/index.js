import React from "react";
import { Container, Row, Col } from 'reactstrap';

import Menu from '../Menu'

const Dashboard = () => (
    <div>
        <Row>
            <Col xs="3">
                <Menu />
            </Col>
            <Col>
                hey world
            </Col>
        </Row>
    </div>
);

export default Dashboard;
