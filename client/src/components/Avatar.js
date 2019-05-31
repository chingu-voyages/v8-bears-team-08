import React from 'react'
import './Avatar.scss'

function Avatar({ url, size, showHalo }) {
    let classes = `avatar ${size}`

    if (showHalo) {
        classes += ' halo'
    }
    
    return (
        <img className={classes} src={url} alt='User avatar' />
    )
}

export default Avatar