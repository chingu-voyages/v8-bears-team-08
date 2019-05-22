import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import LinkButton from '../../components/LinkButton'
import * as util from '../../helpers/util'
import { LoggedInUserContext } from '../../App'
import './HelpRequestDetails.scss'

function HelpRequestDetails(props) {
    const loggedInUser = useContext(LoggedInUserContext)
    const helpRequest = props.location.state

    if (!helpRequest) {
        return <h1>404</h1>
    }

    const conversationUid = util.createConversationUidFromUserUids(helpRequest.user.uid, loggedInUser.uid)
    return (
        <div className='help-request-details'>
            <h2 className='heading-2'>
                <strong><Link to={`/users/${helpRequest.user.uid}/profile`}>{util.getDisplayName(helpRequest.user.name)}</Link></strong> needs <strong className='primary-font-color'>{helpRequest.title}</strong></h2>
            <br className='section-separator-space' />

            <div className='d-flex flex-row help-request-details__info'>
                <img src={helpRequest.photoURL || helpRequest.user.photoURL} alt='Help Request' />

                <div className='d-flex flex-col'>
                    <p><strong>Posted {util.getRelativeLocaleTime(helpRequest.created)}</strong> near {helpRequest.location}</p>
                    <p>{helpRequest.neededAsap || util.getRelativeLocaleTime(helpRequest.neededDatetime)}</p>
                    <br />
                    
                    {helpRequest.tags && <p><strong>Tags:</strong></p>}
                    {helpRequest.tags && helpRequest.tags.join(', ')}
                </div>
            </div>
            <br className='section-separator-space' />

            <p>{helpRequest.description}</p>
            <hr className='section-separator-line' />

            <div className='d-flex flex-col flex-center'>
                <h3 className='heading-3'>Can you help your neighbor?</h3>
                <br />
                
                <LinkButton
                    to={{ 
                        pathname: `/inbox/${conversationUid}`, 
                        state: { messageRecipient: helpRequest.user }
                    }}>
                    Send {util.getDisplayName(helpRequest.user.name)} a message
                </LinkButton>
            </div>
        </div>
    )
}

export default HelpRequestDetails