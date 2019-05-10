import React, { useState, useEffect, useContext, useRef } from 'react'
import moment from 'moment'
import Avatar from '../../components/Avatar'
import './Conversation.scss'
import * as util from '../../helpers/util'
import * as api from '../../api'
import { LoggedInUserContext } from '../../App'
import conversationFactory from './conversation-factory'

/*
 *  This component is for a direct conversation between the logged in user and another user.
 *  This will be used as the communication when contacting a user to provide assistance on a Help Request.
 *  The user can navigate here via:
 *      1. Inbox -> Clicking on the conversation; props.location.state.conversationDetails will be populated with the conversation details
 *      2. Clicking the "Send a Message" button on a Help Request; props.location.state.messageRecipient will be populated with the receiving user's profile info.
 *          a. This will require a query to retrieve the conversation information (or create a new conversation if there isn't one already.)
 */
function Conversation(props) {
    const [conversationDetails, setConversationDetails] = useState(undefined)
    const [receivingUser, setReceivingUser] = useState(undefined)
    const [conversationMessages, setConversationMessages] = useState([])
    const [messageBoxText, setMessageBoxText] = useState("")
    const inputMessageBox = useRef(null)
    const loggedInUser = useContext(LoggedInUserContext)
    const conversationUid = props.match.params.uid
    let unsubscribeFromMessages


    function getReceivingUserFromConversation(conversation) {
        return conversation.users.filter(user => user.uid != loggedInUser.uid)[0]
    }

    useEffect(() => {
        inputMessageBox.current.focus()
    }, [])

    useEffect(function getConversationDetails() {
        if (isViewValid()) {
            if (props.location.state.conversationDetails) {
                console.log('already have conversation details')
                setReceivingUser(getReceivingUserFromConversation(props.location.state.conversationDetails))
                setConversationDetails(props.location.state.conversationDetails)
            } else {
                console.log('getting conversation details')
                api.getConversationDetails(conversationUid)
                    .then(response => {
                        if (response.data) {
                            setConversationDetails(response.data)
                            setReceivingUser(getReceivingUserFromConversation(response.data))
                        } else {
                            // there is no conversation created yet.  
                            // It needs to be created when the first message is sent.
                        }
                    })
            }
        }
    }, [])

    useEffect(function subscribeToConversationMessages() {
        if (isViewValid()) {
            unsubscribeFromMessages = api.subscribeToConversationMessages(conversationUid, 
                response => {
                    if (response.messages.length > 0) {
                        console.log('has messages')
                        setConversationMessages(response.messages)
                    } else {
                        console.log('no messages')
                    }
                },
                errorResponse => {
                    
                })
        }

        return () => { unsubscribeFromMessages() }
    }, [])

    async function sendMessage(e) {
        e.preventDefault()
        const messageText = messageBoxText
        setMessageBoxText('')
        
        const message = {
            created: new Date().toISOString(),
            text: messageText,
            senderUid: loggedInUser.uid,
            receiverUid: undefined
        }
        
        // if we have no conversation in state, then we should create the conversation before sending the first message.
        if (!conversationDetails) {
            const response = await api.createConversation(conversationUid, conversationFactory(props.location.state.messageRecipient, loggedInUser))
            message.receiverUid = props.location.state.messageRecipient.uid
            setReceivingUser(props.location.state.messageRecipient)
            setConversationDetails(response)
        } else {
            message.receiverUid = receivingUser.uid
        }
        
        api.sendMessage(conversationUid, message)
    }

    function isViewValid() {
        return conversationDetails || (props.location.state && props.location.state.messageRecipient)
    }

    if (!isViewValid()) {
        // view is being accessed outside of normal flow as we have no valid chat recipient or conversation
        return <h1>404</h1>
    }

    return (
        <div className='conversation__container d-flex flex-col'>
            <h1 className='conversation__title'>Conversation { receivingUser && <span>with {util.getDisplayName(receivingUser.name)}</span>}</h1>
            
            <div className='conversation__messages-container'>
                <div className='conversation__messages'>
                    <ul>
                        { conversationDetails && conversationMessages && conversationMessages.map(message => {
                            message.photoURL = conversationDetails.users.filter(user => user.uid == message.senderUid)[0].photoURL
                            message.isMyMessage = message.senderUid === loggedInUser.uid
                            return <Message key={message.uid} message={message} />
                        })}
                    </ul>
                </div>
            </div>

            <form onSubmit={sendMessage}>
                <input 
                    className='conversation__input-box'
                    type='text'
                    value={messageBoxText}
                    placeholder='message'
                    onChange={e => setMessageBoxText(e.target.value)}
                    ref={inputMessageBox}
                    />
            </form>
        </div>
    )
}

function Message({ message }) {
    // the flex-row-reverse & flex-justify-end combo of classes below are so that the received messages show on the left of the screen with the avatar on the left
    return (
        <li 
            key={message.uid}
            className={message.isMyMessage ? 'conversation__message d-flex flex-row flex-justify-end' : 'conversation__message d-flex flex-row-reverse flex-justify-end'}
        >
            <div className={message.isMyMessage ? 'conversation__message-text d-flex flex-col flex-align-end' : 'conversation__message-text d-flex flex-col'}>
                {message.text}
                <span className='conversation__message-text--small'>{util.getCalendarLocaleTime(message.created)}</span>
            </div>
            <Avatar url={message.photoURL} size='small' />
        </li>
    )
}

export default Conversation