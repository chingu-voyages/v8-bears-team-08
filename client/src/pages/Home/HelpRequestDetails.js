import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as firebase from '../../helpers/firebase'
import * as util from '../../helpers/util'

function HelpRequestDetails(props) {
    console.log('HRD props', props)
    const helpRequest = props.location.state
    const conversationUid = util.createConversationUidFromUserUids(helpRequest.user.uid, firebase.getUser().uid)

    return (
        <div>
            <Link 
                to={{ 
                        pathname: `/inbox/${conversationUid}`, 
                        state: { user: helpRequest.user }
                    }}>Send Message</Link>

            <h1>{helpRequest && helpRequest.title}</h1>
        </div>
    )
}

export default HelpRequestDetails