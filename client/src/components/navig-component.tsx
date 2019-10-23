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
import { User } from '../models/user-model';

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
    // Get current user info
        const userJson = localStorage.getItem("Current User");
        const currUser = userJson !== null ? new User(JSON.parse(userJson)) : new User({});
    return (
      <div>
        <Navbar style={{backgroundColor: 'rgba(2,100,200,0.2)',fontWeight:'bold'}} 
        light expand="md">
          <NavbarBrand href="/#/main">Main page</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {
                (currUser.role==="Regular employee")||
                <NavItem>
                  <NavLink href="/#/users-menu">Users</NavLink>
                </NavItem>
              }
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