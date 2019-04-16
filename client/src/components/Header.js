import React from 'react'
import firebase from '../helpers/firebase'
import './Header.scss'


function Header() {
    return (
        <header id='topbar' className='d-flex flex-row flex-center'>
            <div className="logo">
               <img src='./images/kindnest.svg' />
            </div>
            
            {/* temporary to allow signout until this is built properly */}
            <div style={{position: 'absolute', right: '10px'}}>
                <a href='#' onClick={() => firebase.auth().signOut()}>Sign-out</a>
            </div>
        </header>
    )
}

export default Header