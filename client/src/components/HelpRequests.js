import React, { useState, useEffect } from 'react'
import * as api from '../api'
import '../styles/loader.css'
import '../styles/HelpRequest.css'


function HelpRequests() {
    const [helpRequests, setHelpRequests] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(function() {
        function handleHelpRequests(helpRequests) {
            setIsLoading(false)
            setHelpRequests(helpRequests)
        }
        
        setIsLoading(true)
        api.subscribeToHelpRequests(handleHelpRequests)

        return function unsubscribe() {
            api.unsubscribeFromHelpRequests()
        }
    }, [])

    return (
        <div className='d-flex flex-col'>
            <h2 style={{ margin: 0, paddingBottom: 16+'px'}}>Neighbors near 11221:</h2>
            <ul className='help-request__list d-flex flex-col'>
                { helpRequests.map(helpRequest => (
                    <HelpRequest key={helpRequest.uid} helpRequest={helpRequest} />
                ))}
            </ul>

            { isLoading && <div className='loading'></div> }
        </div>
    )
}

function HelpRequest({ helpRequest }) {
    const nameParts = helpRequest.user.name.split(' ')
    const lastInitial = nameParts.pop().substring(0, 1) + '.'
    const firstName = nameParts.join(' ')
    
    return (
        <li className='help-request__list-item d-flex flex-row'>
            <div className='help-request-list-item__info'>
                <div style={{padding: '16px'}}>
                    {firstName} {lastInitial}<br />
                    needs<br />
                    <span className='help-request-list-item__title'>{helpRequest.title}</span>
                </div>

                <div className='help-request-list-item__tags'>{helpRequest.tags && helpRequest.tags.join(', ')}</div>
            </div>
            
            <img
                className='help-request-list-item__photo'
                src={helpRequest.photoURL || helpRequest.user.photoURL}
            ></img>
        </li>
    )
}

export default HelpRequests