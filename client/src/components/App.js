import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import MainNav from './MainNav';
import Home from './Home';
import About from './About';
import Login from './Login';
import Signup from './Signup';
import Setup from './Setup';
import Listings from './Listings';
import NoMatch from './NoMatch';
import Dashboard from './Dashboard';
import Profile from './Profile';
import CreateListing from './CreateListing';
import data from '../sampleData';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authenticated: false,
      user: null,
      visible: null
    }

    this.cookies = new Cookies();
    this.checkAuth();
  }

  checkAuth = () => {
    fetch('/profile', {
      credentials: 'include'
    }).then(response => {
      return response.ok ? response.json() : {};
    }).then(user => {
      if (user && user.name) {
        this.setState({
          user: user,
          authenticated: true
        });
      }
    });
  }

  handleAuthenticated = (user) => {
    this.setState({
      authenticated: true,
      user: user
    });
    console.log('User authenticated...');
    console.log('USER:', this.state.user);
  }

  handleSignOff = () => {
    this.setState({
      authenticated: false,
      user: null
    });
    fetch('/logout', {
      credentials: 'include'
    }).then(response => console.log(response.status));
  }

  render() {
    return (
      <Router>
        <div>
          <MainNav authenticate={this.handleAuthenticated} isAuthed={this.state.authenticated}
                   signoff={this.handleSignOff} user={this.state.user} />
          <Switch>
            <Route exact path='/' render={props => (
              <Home user={this.state.user} visible={this.state.visible} {...props} />
            )} />

            <Route exact path='/listings' render={props => (
              <Listings {...props} user={this.state.user} />
            )} />

            <Route exact path='/about' component={About} />

            <Route exact path='/login' render={props => (
              <Login authenticate={this.handleAuthenticated} {...props} />
            )} />

            <Route exact path='/signup' component={Signup} />

            <Route exact path='/setup' component={Setup} />

            <Route exact path='/dashboard' render={props => (
              <Dashboard listings={data} {...props} />
            )} />

            <Route exact path='/profile' render={props => (
              <Profile {...props}/>
            )} />

            <Route exact path='/create' render={props => (
              <CreateListing {...props} />
            )} />

            <Route component={NoMatch} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
