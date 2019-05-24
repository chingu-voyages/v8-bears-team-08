import React from 'react'
import { Route, Redirect } from 'react-router-dom'


const PrivateRoute = ({ component: Component, authenticated, ...rest }) => (
    <Route 
        {...rest}
        render={(props) => (
            authenticated === true
                ? <Component {...props} />
                : <Redirect to={{ pathname: '/guest', state: { referrer: props.location }}} />
        )} 
    />
)

export default PrivateRoute