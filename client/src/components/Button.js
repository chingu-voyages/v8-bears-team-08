import React from 'react'
import './Button.scss'

function Button(props) {
    const { isLoading, size, children, ...rest } = props

    let classes = 'btn'
    if (isLoading) {
        classes += ' btn-disabled spinning'
    }
    if (size === 'large') {
        classes += ' btn-large'
    }

    return (
        <button className={classes} {...rest}>
            {children}
        </button>
    )
}

export default Button