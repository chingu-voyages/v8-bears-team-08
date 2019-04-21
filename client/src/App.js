import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import Welcome from './pages/Welcome/Welcome'
import Home from './pages/Home/Home'
import UserProfile from './pages/UserProfile/UserProfile'
import Header from './components/Header'
import './App.scss'

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoggedIn: true,
            home: {
                helpRequests: [],
                isLoaded: false,
                error: null,
                userLocation: '11221'
            }
        }
    
        this.handleLoginClick = this.handleLoginClick.bind(this)
        this.handleCreateClick = this.handleCreateClick.bind(this)
        this.handleHelpRequestsResponse = this.handleHelpRequestsResponse.bind(this)
    }

    handleLoginClick() {
        console.log('login clicked');
    }
    handleCreateClick() {
        console.log('create account clicked');
    }

    handleHelpRequestsResponse(response) {
        if (response.error) {
            this.setState((state) => (
                { home: { ...state.home, isLoaded: true, error: response.error } }
            ))  
        } else {
            this.setState((state) => (
               { home: { ...state.home, isLoaded: true, helpRequests: response.helpRequests } }
            ))
        }
    }


    render() {
        if (this.state.isLoggedIn) {
            return (
                <Router>
                    <Header />

                    <div id='container' className='d-flex flex-row'>
                        <div className='navbar'>
                            <ul>
                                <li><Link to='/'>Home</Link></li>
                                <li>New</li>
                                <li>Discover</li>
                                <li>Messages</li>
                                {/* TODO: replace the uid below with the user's uid from the firebase auth once user login is setup */}
                                <li><Link to='/users/9vqLlEez3VlFIsDy2MXr/profile'>Profile</Link></li>
                            </ul>
                        </div>
                        
                        <main className='flex-grow'>
                            <Route 
                                exact path='/' 
                                render={(routeProps) => (
                                    <Home {...routeProps} {...this.state.home} onHelpRequestsResponse={this.handleHelpRequestsResponse} />
                                )}
                            />
                            <Route path='/users/:uid/profile' component={UserProfile} />
                        </main>
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
