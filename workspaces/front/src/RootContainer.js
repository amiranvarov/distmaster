import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Container } from 'reactstrap';
import { connect } from 'react-redux'

import Header from './components/Header'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

const RootContainer = (props) => (
    <Router>
        <div>
            <Header />
            <Container>
                <Route  path="/" component={props.loggedIn ? Dashboard : Login } />
            </Container>
        </div>
    </Router>
);

export default connect((state) => ({
    loggedIn: state.auth.loggedIn
}))(RootContainer);
