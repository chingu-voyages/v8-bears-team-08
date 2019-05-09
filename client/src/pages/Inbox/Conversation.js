import React, { useState, useEffect } from 'react'
import './Conversation.scss'
import * as firebase from '../../helpers/firebase'
import * as api from '../../api'

function Conversation(props) {
    const [conversation, setConversation] = useState(props.location.state ? props.location.state.conversation : undefined)
    const [messages, setMessages] = useState([])
    const [messageBoxText, setMessageBoxText] = useState("")
    const [unsubscribe, setUnsubscribe] = useState(undefined)
    const conversationUid = props.match.params.uid

    useEffect(function getConversationDetails() {
        if (props.location.state.conversation) {
            console.log('already have conversation details')
            setConversation(props.location.state.conversation)
        } else {
            console.log('getting conversation details')
            api.getConversationDetails(conversationUid)
                .then(response => {
                    if (response.data) {
                        setConversation(response.data)
                    } else {
                        console.log('need to create conversation')

                    }
                })
        }
    }, [])

    useEffect(function subscribeToConversationMessages() {
        api.subscribeToConversationMessages(conversationUid, 
            response => {
                if (response.messages.length > 0) {
                    console.log('has messages')
                    setMessages(response.messages)
                } else {
                    console.log('no messages')
                }
            },
            errorResponse => {
                
            })
    }, [])

    async function sendMessage(e) {
        e.preventDefault()
        const messageText = messageBoxText
        setMessageBoxText('')
        
        const message = {
            created: new Date().toISOString(),
            text: messageText,
            senderUid: firebase.getUser().uid,
            receiverUid: ""
        }
        
        // if we have no conversation in state, then the first message we send should also create the conversation.
        if (!conversation) {
            const response = await api.createConversation(conversationUid)
            message.receiverUid = response.users[0].uid
            setConversation(response)
        } else {
            message.receiverUid = conversation.users[0].uid
        }
        
        console.log(message)
        api.sendMessage(conversationUid, message)
    }

    return (
        <div className='conversation__container d-flex flex-col'>
            <h1>Conversation { conversation && <span>with {conversation.users[0].name}</span>}</h1>
            
            <div className='conversation__messages-container'>
                <div className='conversation__messages'>
                    { messages && messages.map(message => (
                        <div key={message.uid}>{message.text}</div>
                    ))}
                </div>
            </div>

            <form onSubmit={sendMessage}>
                <input 
                    className='conversation__input-box'
                    type='text'
                    value={messageBoxText}
                    onChange={e => setMessageBoxText(e.target.value)}
                    />
            </form>
        </div>
    )
}

export default Conversation