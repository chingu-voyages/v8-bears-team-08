import React, { useState, useEffect } from 'react'
import LinkButton from '../../components/LinkButton'
import AsyncLink from '../../components/AsyncLink'
import Button from '../../components/Button'
import Avatar from '../../components/Avatar'
import Dialog from '../../components/Dialog'
import * as util from '../../helpers/util'
import * as api from '../../api'
import './HelpRequestDetails.scss'

function HelpRequestDetails(props) {
    const [shouldDisplayDialog, setShouldDisplayDialog] = useState(false)
    const [possibleHelpers, setPossibleHelpers] = useState([])
    const helpRequest = props.location.state
    const loggedInUser = props.loggedInUser

    if (!helpRequest) {
        return <h1>404</h1>
    }

    useEffect(() => {
        if (helpRequest.user.uid === loggedInUser.uid) {
            api.getPossibleHelpers(helpRequest.created, loggedInUser.uid)
                .then(helpers => setPossibleHelpers(helpers))
        }
    }, [helpRequest.created, helpRequest.user.uid, loggedInUser.uid])

    const conversationUid = util.createConversationUidFromUserUids(helpRequest.user.uid, loggedInUser.uid)
    return (
        <>
            <MarkHelpRequestDoneDialog 
                shouldShow={shouldDisplayDialog}
                hide={() => setShouldDisplayDialog(false)}
                possibleHelpers={possibleHelpers}
            />
            
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
                    { conversationUid ? 
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
                        : 
                        <Button onClick={() => setShouldDisplayDialog(true)}>
                            Close this Request
                        </Button>
                    }
                </div>
            </div>
        </>
    )
}

function MarkHelpRequestDoneDialog(props) {
    return (
        <Dialog shouldShow={props.shouldShow} hide={props.hide}>
            <div className='close-help-request'>
                <div className='top'>
                    <p>Congratulations!</p>
                    <p>You have some great neighbors.</p>
                </div>

                { props.possibleHelpers.length > 0 && 
                    <div className='middle'>
                        <p>Select who helped you</p>
                        <ul>
                            {props.possibleHelpers.map(
                                helper => (
                                    <li key={helper.uid}>
                                        <Avatar url={helper.photoURL} size='small' />
                                        <p>{util.getDisplayName(helper.name)}</p>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>
                }

                <div className='bottom'>
                    <Button type='text' onClick={props.hide}>Cancel</Button>
                    <Button type='text'>Mark Done</Button>
                </div>

            </div>
        </Dialog>
    )
}

export default HelpRequestDetails