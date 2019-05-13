import React from 'react'
import { Link } from 'react-router-dom'
import './Navbar.scss'


function Navbar(props) {
    return (
        <div className='navbar'>
            <ul>
                <li>
                    <Link to='/'>
                        <i className='material-icons'>home</i>
                        <span>Home</span>
                    </Link>
                </li>
                <li>
                    <Link to='/#'>
                        <i className='material-icons'>explore</i>
                        <span>Discover</span>
                    </Link>
                </li>
                <li>
                    <Link to='/#'>
                        <i className='material-icons'>add_box</i>
                        <span>Add New</span>
                    </Link>
                </li>
                
                
                <li><Link to='/inbox/'><i className='material-icons'>email</i>Inbox</Link></li>
                <li><Link to={`/users/${props.userUid}/profile`}><i className='material-icons'>account_circle</i>Profile</Link></li>
                {/* TODO: remove this once login flow components are created */}
                <li><Link to='/login'>Login</Link></li>
            </ul>
        </div>
    )
}

export default Navbar