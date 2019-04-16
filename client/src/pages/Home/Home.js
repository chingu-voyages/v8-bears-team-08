import React, { useState, useEffect } from 'react'
import moment from 'moment'
import * as api from '../../api'
import './Home.scss'
import '../../styles/loader.css'

function Home(props) {
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
        api.subscribeToHelpRequests(props.location, handleHelpRequests, handleErrorResponse)

        return function unsubscribe() {
            api.unsubscribeFromHelpRequests()
        }
    }, [])

    return (
        <div className='d-flex flex-col'>
            <h2 style={{ margin: 0, paddingBottom: 16+'px'}}>Neighbors near {props.location}:</h2>

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
    // Display only the first character of the user's last name
    const nameParts = helpRequest.user.name.split(' ')
    const lastInitial = nameParts.pop().substring(0, 1) + '.'
    const firstName = nameParts.join(' ')
    
    let neededAt
    if (helpRequest.neededAsap) {
        neededAt = 'ASAP'
    } else {
        // get dates in local timezone
        const now = moment(new Date())
        const requestNeededDatetime = moment(new Date(helpRequest.neededDatetime))
        
        // convert to relative date/time string
        if (requestNeededDatetime.diff(now, 'hours') <= 4) {
            neededAt = requestNeededDatetime.fromNow()
        } else {
            neededAt = requestNeededDatetime.calendar()
        }
    }
    
    return (
        <li className='help-request__list-item d-flex flex-row'>
            <div className='help-request-list-item__info'>
                <div>
                    {firstName} {lastInitial}<br />
                    needs<br />
                    <span className='help-request-list-item__title'>{helpRequest.title}</span><br />
                    {neededAt}<br />
                    {helpRequest.tags && helpRequest.tags.join(', ')}
                </div>
            </div>
            
            <img
                className='help-request-list-item__photo'
                src={helpRequest.photoURL || helpRequest.user.photoURL}
            ></img>
        </li>
    )
}

export default Home
