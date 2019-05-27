import React from 'react'
import './Welcome.scss'

function SplashScreen({ children }) {
    return (
        <div className='welcome'>
            <div className='login'>
                <div className="top">
                    <div className="logo">
                        <img src='/images/kindnest.svg' alt='Kindnest' />
                    </div>
                    <div className="tagline">
                        the app for good neighbors
                    </div>
                </div>
                <div className="bottom">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default SplashScreen