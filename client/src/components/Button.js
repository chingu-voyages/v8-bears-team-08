import React from 'react'
import './Button.scss'


function Button(props) {
    const { isLoading, type, children, ...rest } = props

    let classes = 'btn'
    
    if (type === 'outlined') {
        classes += ' btn-outlined'
    } else {
        classes += ' btn-contained'
    }

    if (isLoading) {
        classes += ' btn-disabled spinning'
    }

    return (
        <button className={classes} {...rest}>
            {children}
        </button>
    )
}

export default Button