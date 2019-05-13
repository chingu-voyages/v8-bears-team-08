import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import Welcome from './pages/Welcome/Welcome'
import Home from './pages/Home/Home'
import HelpRequestDetails from './pages/Home/HelpRequestDetails'
import UserProfile from './pages/UserProfile/UserProfile'
import Header from './components/Header'
import Inbox from './pages/Inbox/Inbox'
import Conversation from './pages/Inbox/Conversation'
import Login from './components/Login'
import Navbar from './components/Navbar'
import * as firebase from './helpers/firebase'
import * as api from './api'
import './App.scss'

export const LoggedInUserContext = React.createContext()

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
        firebase.onAuthStateChanged(async user => {
            if (user) {
                const userProfileResponse = await api.getUserProfile(user.uid)
                this.setState({ 
                    isLoggedIn: true,
                    user: userProfileResponse.data
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
            return <h1>Loading</h1>
        }

        if (this.state.isLoggedIn) {
            return (
                <LoggedInUserContext.Provider value={this.state.user}>
                    <Router>
                        <Header />

                        <div id='container' className='d-flex flex-row'>
                            <Navbar userUid={this.state.user.uid} />
                            
                            <main className='flex-grow'>
                                <Route 
                                    exact path='/' 
                                    render={(routeProps) => (
                                        <Home {...routeProps} {...this.state.home} onHelpRequestsResponse={this.handleHelpRequestsResponse} />
                                    )}
                                />
                                <Route path='/help-requests/:uid' component={HelpRequestDetails} />
                                <Route exact path='/inbox' component={Inbox} />
                                <Route exact path='/inbox/:uid' component={Conversation} />
                                <Route path='/users/:uid/profile' component={UserProfile} />
                                <Route path='/login' component={Login} />
                            </main>
                        </div>
                    </Router>
                </LoggedInUserContext.Provider>
            )
        } else {
            return (
                <div className="app">
                    <Welcome 
                        onLoginClick={this.handleLoginClick} 
                        onCreateClick={this.handleCreateClick} 
                    />
                </div>
            )
        }
  }
}

export default App
