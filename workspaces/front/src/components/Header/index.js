import React from 'react'
import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink as BootNavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import {connect} from 'react-redux'
import {NavLink, withRouter} from 'react-router-dom'
import './Header.css'

import {logOut} from '../../actions/auth'


const Header = (props) => (
  <div>
    <Navbar color="light" light expand="md">
      <Container>
        <NavbarBrand href="/">BETMASTER</NavbarBrand>
        <Nav navbar>
          <NavItem>
            <NavLink exact activeClassName={"active"} to={"/orders"}>Заказы</NavLink>
          </NavItem>
          <NavItem>
            <NavLink exact activeClassName={"active"} to={"/clients"}>Клиенты</NavLink>
          </NavItem>
          <NavItem>
            <NavLink exact activeClassName={"active"} to={"/products"}>Склад</NavLink>
          </NavItem>
          <NavItem>
            <NavLink exact activeClassName={"active"} to={"/agents"}>Агенты</NavLink>
          </NavItem>
        </Nav>

        <Nav className="ml-auto" navbar>
          <NavItem>
            {props.loggedIn && <BootNavLink style={{cursor: 'pointer'}} onClick={props.logOut}>Выйти</BootNavLink>}
          </NavItem>
        </Nav>
      </Container>
    </Navbar>
  </div>
);

const mapStateToProps = state => ({
  loggedIn: state.auth.loggedIn
});

const mapDispatchToProps = {
  logOut
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default withRouter(enhance(Header));
