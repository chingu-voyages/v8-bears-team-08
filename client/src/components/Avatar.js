import React from 'react'
import './Avatar.scss'

function Avatar({ url, size, showHalo, kind, className, alt, ...rest }) {
    let classes = `avatar ${size} ${className || ''}`

    if (showHalo) {
        classes += ' halo'
    }

    if (kind === 'square') {
        classes += ' square'
    } else {
        classes += ' round'
    }

    return (
        <img src={url} className={classes} alt={alt || 'User avatar'} {...rest} />
    )
}

export default Avatar