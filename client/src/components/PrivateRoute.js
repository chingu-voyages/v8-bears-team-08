import React from 'react'
import { Route, Redirect } from 'react-router-dom'

const WorkAround = ({ action, children }) =>
  action === 'REPLACE' ? null : children

function PrivateRoute({ render: render, component: component, authenticated, ...rest }) {
    const Component = render || component

    return (
        <Route 
            {...rest}
            render={(props) => {
                console.log(props)
                const referrer = getReferrer(props.location.pathname)
                console.log('referrer', referrer)
                return (
                    authenticated === true
                    ? <Component {...props} />
                    : (
                        <WorkAround action={props.history.action}>
                            <Redirect to={{ pathname: '/guest', state: { referrer: referrer }}} />
                        </WorkAround>
                    )
                )
            }} 
        />
    )
}

function getReferrer(pathname) {
    const re = /\/inbox\/.+/
    if (re.test(pathname)) {
        return '/'
    }

    return pathname
}

export default PrivateRoute