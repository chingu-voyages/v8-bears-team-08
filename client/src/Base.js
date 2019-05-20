import React, { useState, useEffect } from 'react'
import App from './App'
import Login from './pages/Welcome/Login'
import RegisterUser from './pages/Welcome/RegisterUser'
import * as firebase from './helpers/firebase'
import * as api from './api'


function waitForInit() {
    return new Promise((resolve, reject) => {
        const unsubscribe = firebase.onAuthStateChanged(user => {
            unsubscribe()
            resolve(user)
        }, reject)
    })
}

function Base() {
    const [user, setUser] = useState({
        partial: undefined,
        full: undefined
    })

    useEffect(() => {
        waitForInit()
            .then(user => {
                if (user) {
                    api.getUser(user.uid)
                        .then(response => setUser({ full: response.data }))
                        .catch(e => setUser({ full: false }))   // 404.  User has logged in but not fully registered yet
                } else {
                    setUser({ full: false })
                }
            })
    }, [])
    
    useEffect(() => {
        if (user.full) {
            // subscribe to user logout events
            const unsubscribe = firebase.onAuthStateChanged(user => {
                if (!user) {
                    setUser({ full: false })
                }
            })

            return () => {
                unsubscribe()
            }
        }
    }, [user.full])

    function handleSignInSuccessWithAuthResult(authResult) {
        const user = authResult.user
        const profile = authResult.additionalUserInfo.profile // family_name given_name
        const verified_email = authResult.additionalUserInfo.profile.verified_email
        const isNewUser = authResult.additionalUserInfo.isNewUser
        const providerId = authResult.additionalUserInfo.providerId

        // we still need to capture a new user's location (and name if it wasn't populated by the oAuth response)
        const partialUser = {
            location: '',
            email: profile.email,
            name: profile.name,
            lastName: profile.family_name,
            firstName: profile.given_name,
            photoURL: profile.picture,
            emailVerifications: [{ providerId, verified: verified_email}]
        }

        if (!isNewUser) {
            api.getUser(user.uid)
                .then(response => {
                    setUser({ full: response.data })
                })
                .catch(e => {
                    if (e.response.status === 404) {
                        // user has logged in and is known by Firebase Auth, however their account wasn't created in the app db yet
                        setUser({ full: false, partial: partialUser })
                    } else {
                        console.log(e)
                    }
                })
        } else {
            setUser({ full: false, partial: partialUser })
        }

        // Avoid redirects after sign-in
        return false
    }

    
    if (user.full) {
        // user is fully logged in and registered
        return (
            <App user={user.full} />
        )
    } else {
        // user has logged in (to Firebase) but not created (registered) their account yet
        if (user.partial) {
            return (
                <div className='welcome'>
                    <div className='d-flex flex-col'>
                        <RegisterUser user={user.partial} onUserRegistered={user => setUser({ full: user })} />
                    </div>
                </div>
            )
        } else {
            // this displays while the app is first loading as well as if the user hasn't logged in yet
            return (
                <div className='welcome'>
                    <div className='login'>
                        <div className="top">
                            <div className="logo">
                                <img src='/images/kindnest.svg' alt='Kindnest' />
                            </div>
                            <div className="tagline">
                                the app for good neighbors
                            </div>
                        </div>
                        <div className="bottom">
                            { user.full === undefined ? 
                                <h1>Loading...</h1> : 
                                <Login onSignInSuccess={handleSignInSuccessWithAuthResult} /> }
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default Base
