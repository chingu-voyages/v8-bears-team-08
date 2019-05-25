import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import posed, { PoseGroup } from 'react-pose'
import Home from './pages/Home/Home'
import HelpRequestDetails from './pages/Home/HelpRequestDetails'
import UserProfile from './pages/UserProfile/UserProfile'
import AddHelpRequest from './pages/AddNew/AddHelpRequest'
import Inbox from './pages/Inbox/Inbox'
import Conversation from './pages/Inbox/Conversation'
import Guest from './pages/Guest/Guest'
import Header from './components/Header'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import './App.scss'

export const LoggedInUserContext = React.createContext()
const RouteContainer = posed.div({
    enter: { opacity: 1, delay: 50, transition: { duration: 250, ease: 'easeIn' } },
    exit: { opacity: 0, transition: { duration: 100, ease: 'easeIn' } }
})


class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            home: {
                helpRequests: [],
                isLoaded: false,
                error: null,
                userLocation: this.props.user.location
            },
            user: this.props.user
        }
    
        this.handleHelpRequestsResponse = this.handleHelpRequestsResponse.bind(this)
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
        if (this.state.user) {
            return (
                <LoggedInUserContext.Provider value={this.state.user}>
                    <Router>
                        <Route render={({ location }) => (
                                <>
                                    <Header />

                                    <div className='container'>
                                        <main>
                                            <PoseGroup>
                                                <RouteContainer key={location.pathname} style={{height: '100%'}}>
                                                    <Switch location={location}>
                                                        <Route path='/guest' component={Guest} />
                                                        <Route 
                                                            exact
                                                            path='/' 
                                                            render={(routeProps) => (
                                                                <Home {...routeProps} {...this.state.home} onHelpRequestsResponse={this.handleHelpRequestsResponse} />
                                                            )}
                                                        />
                                                        <Route exact path='/help-requests/:uid' component={HelpRequestDetails} />
                                                        <PrivateRoute exact path='/add-help-request' component={AddHelpRequest} authenticated={!this.state.user.isGuest} />
                                                        <PrivateRoute exact path='/inbox' component={Inbox} authenticated={!this.state.user.isGuest} />
                                                        <PrivateRoute exact path='/inbox/:uid' component={Conversation} authenticated={!this.state.user.isGuest} />
                                                        <PrivateRoute exact path='/users/:uid/profile' component={UserProfile} authenticated={!this.state.user.isGuest} />
                                                    </Switch>
                                                </RouteContainer>
                                            </PoseGroup>
                                        </main>

                                        <Navbar userUid={this.state.user.uid} />
                                    </div>
                                </>
                            )} 
                        />
                    </Router>
                </LoggedInUserContext.Provider>
            )
        } else {
            return <h1>Bad Error</h1>
        }
    }
}

export default App
