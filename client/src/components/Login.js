import React from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/app'

const firebaseAuthUiConfig = {
    signInFlow: 'popup',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ],
    callbacks: {
        // Avoid redirects after sign-in.
        signInSuccessWithAuthResult: () => false
    }
}

function Login() {
    return (
        <StyledFirebaseAuth uiConfig={firebaseAuthUiConfig} firebaseAuth={firebase.auth()} />
    )
}

export default Login