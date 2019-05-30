import React from 'react'
import { withRouter } from 'react-router-dom'

function SyncLink(props) {
    
    function handleClick(e) {
        e.preventDefault()

        props.navHandler.syncNavClicked(props.to)
        props.history.push({
            pathname: props.to
        })
    }
    
    return <a href={props.to} onClick={handleClick}>{props.children}</a>
}

export default withRouter(SyncLink)