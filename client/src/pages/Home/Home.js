import React, { useEffect } from 'react'
import HelpRequestList from './HelpRequestList'
import * as api from '../../api'
import Loader from '../../components/Loader'
import './Home.scss'

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
        <div className='home'>
            <h2 className='heading-2'>Neighbors near <span className='primary-font-color'>{props.userLocation}</span></h2>

            { props.isLoaded ? (
                <HelpRequestList helpRequests={props.helpRequests} />
            ) : (
                <Loader />
            )}
        </div>
    )
}


export default Home
