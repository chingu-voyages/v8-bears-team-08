import React from 'react'
import './Avatar.scss'

function Avatar({ url, size, showHalo, className, ...rest }) {
    let classes = `avatar ${size} ${className}`

    if (showHalo) {
        classes += ' halo'
    }

    return (
        <img {...rest} className={classes} src={url} alt='User avatar' />
    )
}

export default Avatar