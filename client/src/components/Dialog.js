import React from 'react'
import './Dialog.scss'

function Dialog(props) {
    return (
        <div className={`dialog ${props.shouldShow ? 'show' : 'hide'}`} onClick={props.hide}>
            <div className='scrim' >
                <div className='dialog-box' onClick={e => e.stopPropagation()}>
                    {props.children}
                </div>
            </div>
        </div>
    )
}

export default Dialog