import React, { useState, useEffect, useContext } from 'react'
import { LoggedInUserContext } from '../../App'
import Avatar from '../../components/Avatar'
import { Link } from 'react-router-dom'
import * as api from '../../api'
import * as util from '../../helpers/util'
import './Inbox.scss'

function Inbox(props) {
    const [conversations, setConversations] = useState([])
    const loggedInUser = useContext(LoggedInUserContext)

    useEffect(() => {
        api.getConversationsForUser(loggedInUser.uid)
            .then(response => {
                const conversations = []
                response.forEach(conversation => {
                    const receivingUser = conversation.users.filter(user => user.uid !== loggedInUser.uid)[0]
                    conversation.receivingUser = receivingUser
                    conversations.push(conversation)
                })
                setConversations(conversations)
            })
    }, [])

    return (
        <div>
            <h1 className='heading-1'>Inbox</h1>

            <ul>
                { conversations.map((conversation, index) => (
                    <li key={conversation.receivingUser.uid}>
                        <Link
                            className='inbox__conversation-link' 
                            to={{
                                pathname: `/inbox/${conversation.uid}`,
                                state: { messageRecipient: conversation.receivingUser }
                            }}
                        >
                            <div className='d-flex flex-row'>
                                <Avatar url={conversation.receivingUser.photoURL} showHalo='true' size='medium' />
                                <div className='inbox__converation-details d-flex flex-col'>
                                    <div className='inbox__conversation-username'>{util.getDisplayName(conversation.receivingUser.name)}</div>
                                    <div className='inbox__conversation-created'>{conversation.created}</div>
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