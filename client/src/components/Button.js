import React from 'react'
import './Button.scss'


function Button(props) {
    const { isLoading, type, children, onClick, ...rest } = props

    let classes = 'btn'
    
    if (type === 'text') {
        classes += ' btn-text'
    } else if (type === 'outlined') {
        classes += ' btn-outlined'
    } else {
        classes += ' btn-contained'
    }

    if (isLoading) {
        classes += ' btn-disabled spinning'
    }

    function handleOnClick(event) {
        event.stopPropagation()
        onClick && onClick(event)
    }

    return (
        <button className={classes} onClick={e => handleOnClick(e)} {...rest}>
            {children}
        </button>
    )
}

export default Button