import React, { useState, useEffect } from 'react'
import { withRouter, Link } from 'react-router-dom'
import './Navbar.scss'

function Navbar(props) {
    const menuItems = [
        {
            name: 'Home',
            icon: 'home',
            path: '/'
        },
        {
            name: 'Explore',
            icon: 'explore',
            path: '/explore'
        },
        {
            name: 'Add New',
            icon: 'add_box',
            path: '/help-requests'
        },
        {
            name: 'Inbox',
            icon: 'email',
            path: '/inbox'
        },
        {
            name: 'Profile',
            icon: 'account_circle',
            path: `/users/${props.userUid}/profile`
        },
    ]

    const [active, setActive] = useState('')

    useEffect(() => {
        setActive('')
        menuItems.forEach(item => {
            if (item.path === props.location.pathname) {
                setActive(item.name)
            }
        })
    }, [props.location])

    return (
        <div className='navbar'>
            <ul>
                {menuItems.map(menuItem => (
                    <li key={menuItem.name} className={menuItem.name === active ? 'active' : ''}>
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