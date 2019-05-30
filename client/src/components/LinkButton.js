/* eslint-disable no-unused-vars */
import React from 'react'
import Button from '../components/Button'
import { withRouter } from 'react-router'

const LinkButton = (props) => {
    const {
        history,
        location,
        match,
        staticContext,
        to,
        onClick,
        ...rest
    } = props
  
    return (
        <Button
            {...rest}
            onClick={(event) => {
                onClick && onClick(event)
                history.push(to)
            }}
        />
    )
}

export default withRouter(LinkButton)