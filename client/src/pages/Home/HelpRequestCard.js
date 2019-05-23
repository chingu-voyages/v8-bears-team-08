import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { LoggedInUserContext } from '../../App'
import LinkButton from '../../components/LinkButton'
import * as util from '../../helpers/util'
import './HelpRequestCard.scss'

function HelpRequestCard({ cardSize, helpRequest }) {
    const loggedInUser = useContext(LoggedInUserContext)
    // Display only the first character of the user's last name
    const displayName = util.getDisplayName(helpRequest.user.name)
    const conversationUid = util.createConversationUidFromUserUids(helpRequest.user.uid, loggedInUser.uid)
    
    let neededAt
    if (helpRequest.neededAsap) {
        neededAt = 'ASAP'
    } else {
        neededAt = 'on ' + util.getRelativeLocaleTime(new Date(helpRequest.neededDatetime))
    }
    
    if (cardSize === 'small') {
        return (
            <li className='help-request-card'>
                <div className='small-card'>
                    <Link className='card-link' to={{ pathname: `/help-requests/${helpRequest.uid}`, state: helpRequest }}>
                        <div className='info'>
                            <div>
                                <div className='secondary-text'>{displayName} needs</div>
                                <div className='title-text'>{makeSentenceCase(helpRequest.title)}</div>
                                <div className='secondary-text'>{neededAt}</div>
                            </div>

                            <div>
                                <div className='secondary-text'>posted {util.getRelativeTime(helpRequest.created)}</div>
                            </div>
                        </div>
                        
                        <img
                            className='help-request-list-item__photo'
                            src={helpRequest.photoURL || helpRequest.user.photoURL}
                            alt='Help Request'
                            />
                    </Link>
                </div>
            </li>
        )
    } 
    // large card
    else {
        return (
            <li className='help-request-card'>
                <div className='big-card'>
                    <Link className='header' to={{ pathname: `/help-requests/${helpRequest.uid}`, state: helpRequest }}>
                        <img
                            className='help-request-list-item__photo'
                            src={helpRequest.photoURL || helpRequest.user.photoURL}
                            alt='Help Request'
                            />
                    </Link>

                    <div className='info'>
                        <Link to={{ pathname: `/help-requests/${helpRequest.uid}`, state: helpRequest }}>
                            <div>
                                <div className='secondary-text'>{displayName} needs</div>
                                <div className='title-text'>{makeSentenceCase(helpRequest.title)}</div>
                                <div className='secondary-text'>{neededAt}</div>
                            </div>

                            <div>
                                <p className='description'>{helpRequest.description}</p>
                            </div>
                        </Link>

                        <div className='bottom'>
                            <div className='secondary-text'>posted {util.getRelativeTime(helpRequest.created)}</div>
                            <LinkButton type='outlined' to={{ pathname: `/inbox/${conversationUid}`, state: { messageRecipient: helpRequest.user }}}>
                                Send message
                            </LinkButton>
                        </div>
                    </div>
                </div>
            </li>
        )
    }
}

function makeSentenceCase(text) {
    return text.charAt(0).toUpperCase() + text.substring(1)
    
}

export default HelpRequestCard