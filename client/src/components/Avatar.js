import React from 'react'
import './Avatar.scss'

function Avatar({ url, size, showHalo, kind, className, alt, width, height, ...rest }) {
    let classes = `avatar ${size} ${className || ''}`

    if (showHalo) {
        classes += ' halo'
    }

    if (kind === 'square') {
        classes += ' square'
    } else {
        classes += ' round'
    }

    const style = {}
    if (width && height) {
        style.width = width
        style.minWidth = width
        style.height = height
        style.minHeight = height
    }

    return (
        <img src={url} className={classes} alt={alt || 'User avatar'} style={style} {...rest} />
    )
}

export default Avatar