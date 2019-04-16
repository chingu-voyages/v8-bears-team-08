import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import Welcome from './pages/Welcome/Welcome'
import Home from './pages/Home/Home'
import Header from './components/Header'
import './App.scss'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
        isLoggedIn: true,
        userLocation: '11221',
        helpRequests: []
    }
    
    this.handleLoginClick = this.handleLoginClick.bind(this)
    this.handleCreateClick = this.handleCreateClick.bind(this)
  }

  handleLoginClick() {
    console.log('login clicked');
  }
  handleCreateClick() {
    console.log('create account clicked');
  }

  render() {
    if (this.state.isLoggedIn) {
        return (
            <Router>
                <div>
                    <Header />

                    <div id='container' className='d-flex'>
                        <div className='navbar'>
                            <ul>
                                <li><Link to='/'>Home</Link></li>
                                <li>New</li>
                                <li>Messages</li>
                                <li>Profile</li>
                            </ul>
                        </div>
                        
                        <main className='flex-grow'>
                            <Route 
                                exact
                                path='/' 
                                render={() => (
                                    <Home location={this.state.userLocation} />
                                )}
                            />
                        </main>
                    </div>
                </div>
            </Router>
        )
    } else {
        return (
            <div className="app">
                <Welcome 
                    onLoginClick={this.handleLoginClick} 
                    onCreateClick={this.handleCreateClick} 
                />
            </div>
        );
    }
  }
}

export default App;
