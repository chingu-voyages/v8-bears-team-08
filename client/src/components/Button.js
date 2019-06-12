import React from 'react'
import './Button.scss'


function Button(props) {
    const { type, style, isLoading, onClick, children, disabled, ...rest } = props

    let classes = 'btn'
    
    if (style === 'text') {
        classes += ' btn-text'
    } else if (style === 'outlined') {
        classes += ' btn-outlined'
    } else {
        classes += ' btn-contained'
    }

    if (isLoading) {
        classes += ' btn-disabled spinning'
    }
    if (disabled) {
        classes += ' btn-disabled'
    }

    function handleOnClick(event) {
        event.stopPropagation()
        onClick && onClick(event)
    }

    return (
        <button type={type} disabled={isLoading} className={classes} onClick={e => handleOnClick(e)} {...rest}>
            {children}
        </button>
    )
}

export default Button