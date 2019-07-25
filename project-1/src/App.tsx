import React from 'react';
import './include/bootstrap';
import './App.css';
import { HashRouter,Switch,Route } from 'react-router-dom';
import { LoginComponent } from './components/login-component';
import { MenuComponent } from './components/menu-component';
import { CardTitle } from 'material-ui';
import { MuiThemeProvider } from 'material-ui/styles';

const App: React.FC = () => {
  return (
    <div className="App">
      <MuiThemeProvider>
        <CardTitle 
          title='Expenses Reimbursement Systems'
        />
        {/* Add the navigator */}
        <HashRouter>
          <div>
          <Switch>
            <Route path='/login' component = {LoginComponent}/>
            <Route path='/menu' component = {MenuComponent} />
            <Route component ={LoginComponent} />
            
          </Switch>
          </div>
          
        </HashRouter>
      </MuiThemeProvider>
    </div>
  );
}

export default App;