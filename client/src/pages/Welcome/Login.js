import React, { useState } from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import { Redirect } from 'react-router-dom'
import firebase from 'firebase'
import * as api from '../../api'
import SplashScreen from './SplashScreen'

function Login(props) {
    const [unregisteredUser, setUnregisteredUser] = useState(undefined)
    const referrer = (props.location.state && props.location.state.referrer) || '/'

    const firebaseAuthUiConfig = {
        signInFlow: 'popup',
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            'anonymous'
        ],
        signInSuccessUrl: '/',
        callbacks: {
            signInSuccessWithAuthResult: handleUserLogin
        }
    }
    
    function handleUserLogin(authResult) {
        const user = authResult.user

        if (user.isAnonymous) {
            props.onUserSignin(createGuestUser(user.uid), referrer)
        } else {
            const profile = authResult.additionalUserInfo.profile // family_name given_name
            const verified_email = authResult.additionalUserInfo.profile.verified_email
            const providerId = authResult.additionalUserInfo.providerId
            const userDetails = {
                location: '',
                email: profile.email,
                name: profile.name,
                lastName: profile.family_name,
                firstName: profile.given_name,
                photoURL: profile.picture,
                emailVerifications: [{ providerId, verified: verified_email}]
            }

            if (authResult.additionalUserInfo.isNewUser) {
                setUnregisteredUser(userDetails)
            } else {
                // we know this user already, try to fetch their info
                api.getUser(user.uid)
                    .then(response => {
                        props.onUserSignin(response.data, referrer)
                    })
                    .catch(e => {
                        if (e.response.status === 404) {
                            // user has logged in and is known by Firebase Auth, however their account wasn't created in the app db yet
                            setUnregisteredUser(userDetails)
                        } else {
                            console.log('Error:', e)
                        }
                    })
            }
        }
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

    if (unregisteredUser && (!props.location.state || !props.location.state.user)) {
        return <Redirect to={{ pathname: '/register', state: { user: unregisteredUser, referrer: referrer }}} />
    }

    return (
        <SplashScreen>
            <StyledFirebaseAuth uiConfig={firebaseAuthUiConfig} firebaseAuth={firebase.auth()} />
        </SplashScreen>
    )
}

export default Login