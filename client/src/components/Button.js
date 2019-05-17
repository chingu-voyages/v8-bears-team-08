import React from 'react'
import './Button.scss'

function Button(props) {
    return (
        <button className={props.isLoading ? 'btn btn-disabled spinning' : 'btn'} {...props}>
            {props.children}
        </button>
    )
}

export default Button