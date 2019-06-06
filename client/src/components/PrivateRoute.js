import React from 'react'
import { Route } from 'react-router-dom'
import Guest from '../pages/Guest/Guest'

function PrivateRoute({ render, component, isUserAuthenticated, ...rest }) {
    const Component = render || component

    return (
        <Route 
            {...rest}
            render={props => {
                const referrer = createReferrer(props.location.pathname)

                return (
                    isUserAuthenticated()
                        ? <Component {...props} />
                        : <Guest {...props} referrer={referrer} />
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