import React, { useState, useEffect } from 'react'
import LinkButton from '../../components/LinkButton'
import AsyncLink from '../../components/AsyncLink'
import Button from '../../components/Button'
import Avatar from '../../components/Avatar'
import Dialog from '../../components/Dialog'
import LeaveComplimentDialog from '../../components/LeaveComplimentDialog'
import * as util from '../../helpers/util'
import * as api from '../../api'
import './HelpRequestDetails.scss'

function HelpRequestDetails(props) {
    const [shouldDisplayDialog, setShouldDisplayDialog] = useState(false)
    const [shouldDisplayLeaveComplimentDialog, setShoulDisplayLeaveComplimentDialog] = useState(false)
    const [possibleHelpers, setPossibleHelpers] = useState([])
    const [isMarkingDone, setIsMarkingDone] = useState(false)
    const [helpRequest, setHelpRequest] = useState(props.location.state)
    const [personWhoHelped, setPersonWhoHelped] = useState()
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

    function handleClickMarkDone(personWhoHelped) {
        setIsMarkingDone(true)

        api.markHelpRequestDone(helpRequest.uid, personWhoHelped)
            .then(updatedFields => {
                setIsMarkingDone(false)
                if (personWhoHelped) {
                    setPersonWhoHelped(personWhoHelped)
                }
                setHelpRequest({ ...helpRequest, ...updatedFields })
            })
            .catch(e => {
                setIsMarkingDone(false)
                console.log(e)
            })
    }

    function handleComplimentSaved() {
        setPersonWhoHelped(null)
    }

    // We marked a help request as complete and chose someone who helped, display screen to leave them a compliment.
    if (personWhoHelped) {
        return (
            <>
                <LeaveComplimentDialog
                    shouldShow={shouldDisplayLeaveComplimentDialog}
                    hide={() => setShoulDisplayLeaveComplimentDialog(false)}
                    onComplimentSaved={handleComplimentSaved}
                    complimentee={personWhoHelped}
                />
                
                <div className='help-request-details-complete'>
                    <h2 className='heading-2'>Great!</h2>

                    <div className='image-container'>
                        <Avatar url={personWhoHelped.photoURL} size='xl' />
                        <i className='material-icons'>check</i>
                    </div>
                    <p>Would you like to leave a compliment?</p>
                    <Button onClick={() => setShoulDisplayLeaveComplimentDialog(true)}>Write a Compliment</Button>
                </div>
            </>
        )
    }

    // The help request is marked as complete
    if (helpRequest.status === 'complete') {
        return (
            <div className='help-request-details-complete'>
                <h2 className='heading-2'>Alright!</h2>

                <div className='image-container'>
                    <img src={helpRequest.photoURL || helpRequest.user.photoURL} alt='Help Request' />
                    <i className='material-icons'>check</i>
                </div>
                <p>This request is marked as done.</p>
            </div>
        )
    }

    // details page for the help request
    const conversationUid = util.createConversationUidFromUserUids(helpRequest.user.uid, loggedInUser.uid)
    return (
        <>
            <MarkHelpRequestDoneDialog 
                shouldShow={shouldDisplayDialog}
                hide={() => setShouldDisplayDialog(false)}
                possibleHelpers={possibleHelpers}
                onClickMarkDone={handleClickMarkDone}
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
                        <p><strong>Posted {util.getRelativeTime(helpRequest.created)}</strong> near {helpRequest.location}</p>
                        <p>{helpRequest.neededAsap || util.getRelativeCalendarTime(helpRequest.neededDatetime)}</p>
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
                        <Button isLoading={isMarkingDone} onClick={() => setShouldDisplayDialog(true)}>
                            Close this Request
                        </Button>
                    }
                </div>
            </div>
        </>
    )
}

function MarkHelpRequestDoneDialog(props) {
    const [personWhoHelped, setPersonWhoHelped] = useState(null)

    function setHelper(helper) {
        if ((personWhoHelped || {}).uid === helper.uid) {
            setPersonWhoHelped(null)
        } else {
            setPersonWhoHelped(helper)
        }
    }

    function handleCancel() {
        props.hide()
        setPersonWhoHelped(null)
    }

    function handleMarkDone() {
        props.hide()
        props.onClickMarkDone(personWhoHelped)
    }

    return (
        <Dialog shouldShow={props.shouldShow} hide={handleCancel}>
            <div className='close-help-request'>
                <div className='top'>
                    <p>Congratulations!</p>
                    <p>You have some great neighbors.</p>
                </div>

                { props.possibleHelpers.length > 0 && 
                    <div className='middle'>
                        <p>Select who helped you</p>
                        <ul>
                            { props.possibleHelpers.map(
                                helper => (
                                    <li key={helper.uid}>
                                        <Avatar 
                                            onClick={() => setHelper(helper)}
                                            url={helper.photoURL} 
                                            size='small'
                                            className={(personWhoHelped || {}).uid === helper.uid ? 'selected' : ''}
                                        />
                                        <p>{util.getDisplayName(helper.name)}</p>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>
                }

                <div className='bottom'>
                    <Button style='text' onClick={handleCancel}>Cancel</Button>
                    <Button style='text' onClick={handleMarkDone}>Mark Done</Button>
                </div>

            </div>
        </Dialog>
    )
}

export default HelpRequestDetails