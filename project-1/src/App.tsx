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
import { NewReimbursementComponent } from './components/create-reimbursement-component';
import { MyReimbursementsComponent } from './components/my-reimbursements-component';

const App: React.FC = () => {
  return (
    <div className="App">
      <h2>
      Expenses Reimbursement System
      </h2>
      {/* Add the navigator */}
      <HashRouter>
        <div>
          {/* Default route for the application is login */}
          <Redirect from="/#/" to="/users-menu/user" />
          <Switch>
            <Route path='/login' component = {LoginComponent}/>
            <Route path='/main' component =  {MenuComponent} />
            <Route path='/users-menu/user' component = {UserByIdComponent} />
            <Route path='/users-menu/users' component = {UsersInfoComponent} />
            <Route path='/users-menu' component = {UsersMenuComponent} />
            <Route path="/reimbursements/my-reimbursements" component = {MyReimbursementsComponent} />
            <Route path='/reimbursements/create' component = {NewReimbursementComponent} />
            <Route path='/reimbursements/status' component = {ReimbursementsByStatus} />
            <Route path='/reimbursements/author' component = {ReimbursementsByAuthor} />
            <Route path='/reimbursements' component = {ReimbsComponent} />
          </Switch>
        </div>
      </HashRouter>
    </div>
  );
}
export default App;