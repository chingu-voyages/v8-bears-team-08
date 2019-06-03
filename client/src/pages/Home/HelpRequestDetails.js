import React from 'react'
import LinkButton from '../../components/LinkButton'
import AsyncLink from '../../components/AsyncLink'
import * as util from '../../helpers/util'
import * as api from '../../api'
import './HelpRequestDetails.scss'

function HelpRequestDetails(props) {
    const helpRequest = props.location.state
    const loggedInUser = props.loggedInUser

    if (!helpRequest) {
        return <h1>404</h1>
    }

    const conversationUid = util.createConversationUidFromUserUids(helpRequest.user.uid, loggedInUser.uid)
    return (
        <div className='help-request-details'>
            <h2 className='heading-2'>
                <strong>
                    <AsyncLink to={`/users/${helpRequest.user.uid}/profile`} fetch={() => api.getUserProfile(helpRequest.user.uid)} navHandler={props.navHandler}>
                        {util.getDisplayName(helpRequest.user.name)}
                    </AsyncLink>
                </strong> needs <strong className='primary-font-color'>{helpRequest.title}</strong>
            </h2>
            <br className='section-separator-space' />

            <div className='d-flex flex-row help-request-details__info'>
                <img src={helpRequest.photoURL || helpRequest.user.photoURL} alt='Help Request' />

                <div className='d-flex flex-col'>
                    {/* this shows up as "in a few seconds" when first posted - try to change to now */}
                    <p><strong>Posted {util.getRelativeTime(helpRequest.created)}</strong> near {helpRequest.location}</p>
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
                { conversationUid &&
                <>
                    <h3 className='heading-3'>Can you help your neighbor?</h3>
                    <br />
                    
                    <LinkButton
                        to={{ 
                            pathname: `/inbox/${conversationUid}`, 
                            state: { messageRecipient: helpRequest.user }
                        }}>
                        Send message
                    </LinkButton>
                </>
                }
            </div>
        </div>
    )
}

export default HelpRequestDetails