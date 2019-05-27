import React, { useState, useEffect } from 'react'
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
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
import Login from './pages/Welcome/Login'
import RegisterUser from './pages/Welcome/RegisterUser'
import Loader from './components/Loader'
import SplashScreen from './pages/Welcome/SplashScreen'
import * as firebase from './helpers/firebase'
import * as api from './api'
import './App.scss'

export const LoggedInUserContext = React.createContext()

function waitForInit() {
    return new Promise((resolve, reject) => {
        const unsubscribe = firebase.onAuthStateChanged(user => {
            unsubscribe()
            resolve(user)
        }, reject)
    })
}

function createGuestUser(uid) {
    return {
        uid,
        isGuest: true,
        displayName: 'Guest',
        firstName: 'Guest',
        lastName: 'Guest',
        location: '11221'
    }
}

function App(props) {
    const [isInitialized, setIsInitialized] = useState(false)
    const [user, setUser] = useState({
        user: undefined,
        isLoggedIn: undefined
    })
    const [home, setHome] = useState({
        helpRequests: [],
        isLoaded: false,
        error: null
    })

    function setUserLoggedIn(user, isLoggedIn = true) {
        setUser({
            ...user,
            isLoggedIn: isLoggedIn
        })
    }
    
    useEffect(() => {
        waitForInit()
            .then(user => {
                if (user) {
                    if (user.isAnonymous) {
                        setUserLoggedIn(createGuestUser(user.uid))
                        setIsInitialized(true)
                    } else {
                        api.getUser(user.uid)
                            .then(response => {
                                setUserLoggedIn(response.data)
                            })
                            .catch(e => setUser(null))   // 404.  User has logged in but not fully registered yet
                            .finally(() => setIsInitialized(true))
                    }
                } else {
                    setUserLoggedIn(null, false)
                    setIsInitialized(true)
                }
            })
    }, [])

    useEffect(() => {
        if (user.isLoggedIn) {
            // subscribe to user logout events
            const unsubscribe = firebase.onAuthStateChanged(user => {
                if (!user) {
                    setUserLoggedIn(null, false)
                }
            })

            return () => {
                unsubscribe()
            }
        }
    }, [user.isLoggedIn])

    function handleHelpRequestsResponse(response) {
        if (response.error) {
            setHome({ ...home, isLoaded: true, error: response.error})
        } else {
            setHome({ ...home, isLoaded: true, helpRequests: response.helpRequests})
        }
    }

    function handleUserSignin(user, referrer='/') {
        setUserLoggedIn(user)
        props.history.push(referrer)
    }

    function isAuthenticated() {
        return user && !user.isGuest
    }

    if (!isInitialized || user.isLoggedIn === undefined) {
        return (
            <SplashScreen>
                <Loader />
            </SplashScreen>
        )
    } else {
        if (user.isLoggedIn) {
            return (
                <LoggedInUserContext.Provider value={user}>
                    <>
                        <Header />

                        <div className='container'>
                            <main>
                                <Switch>
                                    <Route exact path='/help-requests/:uid'
                                        render={props => <HelpRequestDetails {...props} loggedInUser={user} />}
                                    />
                                    <Route exact path='/users/:uid/profile'
                                        render={props => <UserProfile {...props} loggedInUser={user} />}
                                    />
                                    <Route exact path='/guest' 
                                        render={props => <Guest {...props} />}
                                    />

                                    <PrivateRoute exact path='/add-help-request'
                                        render={props => <AddHelpRequest {...props} loggedInUser={user} />}
                                        isAuthenticated={isAuthenticated}
                                    />
                                    <PrivateRoute exact path='/inbox'
                                        render={props => <Inbox {...props} loggedInUser={user} />}
                                        isAuthenticated={isAuthenticated}
                                    />
                                    <PrivateRoute exact path='/inbox/:uid'
                                        render={props => <Conversation {...props} loggedInUser={user} />}
                                        isAuthenticated={isAuthenticated}
                                    />
                                    <PrivateRoute exact path='/profile'
                                        render={props => <UserProfile {...props} loggedInUser={user} />}
                                        isAuthenticated={isAuthenticated}
                                    />
                                    <Route exact path='/' 
                                        render={props => <Home {...props} {...home} userLocation={user.location} onHelpRequestsResponse={handleHelpRequestsResponse} />}
                                    />
                                    <Redirect from='*' to='/' />
                                </Switch>
                            </main>

                            <Navbar />
                        </div>
                    </>
                </LoggedInUserContext.Provider>
            )
        } else {
            // need this extra check before redirecting to avoid Redirect loop
            if (props.history.action !== 'REPLACE') {
                return <Redirect to={{ pathname: '/login', state: { referrer: props.match.path }}} />
            }

            return (
                <div className='welcome'>
                    <Switch>
                        <Route exact path='/login'    render={props => <Login {...props} onUserSignin={handleUserSignin} />} />
                        <Route exact path='/register' render={props => <RegisterUser {...props} onUserRegistered={handleUserSignin} />} />
                        {/* <PrivateRoute path='/' redirectTo={user ? '/' : '/login' }
                            render={props => <Login {...props} onUserSignin={handleUserSignin} />}
                            isAuthenticated={isAuthenticated}
                        /> */}
                    </Switch>
                </div>
            )
        }    
    }
}

export default withRouter(App)
