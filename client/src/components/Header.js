import React, { useState } from 'react'
import Avatar from '../components/Avatar'
import AsyncLink from '../components/AsyncLink'
import * as firebase from '../helpers/firebase'
import * as util from '../helpers/util'
import * as api from '../api'
import './Header.scss'


function Header(props) {
    const [showDropdownMenu, setShowDropdownMenu] = useState(false)
    const title = getTitleText(props.pathname, props.routeState)
    const isMobile = props.isMobile

    function handleOutsideMenuClick(e) {
        if (e.target.id === 'fullscreen-cover') {
            setShowDropdownMenu(false)
        }
    }
    
    return (
        <header id='header' className='d-flex flex-row flex-center'>
            { showDropdownMenu && <div id='fullscreen-cover' onClick={handleOutsideMenuClick}></div> }

            { title && isMobile ?
                    <div className='title'>
                        {title}
                    </div>
                : 
                    <div className="logo">
                        <img src='/images/kindnest.svg' alt='Kindnest' />
                    </div>
            }
            
            <div className='user-menu'>
                <div onClick={() => setShowDropdownMenu(curr => !curr)}>
                    <Avatar size='xxs' url={props.loggedInUser.photoURL} alt={util.getDisplayName(props.loggedInUser.name)} />
                    <i className='material-icons'>arrow_drop_down</i>
                </div>

                { showDropdownMenu &&
                    <div className='dropdown'>
                        <ul>
                            <li onClick={() => setShowDropdownMenu(false)}>
                                <AsyncLink to='/profile' fetch={() => api.getUserProfile(props.loggedInUser.uid)}>{util.getDisplayName(props.loggedInUser.name)}</AsyncLink>
                            </li>
                            <hr />
                            <li onClick={() => setShowDropdownMenu(false)}>
                                <button onClick={() => firebase.signOut()}>Sign out</button>
                            </li>
                        </ul>
                    </div>
                }
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
    if (pathname.startsWith('/discover')) {
        return 'Discover'
    }

    return undefined
}

export default Header