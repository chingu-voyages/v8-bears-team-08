import React from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase'

function Login(props) {
    const firebaseAuthUiConfig = {
        signInFlow: 'popup',
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            'anonymous'
        ],
        signInSuccessUrl: '/',
        callbacks: {
            signInSuccessWithAuthResult: props.onSignInSuccess
        }
    }

    return (
        <StyledFirebaseAuth uiConfig={firebaseAuthUiConfig} firebaseAuth={firebase.auth()} />
    )
}

export default Login