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
        neededAt = util.getRelativeCalendarTime(new Date(helpRequest.neededDatetime))
    }

    const tags = helpRequest.tags ? helpRequest.tags.slice(0, 2).join(', ') : ''
    
    if (cardSize === 'small') {
        return (
            <li className='small-card'>
                <Link className='card-link' to={{ pathname: `/help-requests/${helpRequest.uid}`, state: helpRequest }}>
                    <div className='info'>
                        <div>
                            <div className='secondary-text'>{displayName} needs</div>
                            <div className='title-text'>{makeSentenceCase(helpRequest.title)}</div>
                            <div className='secondary-text'>{neededAt}</div>
                        </div>
                    </div>
                    
                    <img
                        className='help-request-list-item__photo'
                        src={helpRequest.photoURL || helpRequest.user.photoURL}
                        alt='Help Request'
                        />
                </Link>
                
                <div className='bottom'>
                    <div className='secondary-text'>posted {util.getRelativeTime(helpRequest.created)}</div>
                    <div className='secondary-text'>{tags}</div>
                </div>
            </li>
        )
    } 
    // large card
    else {
        return (
            <li className='big-card'>
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
                        <div className='d-flex flex-col'>
                            <div className='secondary-text'>{tags}</div>
                            <div className='secondary-text'>posted {util.getRelativeTime(helpRequest.created)}</div>
                        </div>
                        { conversationUid &&
                            <LinkButton kind='outlined' to={{ pathname: `/inbox/${conversationUid}`, state: { messageRecipient: helpRequest.user }}}>
                                Send message
                            </LinkButton>
                        }
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