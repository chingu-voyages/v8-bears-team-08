import React from 'react'
import './LoaderBar.scss'

function LoaderBar({ isLoading }) {
    
    if (isLoading) {
        return (
            <div className="progress">
                <div className="indeterminate"></div>
            </div>
        )
    }

    return null
}

export default LoaderBar