import React, { useEffect } from 'react'
import HelpRequest from './HelpRequest'
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
                <ul>
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


export default Home
