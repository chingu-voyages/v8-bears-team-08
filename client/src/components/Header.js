import React from 'react'
import * as firebase from '../helpers/firebase'
import * as util from '../helpers/util'
import './Header.scss'


function Header(props) {
    const title = getTitleText(props.pathname, props.routeState)
    const isMobile = props.isMobile

    return (
        <header id='header' className='d-flex flex-row flex-center'>
            { title && isMobile ?
                    <div className='title'>
                        {title}
                    </div>
                : 
                    <div className="logo">
                        <img src='/images/kindnest.svg' alt='Kindnest' />
                    </div>
            }
            
            {/* temporary to allow signout until this is built properly */}
            <div style={{position: 'absolute', right: '20px'}}>
                <a href='/' onClick={() => firebase.signOut()}>Sign-out</a>
            </div>
        </header>
    )
}

function getTitleText(pathname, routeState) {
    if (pathname === '/inbox') {
        return 'Inbox'
    }
    if (pathname.startsWith('/inbox')) {
        if (routeState) {
            return util.getDisplayName(routeState.messageRecipient.name)
        }
        return 'Conversation'
    }
    if (pathname === '/profile') {
        return 'My Profile'
    }
    if (pathname === '/add-help-request') {
        return 'Add a Request'
    }
    if (pathname.startsWith('/users')) {
        if (routeState) {
            return util.getDisplayName(routeState.data.name)
        }
        return undefined
    }

    return undefined
}

export default Header