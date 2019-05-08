import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import Welcome from './pages/Welcome/Welcome'
import Home from './pages/Home/Home'
import UserProfile from './pages/UserProfile/UserProfile'
import Header from './components/Header'
import Inbox from './pages/Inbox/Inbox'
import Login from './components/Login'
import * as firebase from './helpers/firebase'
import './App.scss'

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoggedIn: undefined,
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

    componentDidMount() {
        firebase.onAuthStateChanged(user => {
            if (user) {
                this.setState({ 
                    isLoggedIn: true
                })
            } else {
                this.setState({
                    isLoggedIn: false
                })
            }
        })
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
        if (this.state.isLoggedIn == undefined) {
            return null
        }

        if (this.state.isLoggedIn) {
            return (
                <Router>
                    <Header />

                    <div id='container' className='d-flex flex-row'>
                        <div className='navbar'>
                            <ul>
                                <li><Link to='/'>Home</Link></li>
                                <li>Add New</li>
                                <li>Discover</li>
                                <li><Link to='/inbox/'>Messages</Link></li>
                                <li><Link to={`/users/${firebase.getUser().uid}/profile`}>Profile</Link></li>
                                {/* TODO: remove this once login flow components are created */}
                                <li><Link to='/login'>Login</Link></li>
                            </ul>
                        </div>
                        
                        <main className='flex-grow'>
                            <Route 
                                exact path='/' 
                                render={(routeProps) => (
                                    <Home {...routeProps} {...this.state.home} onHelpRequestsResponse={this.handleHelpRequestsResponse} />
                                )}
                            />
                            <Route path='/inbox' component={Inbox} />
                            <Route path='/users/:uid/profile' component={UserProfile} />
                            <Route path='/login' component={Login} />
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
