import React, { useState, useEffect } from 'react'
import Avatar from '../../components/Avatar'
import { Link } from 'react-router-dom'
import * as api from '../../api'
import * as util from '../../helpers/util'
import './Inbox.scss'

function Inbox(props) {
    const [conversations, setConversations] = useState([])
    const loggedInUser = props.loggedInUser

    useEffect(() => {
        function setReceivingUserForConversations(conversations) {
            return conversations.map(conversation => {
                conversation.receivingUser = conversation.users.filter(user => user.uid !== loggedInUser.uid)[0]
                return conversation
            })
        }

        if (props.location.state && props.location.state.data) {
            setConversations(setReceivingUserForConversations(props.location.state.data))
        } else {
            api.getConversationsForUser(loggedInUser.uid)
                .then(response => {
                    setConversations(setReceivingUserForConversations(response))
                })
        }
    }, [loggedInUser.uid, props.location.state])

    return (
        <div className='inbox'>
            {/* <h1 className='heading-1'>Inbox</h1> */}

            <ul>
                { conversations.map((conversation, index) => (
                    <li key={conversation.receivingUser.uid}>
                        <Link
                            className='inbox__conversation-link' 
                            to={{
                                pathname: `/inbox/${conversation.uid}`,
                                state: { messageRecipient: conversation.receivingUser, conversationDetails: conversation }
                            }}
                        >
                            <div className='d-flex flex-row'>
                                <Avatar url={conversation.receivingUser.photoURL} showHalo='true' size='medium' />
                                <div className='inbox__converation-details'>
                                    <div className='top'>
                                        <div className='inbox__conversation-username'>{util.getDisplayName(conversation.receivingUser.name)}</div>
                                        <div className='inbox__conversation-last-message-time'>{util.getRelativeTime(conversation.lastMessageDatetime)}</div>
                                    </div>
                                    <div className='bottom'>
                                        <div className='inbox__conversation-last-message-text'>{conversation.lastMessageText}</div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                        { index !== conversations.length -1 && <hr className='inbox__conversation-separator' /> }
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Inbox