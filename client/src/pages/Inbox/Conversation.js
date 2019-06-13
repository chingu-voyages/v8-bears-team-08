import React, { useState, useEffect, useContext, useRef, useCallback } from 'react'
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
 *      1. Inbox -> Clicking on the conversation:
 *          a. props.location.state.conversationDetails will be populated with the conversation details
 *          b. props.location.state.conversationDetails.receivingUser will be populated with the receivingUser
 *      2. Clicking the "Send a Message" button on a Help Request:
 *          a. props.location.state.messageRecipient will be populated with the receiving user's profile info.
 *              i. This will require a query to retrieve the conversation information (or create a new conversation if there isn't one already.)
 *      3. Directly via the typing in the URL or using a bookmark
 *          a. This will require a query to retrieve the conversation information (or create a new conversation if there isn't one already.) 
 */
function Conversation(props) {
    const [conversationDetails, setConversationDetails] = useState((props.location.state || {}).conversationDetails)
    const [receivingUser, setReceivingUser] = useState((props.location.state || {}).messageRecipient)
    const [conversationMessages, setConversationMessages] = useState([])
    const [messageBoxText, setMessageBoxText] = useState('')
    const inputMessageBox = useRef(null)
    const conversationScrollAnchor = useRef(null)
    const loggedInUser = useContext(LoggedInUserContext)
    const conversationUid = props.match.params.uid
    
    useEffect(() => {
        if (inputMessageBox.current) {
            inputMessageBox.current.focus()
        }
    }, [])

    // keep chat window scrolled to bottom
    useEffect(() => {
        if (conversationScrollAnchor.current) {
            conversationScrollAnchor.current.scrollIntoView()
        }
    })

    const getReceivingUserFromConversation = useCallback(
        function(conversation) {
            return conversation.users.filter(user => user.uid !== loggedInUser.uid)[0]
        },
        [loggedInUser.uid]
    )

    useEffect(function getConversationDetails() {
        if (!conversationDetails) {
            api.getConversationDetails(conversationUid)
                .then(response => {
                    if (response.data) {
                        if (!receivingUser) {
                            setReceivingUser(getReceivingUserFromConversation(response.data))
                        }
                        setConversationDetails(response.data)
                    } else {
                        // there is no conversation created yet.  
                        // It needs to be created when the first message is sent.
                    }
                })
        }
    }, [conversationDetails, conversationUid, getReceivingUserFromConversation, loggedInUser.uid, receivingUser])

    useEffect(function subscribeToConversationMessages() {
        const unsubscribeFromMessages = api.subscribeToConversationMessages(conversationUid, 
            response => {
                if (response.messages.length > 0) {
                    setConversationMessages(response.messages)
                }
            },
            errorResponse => {
                console.log(errorResponse.error)
            })
            
        return unsubscribeFromMessages

    }, [conversationUid])

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
        if (!conversationDetails && !props.location.state) {
            // TODO:
            //  user has arrived here from a direct link and this conversation has not been created yet.
            //  We can't send any messages in this state.
            //  Need to update backend to create conversations with just conversationUid.
            return
        }
        else if (!conversationDetails) {
            // TODO: Handle error state
            const response = await api.createConversation(conversationUid, conversationFactory(props.location.state.messageRecipient, loggedInUser))
            const conversation = response.data
            const receiver = getReceivingUserFromConversation(conversation)

            message.receiverUid = receiver.uid
            setReceivingUser(receiver)
            setConversationDetails(conversation)
        } else {
            message.receiverUid = receivingUser.uid
        }
        
        api.sendMessage(conversationUid, message)
    }

    // TODO: Handle invalid conversation state
    // if (!conversationDetails && !receivingUser) {
    //     // view is being accessed outside of normal flow as we have no valid chat recipient or conversation
    //     return <h1>404</h1>
    // }

    return (
        <div className='conversation'>
            {/* <h1 className='heading-1'>{ receivingUser && <span>{util.getDisplayName(receivingUser.name)}</span>}</h1> */}
            
            <div className='conversation__messages-container'>
                <div className='conversation__messages'>
                    <ul>
                        { conversationDetails && conversationMessages && conversationMessages.map(message => {
                            message.photoURL = conversationDetails.users.filter(user => user.uid === message.senderUid)[0].photoURL
                            message.isMyMessage = message.senderUid === loggedInUser.uid
                            return <Message key={message.uid} message={message} />
                        })}
                    </ul>
                    <div ref={conversationScrollAnchor}></div>
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
    // the flex-row-reverse & flex-justify-end combination of classes below are so that the received 
    // messages show on the left of the screen with the avatar first.
    return (
        <li 
            key={message.uid}
            className={`conversation__message d-flex flex-justify-end ${message.isMyMessage ? 'flex-row' : 'flex-row-reverse'}`}
        >
            <div className={`conversation__message-text d-flex flex-col ${message.isMyMessage ? 'flex-align-end' : ''}`}>
                {message.text}
                <span className='conversation__message-text--small'>{util.getCalendarLocaleTime(message.created)}</span>
            </div>
            <Avatar url={message.photoURL} size='xs' />
        </li>
    )
}

export default Conversation