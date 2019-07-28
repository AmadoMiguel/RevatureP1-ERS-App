import React from 'react';
import './include/bootstrap';
import './App.css';
import { HashRouter,Switch,Route, Redirect } from 'react-router-dom';
import { LoginComponent } from './components/login-component';
import { MenuComponent } from './components/menu-component';
import { UsersMenuComponent } from './components/users-components';
import { ReimbsComponent } from './components/reimbursements-component';
import { UserByIdComponent } from './components/userId-component';
import { UsersInfoComponent } from './components/users-info-component';
import { ReimbursementsByStatus } from './components/reimbursements-by-status';
import { ReimbursementsByAuthor } from './components/reimbursements-by-author';

const App: React.FC = () => {
  return (
    <div className="App">
      <h2>
      Expenses Reimbursement System
      </h2>
      {/* Add the navigator */}
      <HashRouter>
        <div>
          {/* Default route for the application */}
          <Redirect from="/#/" to="/reimbursements" />
        <Switch>
          <Route path='/login' component = {LoginComponent}/>
          <Route path='/main' component = {MenuComponent} />
          <Route path='/users-menu' component = {UsersMenuComponent} />
          <Route path='/users' component = {UsersInfoComponent} />
          <Route path='/user' component = {UserByIdComponent} />
          <Route path='/reimbursements' component = {ReimbsComponent} />
          <Route path='/reimbursement/status' component = {ReimbursementsByStatus} />
          <Route path='/reimbursement/author' component = {ReimbursementsByAuthor} />
        </Switch>
        </div>
      </HashRouter>
    </div>
  );
}

export default App;