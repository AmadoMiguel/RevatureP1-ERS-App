import React from 'react';
import './include/bootstrap';
import './App.css';
import { HashRouter,Switch,Route, Redirect } from 'react-router-dom';
import { LoginComponent } from './components/login-component';
import { MenuComponent } from './components/menu-component';
import { UsersComponent } from './components/users-components';
import { ReimbsComponent } from './components/reimbursements-component';

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
          <Redirect from="/#/" to="/menu" />
        <Switch>
          <Route path='/login' component = {LoginComponent}/>
          <Route path='/menu' component = {MenuComponent} />
          <Route path='/users' component = {UsersComponent} />
          <Route path='/reimbursements' component = {ReimbsComponent} />
        </Switch>
        </div>
      </HashRouter>
    </div>
  );
}

export default App;