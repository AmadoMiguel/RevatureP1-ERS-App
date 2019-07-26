import React from 'react';
import './include/bootstrap';
import './App.css';
import { HashRouter,Switch,Route, Redirect } from 'react-router-dom';
import { LoginComponent } from './components/login-component';
import { MenuComponent } from './components/menu-component';

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
        <Redirect from="/#/" to="/login" />
        <Switch>
          <Route path='/login' component = {LoginComponent}/>
          <Route path='/menu' component = {MenuComponent} />
        </Switch>
        </div>
      </HashRouter>
    </div>
  );
}

export default App;