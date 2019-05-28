import React from 'react'
import { Redirect as ReactRouterRedirect } from 'react-router-dom'

function Redirect({history, ...rest }) {
    if (history.action !== 'REPLACE') {
        return <ReactRouterRedirect {...rest} />
    }

    return null
}

export default ReactRouter.withRouter(Redirect)