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
import SplashScreen from './pages/Welcome/SplashScreen'
import Loader from './components/Loader'
import LoaderBar from './components/LoaderBar'
import config from './config'
import * as firebase from './helpers/firebase'
import * as api from './api'
import './App.scss'
import NavHandler from './NavHandler'

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
    const [isLoading, setIsLoading] = useState(false)
    const [isInitialized, setIsInitialized] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [user, setUser] = useState({
        user: undefined,
        isLoggedIn: undefined
    })
    const [home, setHome] = useState({
        helpRequests: [],
        isLoaded: false,
        error: null
    })
    const navHandler = NavHandler(() => setIsLoading(true), () => setIsLoading(false))

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
                            .catch(() => setUser(null))   // 404.  User has logged in but not fully registered yet
                            .finally(() => setIsInitialized(true))
                    }
                } else {
                    setUserLoggedIn(null, false)
                    setIsInitialized(true)
                }
            })
    }, [])

    function setUserLoggedIn(user, isLoggedIn = true) {
        setUser({
            ...user,
            isLoggedIn: isLoggedIn
        })
    }

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

    // onmount
    useEffect(() => {
        function handleWindowResize() {
            // the extra checks of isMobile are here to reduce the number of times we update state
            if (window.innerWidth < config.mobileBreakpointPixels) {
                if (isMobile === false) {
                    setIsMobile(true)
                }
            } else {
                if (isMobile === true) {
                    setIsMobile(false)
                }
            }
        }

        window.addEventListener('resize', handleWindowResize)

        if (window.innerWidth < config.mobileBreakpointPixels) {
            setIsMobile(true)
        }
        
    }, [isMobile, props.history])

    function handleLoading() {
        console.log('handleLoading', isLoading)
        setIsLoading(true)
    }

    function handleLoadingComplete() {
        console.log('handleLoadingComplete', isLoading)
        setIsLoading(false)
    }

    if (!isInitialized || user.isLoggedIn === undefined) {
        return (
            <SplashScreen>
                <Loader />
            </SplashScreen>
        )
    } else {
        if (user.isLoggedIn) {
            const defaultProps = { loggedInUser: user }
            return (
                <LoggedInUserContext.Provider value={user}>
                    <>
                        <LoaderBar isLoading={isLoading} />
                        <Header pathname={props.location.pathname} routeState={props.location.state} isMobile={isMobile} />

                        <div className='container'>
                            <main>
                                <Switch>
                                    <Route exact path='/help-requests/:uid'
                                        render={props => {
                                            return <HelpRequestDetails {...props} {...defaultProps} navHandler={navHandler} />}
                                        }
                                    />
                                    <Route exact path='/users/:uid/profile'
                                        render={props => {
                                            return <UserProfile {...props} {...defaultProps} />}
                                        }
                                    />
                                    <Route exact path='/guest' 
                                        render={props => {
                                            return <Guest {...props} />} 
                                        }
                                    />

                                    <PrivateRoute exact path='/add-help-request'
                                        isAuthenticated={isAuthenticated}
                                        render={props => {
                                            return <AddHelpRequest {...props} {...defaultProps} />}
                                        }
                                    />
                                    <PrivateRoute exact path='/inbox'
                                        isAuthenticated={isAuthenticated}
                                        render={props => {
                                            return <Inbox {...props} {...defaultProps} />}
                                        }
                                    />
                                    <PrivateRoute exact path='/inbox/:uid'
                                        isAuthenticated={isAuthenticated}
                                        render={props => {
                                            return <Conversation {...props} {...defaultProps} />}
                                        }
                                    />
                                    <PrivateRoute exact path='/profile'
                                        isAuthenticated={isAuthenticated}
                                        render={props => {
                                            return <UserProfile {...props} {...defaultProps} />}
                                        }
                                    />
                                    
                                    <Route exact path='/' 
                                        render={props => { 
                                            return <Home {...props} {...home} {...defaultProps} userLocation={user.location} onHelpRequestsResponse={handleHelpRequestsResponse} />}
                                        }
                                    />
                                    <Redirect from='*' to='/' />
                                </Switch>
                            </main>

                            <Navbar loggedInUser={user} onLoad={handleLoading} onLoadComplete={handleLoadingComplete} navHandler={navHandler} />
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
                    </Switch>
                </div>
            )
        }    
    }
}

export default withRouter(App)
