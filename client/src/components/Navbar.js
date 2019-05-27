import React, { useState, useEffect } from 'react'
import { withRouter, Link } from 'react-router-dom'
import './Navbar.scss'

function Navbar({ location }) {
    const [activeRoute, setActiveRoute] = useState('')
    const menuItems = [
        {
            name: 'Home',
            icon: 'home',
            path: '/',
            otherMatches: ['/help-requests']
        },
        {
            name: 'Explore',
            icon: 'explore',
            path: '/explore'
        },
        {
            name: 'Add New',
            icon: 'add_box',
            path: '/add-help-request'
        },
        {
            name: 'Inbox',
            icon: 'email',
            path: '/inbox'
        },
        {
            name: 'Profile',
            icon: 'account_circle',
            path: `/profile`
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
    }, [location])

    return (
        <div className='navbar'>
            <ul>
                {menuItems.map(menuItem => (
                    <li key={menuItem.name} className={menuItem.name === activeRoute ? 'active' : ''}>
                        <Link to={menuItem.path}>
                            <i className='material-icons'>{menuItem.icon}</i>
                            <span>{menuItem.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default withRouter(Navbar)