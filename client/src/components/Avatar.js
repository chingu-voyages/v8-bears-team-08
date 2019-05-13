import React from 'react'
import './Avatar.css'

function Avatar({ url, size, showHalo }) {
    let classes = 'avatar'
    if (size == 'small') {
        classes += ' avatar-small'
    } else if (size == 'medium') {
        classes += ' avatar-medium'
    }

    if (showHalo) {
        classes += ' avatar-halo'
    }
    
    return (
        <img className={classes} src={url} />
    )
}

export default Avatar