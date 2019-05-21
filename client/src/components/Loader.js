import React from 'react'
import './Loader.scss'

function Loader(props) {
    let classes = 'loading'
    if (props.theme === 'light') {
        classes += ' loader-light'
    }
    
    return (
        <div className='loader'>
            <div className={classes}></div>
        </div>
    )

}

export default Loader