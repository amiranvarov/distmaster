import React from 'react'
import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import {connect} from 'react-redux'

import {logOut} from '../../actions/auth'


const Header = (props) => (
  <div>
    <Navbar color="light" light expand="md">
      <Container>
        <NavbarBrand href="/">BETMASTER</NavbarBrand>

        <Nav className="ml-auto" navbar>
          <NavItem>
            {props.loggedIn && <NavLink style={{cursor: 'pointer'}} onClick={props.logOut}>Выйти</NavLink>}
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

export default enhance(Header);
