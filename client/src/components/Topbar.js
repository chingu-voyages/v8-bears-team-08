import React from 'react'
import firebase from '../helpers/firebase'
import '../styles/Topbar.css'


function Topbar() {
    return (
        <header id='topbar' className='d-flex flex-row flex-center'>
            <span className='logo'>kind</span><span className='nest'>nest</span>
            <div style={{position: 'absolute', right: '10px'}}>
                <a href='#' onClick={() => firebase.auth().signOut()}>Sign-out</a>
            </div>
        </header>
    )
}

export default Topbar