import React from 'react'
import './Welcome.scss'

function Welcome(props) {

    function onCreateClick() {
        props.onCreateClick()
    }
    function onLoginClick() {
        props.onLoginClick()
    }

    return (
        <div className="login">
            <div className="top">
                <div className="logo">
                    <img src='./images/kindnest.svg' />
                </div>
                <div className="tagline">
                    the app for good neighbors
                </div>
            </div>
            <div className="bottom">
                <button className="create-button" onClick={onCreateClick}>Create an account</button>
                <button className="login-button" onClick={onLoginClick}>Login</button>
                <div className="forgot">Forgot Password?</div>
            </div>
        </div>
    )
}

export default Welcome