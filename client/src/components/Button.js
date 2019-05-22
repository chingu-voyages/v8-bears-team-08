import React from 'react'
import './Button.scss'


function Button(props) {
    const { isLoading, size, type, children, ...rest } = props

    let classes = 'btn'
    
    if (isLoading) {
        classes += ' btn-disabled spinning'
    }
    
    if (type === 'outlined') {
        classes += ' btn-outlined'
    } else {
        classes += ' btn-contained'
    }

    return (
        <button className={classes} {...rest}>
            {children}
        </button>
    )
}

export default Button