import React, { useState, useEffect } from 'react'
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import Home from './pages/Home/Home'
import HelpRequestDetails from './pages/HelpRequestDetails/HelpRequestDetails'
import UserProfile from './pages/Profile/Profile'
import AddHelpRequest from './pages/AddNew/AddHelpRequest'
import Inbox from './pages/Inbox/Inbox'
import Conversation from './pages/Inbox/Conversation'
import Guest from './pages/Guest/Guest'
import Explore from './pages/Explore/Explore'
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
import * as util from './helpers/util'
import './App.scss'
import NavHandler from './components/NavHandler'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

export const LoggedInUserContext = React.createContext()

function App(props) {
    const [isRouteLoading, setIsRouteLoading] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [user, setUser] = useState({
        isLoggedIn: undefined
    })
    const [home, setHome] = useState({
        helpRequests: [],
        isLoaded: false,
        error: null
    })
    const navHandler = NavHandler(() => setIsRouteLoading(true), () => setIsRouteLoading(false))

    useEffect(function initializeUser() {
        function waitForFirebaseAuthInit() {
            return new Promise((resolve, reject) => {
                const unsubscribe = firebase.onAuthStateChanged(user => {
                    unsubscribe()
                    resolve(user)
                }, reject)
            })
        }

        waitForFirebaseAuthInit()
            .then(user => {
                if (user) {
                    if (user.isAnonymous) {
                        setUserLoggedIn(util.createGuestUser(user.uid))
                    } else {
                        api.getUser(user.uid)
                            .then(response => {
                                setUserLoggedIn(response.data)
                            })
                            // 404.  User has logged in but not fully registered yet
                            .catch(() => setUserLoggedIn(null))
                    }
                } else {
                    setUserLoggedIn(null)
                }
            })
    }, [])

    function setUserLoggedIn(user) {
        setUser({
            ...user,
            isLoggedIn: !!user
        })
    }

    useEffect(function authStateChangedHandler() {
        if (user.isLoggedIn) {
            // subscribe to user logout events
            const unsubscribe = firebase.onAuthStateChanged(user => {
                if (!user) {
                    setUserLoggedIn(null)
                }
            })

            return () => {
                unsubscribe()
            }
        }
    }, [user.isLoggedIn])

    useEffect(function windowResizeListener() {
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

    function isUserAuthenticated() {
        return user && !user.isGuest && user.isLoggedIn
    }

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
    
    if (user.isLoggedIn === undefined) {
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
                        <LoaderBar isLoading={isRouteLoading} />
                        <Header pathname={props.location.pathname} routeState={props.location.state} isMobile={isMobile} />

                        <div className='container'>
                            <TransitionGroup className='transition-container' component='div'>
                                <CSSTransition timeout={250} classNames='route-transition' key={props.location.pathname}>
                                    <main>
                                        <Switch location={props.location}>
                                            <Route exact path='/' 
                                                render={props => 
                                                        <Home
                                                            {...props} {...defaultProps} {...home}
                                                            userLocation={user.location} onHelpRequestsResponse={handleHelpRequestsResponse} 
                                                        />
                                                }
                                            />
                                            <Route exact path='/help-requests/:uid'
                                                render={props => <HelpRequestDetails {...props} {...defaultProps} navHandler={navHandler} />}
                                            />
                                            <Route exact path='/users/:uid/profile'
                                                render={props => <UserProfile {...props} {...defaultProps} />}
                                            />
                                            <Route exact path='/guest' 
                                                render={props => <Guest {...props} />}
                                            />
                                            <Route exact path='/explore'
                                                render={props => <Explore {...props} />}
                                            />

                                            <PrivateRoute exact path='/add-help-request'
                                                isUserAuthenticated={isUserAuthenticated}
                                                render={props => <AddHelpRequest {...props} {...defaultProps} />}
                                            />
                                            <PrivateRoute exact path='/inbox'
                                                isUserAuthenticated={isUserAuthenticated}
                                                render={props => <Inbox {...props} {...defaultProps} />}
                                            />
                                            <PrivateRoute exact path='/inbox/:uid'
                                                isUserAuthenticated={isUserAuthenticated}
                                                render={props => <Conversation {...props} {...defaultProps} />}
                                            />
                                            <PrivateRoute exact path='/profile'
                                                isUserAuthenticated={isUserAuthenticated}
                                                render={props => <UserProfile {...props} {...defaultProps} />}
                                            />

                                            <Route 
                                                render={props => 
                                                        <Home
                                                            {...props} {...defaultProps} {...home}
                                                            userLocation={user.location} onHelpRequestsResponse={handleHelpRequestsResponse} 
                                                        />
                                                }/>
                                        </Switch>
                                    </main>
                                </CSSTransition>
                            </TransitionGroup>

                            <Navbar
                                loggedInUser={user}
                                isUserAuthenticated={isUserAuthenticated}
                                onLoad={() => setIsRouteLoading(true)}
                                onLoadComplete={() => setIsRouteLoading(false)}
                                navHandler={navHandler}
                            />
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
