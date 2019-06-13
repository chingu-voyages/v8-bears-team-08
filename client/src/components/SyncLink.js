import React, { useContext } from 'react'
import { withRouter } from 'react-router-dom'
import { NavHandlerContext } from '../App';

function SyncLink(props) {
    const navHandler = useContext(NavHandlerContext)
    
    function handleClick(e) {
        e.preventDefault()

        navHandler.syncNavClicked(props.to)
        props.history.push({
            pathname: props.to
        })
    }
    
    return <a href={props.to} onClick={handleClick}>{props.children}</a>
}

export default withRouter(SyncLink)