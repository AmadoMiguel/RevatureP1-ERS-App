// Style taken from https://reactstrap.github.io/components/navbar/

import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink} from 'reactstrap';

export default class NavigatorMenu extends React.Component <any,any> {
  constructor(props:any) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <div>
        <Navbar style={{backgroundColor: 'rgba(90,190,180,0.6)'}} 
        light expand="md">
          <NavbarBrand href="/#/main">Main page</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
              <NavLink href="/#/users-menu">Users</NavLink>
              </NavItem>
              <NavItem>
              <NavLink href="/#/reimbursements">Reimbursements</NavLink>
              </NavItem>
              <NavItem>
              <NavLink href="/#/login">Logout</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}