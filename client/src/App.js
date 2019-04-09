import React, { Component } from 'react';
import firebase from './helpers/firebase'
import Login from './components/Login'
import './App.css';


class App extends Component {
    state = {
        isSignedIn: undefined
    }

    componentDidMount() {
        this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
            (user) => this.setState({isSignedIn: !!user})
        )
    }
      
    // Make sure we un-register Firebase observers when the component unmounts.
    componentWillUnmount() {
        this.unregisterAuthObserver()
    }

    render() {
        // this avoids the initial flash of the login screen when the user is actually logged in
        if (this.state.isSignedIn === undefined) {
            return null
        }

        if (this.state.isSignedIn) {
            return (
                <div>
                    <header className='topbar'>
                        Kindnest <a href='#' onClick={() => firebase.auth().signOut()}>Sign-out</a>
                    </header>

                    <div className='container d-flex'>
                        <div className='sidebar'>
                            <ul>
                                <li>Home</li>
                                <li>Add New</li>
                                <li>Messages</li>
                                <li>Profile</li>
                            </ul>
                        </div>
                        
                        <main className='flex-grow'>
                            Welcome {firebase.auth().currentUser.displayName}! You are now signed-in!
                        </main>
                    </div>
                </div>
            )
        } else {
            return (
                <main>
                    <h1>Kindnest</h1>
                    <Login />
                </main>
            )
        }
    }
}

export default App;
