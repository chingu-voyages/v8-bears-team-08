import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import * as firebase from '../../helpers/firebase'
import * as util from '../../helpers/util'
import { LoggedInUserContext } from '../../App'

function HelpRequestDetails(props) {
    const loggedInUser = useContext(LoggedInUserContext)
    console.log('HRD props', props)
    const helpRequest = props.location.state
    const conversationUid = util.createConversationUidFromUserUids(helpRequest.user.uid, loggedInUser.uid)

    return (
        <div>
            <Link 
                to={{ 
                        pathname: `/inbox/${conversationUid}`, 
                        state: { messageRecipient: helpRequest.user }
                    }}>Send Message</Link>

            <h1>{helpRequest && helpRequest.title}</h1>
        </div>
    )
}

export default HelpRequestDetails