import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import posed, { PoseGroup } from 'react-pose'
import Home from './pages/Home/Home'
import HelpRequestDetails from './pages/Home/HelpRequestDetails'
import UserProfile from './pages/UserProfile/UserProfile'
import Header from './components/Header'
import AddHelpRequest from './pages/AddNew/AddHelpRequest'
import Inbox from './pages/Inbox/Inbox'
import Conversation from './pages/Inbox/Conversation'
import Navbar from './components/Navbar'
import './App.scss'

export const LoggedInUserContext = React.createContext()
const RouteContainer = posed.div({
    enter: { opacity: 1, delay: 50, transition: { duration: 250 } },
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

                                    <div className='container'>{console.log(location)}
                                        <main>
                                            <PoseGroup>
                                                <RouteContainer key={location.pathname} style={{height: '100%'}}>
                                                    <Switch location={location}>
                                                        <Route 
                                                            exact path='/' 
                                                            render={(routeProps) => (
                                                                <Home {...routeProps} {...this.state.home} onHelpRequestsResponse={this.handleHelpRequestsResponse} />
                                                            )}
                                                        />
                                                        <Route exact path='/help-requests' component={AddHelpRequest} />
                                                        <Route exact path='/help-requests/:uid' component={HelpRequestDetails} />
                                                        <Route exact path='/inbox' component={Inbox} />
                                                        <Route exact path='/inbox/:uid' component={Conversation} />
                                                        <Route exact path='/users/:uid/profile' component={UserProfile} />
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
