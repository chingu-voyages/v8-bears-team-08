import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import AsyncLink from './AsyncLink'
import SyncLink from './SyncLink'
import * as api from '../api'
import './Navbar.scss'

function Navbar({ location, loggedInUser, isUserAuthenticated }) {
    const [activeRoute, setActiveRoute] = useState('')
    const menuItems = [
        {
            name: 'Home',
            icon: 'home',
            path: '/',
            otherMatches: ['/help-requests'],
            isAsync: false,
            isPrivate: false
        },
        {
            name: 'Discover',
            icon: 'explore',
            path: '/discover',
            isAsync: true,
            isPrivate: false,
            delayMs: 1500,
            fetch: api.getDiscoverFeed
        },
        {
            name: 'Add New',
            icon: 'add_box',
            path: '/add-help-request',
            isAsync: false,
            isPrivate: true
        },
        {
            name: 'Inbox',
            icon: 'email',
            path: '/inbox',
            isAsync: true,
            isPrivate: true,
            delayMs: 1500,
            fetch: () => api.getConversationsForUser(loggedInUser.uid),
        },
        {
            name: 'Profile',
            icon: 'account_circle',
            path: '/profile',
            isAsync: true,
            isPrivate: true,
            delayMs: 2000,
            fetch: () => api.getUserProfile(loggedInUser.uid),
        }
    ]

    useEffect(() => {
        setActiveRoute('')

        menuItems.forEach(item => {
            if (item.otherMatches) {
                if (location.pathname === item.path || item.otherMatches.filter(match => location.pathname.startsWith(match)).length > 0) {
                    setActiveRoute(item.name)
                }
            } else if (location.pathname.startsWith(item.path)) {
                setActiveRoute(item.name)
            }
        })
    }, [location, menuItems])

    return (
        // Since AsyncLinks fetch their data before rendering/changing route, for any private routes,
        // we should check if the user is authenticated before rendering an AsyncLink.  If user is not auth,
        // just render it as a normal SyncLink which goes straight to <PrivateRoute />.
        <div className='navbar'>
            <ul>
                {menuItems.map(menuItem => (
                    <li key={menuItem.name} className={menuItem.name === activeRoute ? 'active' : ''}>
                        { menuItem.isAsync && (!menuItem.isPrivate || (menuItem.isPrivate && isUserAuthenticated())) ?
                            <AsyncLink to={menuItem.path} fetch={menuItem.fetch} delayMs={menuItem.delayMs}>
                                <i className='material-icons'>{menuItem.icon}</i>
                                <span>{menuItem.name}</span>
                            </AsyncLink>
                        :
                            <SyncLink to={menuItem.path}>
                                <i className='material-icons'>{menuItem.icon}</i>
                                <span>{menuItem.name}</span>
                            </SyncLink>
                        }
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default withRouter(Navbar)