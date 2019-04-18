import React, { useEffect } from 'react'
import moment from 'moment'
import * as api from '../../api'
import './Home.scss'
import '../../styles/loader.css'

/*
    This view will load data differently than other views.
    This view uses a subscription directly to the database in order to get realtime updates.
    Any changes in the dataset will trigger an update and this view will update immediately.

    // TODO: Handle error state when props.error is not null
*/
function Home(props) {

    useEffect(() => {
        // This fires on every mount however Firestore caches data so it doesn't need to fully reload the data from server
        api.subscribeToHelpRequests(props.userLocation, props.onHelpRequestsResponse, props.onHelpRequestsResponse)

        return function unsubscribe() {
            api.unsubscribeFromHelpRequests()
        }
    }, [])

    return (
        <div className='d-flex flex-col'>
            <h1>Neighbors near {props.userLocation}:</h1>

            { props.isLoaded ? (
                <ul className='help-request__list d-flex flex-col'>
                    { props.helpRequests.map(helpRequest => (
                        <HelpRequest key={helpRequest.uid} helpRequest={helpRequest} />
                    ))}
                </ul>
            ) : (
                <div className='loading'></div>
            )}
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
