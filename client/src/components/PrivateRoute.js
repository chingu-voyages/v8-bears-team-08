import React from 'react'
import { Route, Redirect } from 'react-router-dom'

function PrivateRoute({ render, component, isAuthenticated, redirectTo, ...rest }) {
    const Component = render || component
    const to = redirectTo || '/guest'

    return (
        <Route 
            {...rest}
            render={props => {
                const referrer = createReferrer(props.location.pathname)

                return (
                    isAuthenticated() ?
                        <Component {...props} />
                        : <Redirect to={{ pathname: to, state: { referrer: referrer }}} />
                )
            }} 
        />
    )
}

function createReferrer(pathname) {
    const re = /\/inbox\/.+/
    if (re.test(pathname)) {
        return '/'
    }

    return pathname
}

export default PrivateRoute