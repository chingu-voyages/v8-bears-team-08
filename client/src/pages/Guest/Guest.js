import React from 'react'
import { Link } from 'react-router-dom'
import * as firebase from '../../helpers/firebase'
import './Guest.scss'

function Guest(props) {
    console.log(props)

    return (
        <div className='guest'>
            <div className='title'>
                <p>You must be a registered user to access this content.</p>
                <p>Please <a href={props.location.state.referrer || '/'} onClick={() => firebase.signOut()}>login or create an account</a>.</p>
            </div>
        </div>
    )
}

export default Guest