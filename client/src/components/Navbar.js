import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import AsyncLink from './AsyncLink'
import SyncLink from './SyncLink'
import * as api from '../api'
import './Navbar.scss'

function Navbar({ location, loggedInUser, navHandler }) {
    const [activeRoute, setActiveRoute] = useState('')
    const menuItems = [
        {
            name: 'Home',
            icon: 'home',
            path: '/',
            otherMatches: ['/help-requests'],
            isAsync: false
        },
        {
            name: 'Explore',
            icon: 'explore',
            path: '/explore',
            isAsync: false
        },
        {
            name: 'Add New',
            icon: 'add_box',
            path: '/add-help-request',
            isAsync: false
        },
        {
            name: 'Inbox',
            icon: 'email',
            path: '/inbox',
            isAsync: true,
            delayMs: 1500,
            fetch: () => api.getConversationsForUser(loggedInUser.uid),
        },
        {
            name: 'Profile',
            icon: 'account_circle',
            path: '/profile',
            isAsync: true,
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
        <div className='navbar'>
            <ul>
                {menuItems.map(menuItem => (
                    <li key={menuItem.name} className={menuItem.name === activeRoute ? 'active' : ''}>
                        { menuItem.isAsync ?
                            <AsyncLink to={menuItem.path} navHandler={navHandler} fetch={menuItem.fetch} delayMs={menuItem.delayMs}>
                                <i className='material-icons'>{menuItem.icon}</i>
                                <span>{menuItem.name}</span>
                            </AsyncLink>
                        :
                            <SyncLink to={menuItem.path} navHandler={navHandler}>
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