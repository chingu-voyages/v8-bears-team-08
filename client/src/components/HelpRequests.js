import React, { useState, useEffect } from 'react'
import * as api from '../api'
import '../styles/loader.css'


function HelpRequests() {
    const [helpRequests, setHelpRequests] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(function() {
        function handleHelpRequests(helpRequests) {
            setIsLoading(false)
            setHelpRequests(helpRequests)
        }

        function handleErrorResponse(error) {
            setIsLoading(false)
            console.log(error)
        }
        
        setIsLoading(true)
        api.subscribeToHelpRequests(handleHelpRequests, handleErrorResponse)

        return function unsubscribe() {
            api.unsubscribeFromHelpRequests()
        }
    }, [])

    return (
        <div className='d-flex flex-col flex-center'>
            <HelpRequestList helpRequests={helpRequests} />
            { isLoading && <div className='loading'></div> }
        </div>
    )
}

function HelpRequestList({ helpRequests }) {
    return (
        <ul>
            { helpRequests.map(helpRequest => (
                <li 
                    key={helpRequest.uid}>
                    <HelpRequest helpRequest={helpRequest} />
                </li>
            ))}
        </ul>
    )
}

function HelpRequest({ helpRequest }) {
    return (
        <div>{helpRequest.user.name} needs {helpRequest.title}</div>
    )
}

export default HelpRequests