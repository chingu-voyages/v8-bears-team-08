import config from './config'
import * as firebase from './helpers/firebase'
import axios from 'axios'

const db = firebase.getDb()
const apiUrl = config.backendUrl
let unsubscribe = null

const httpRequestConfig = {
    headers: {
        Authorization: "Bearer "
    }
}

/**
 * Gets a list of Help Requests directly from the database. 
 * Also sets up a listener to get realtime updates and calls the callback with the 
 *  full list every time the dataset changes
 * @param {string} location - The location (neighborhood) to search in - currently zip code
 * @param {function} successCallback - The function to call with the list of help requests
 * @param {function} errorCallback - The function to call if there is an error
 */
export function subscribeToHelpRequests(location, successCallback, errorCallback) {
    unsubscribe = 
        db.collection('help-requests')
            .where('status', '==', 'active')
            .where('location', '==', location)
            .orderBy('neededDatetime', 'asc')
            .onSnapshot(querySnapshot => {
                const helpRequests = []

                querySnapshot.forEach(document => {
                    helpRequests.push(document.data())
                })
                
                successCallback({ helpRequests })
            }, error => errorCallback({ error: error }))
}

export function subscribeToConversationMessages(conversationUid, successCallback, errorCallback) {
    return db.collection(`inbox/${conversationUid}/messages`)
        .orderBy('created', 'desc')
        .limit(30)
        .onSnapshot(querySnapshot => {
            const messages = []

            querySnapshot.forEach(document => {
                messages.push({ uid: document.id, ...document.data()})
            })

            successCallback({ messages: messages.reverse() })
        }, error => errorCallback({ error }))
}

export function createConversation(conversationUid, conversation) {
    return db.collection('inbox').doc(conversationUid).set(conversation)
        .then(() => {
            return getConversationDetails(conversationUid)
        })
}

export function sendMessage(conversationUid, message) {
    const conversationRef = db.collection('inbox').doc(conversationUid)
    const messageRef = db.collection('inbox').doc(conversationUid).collection('messages').doc()
    
    const batch = db.batch()
    batch.set(messageRef, message)
    batch.update(conversationRef, { 'lastMessageDatetime': new Date().toISOString(), 'lastMessageText': message.text })
    batch.commit()
        .catch(e => console.log('fail', e))
}

export function getConversationsForUser(userUid) {
    return db.collection('inbox')
        .where('userIds', 'array-contains', userUid)
        .orderBy('created', 'desc')
        .get()
        .then(querySnapshot => {
            const conversations = []

            querySnapshot.forEach(document => {
                conversations.push({ uid: document.id, ...document.data()})
            })

            return conversations
        })
}

export function getConversationDetails(conversationUid) {
    return db.collection('inbox').doc(conversationUid).get()
        .then(doc => ({ data: doc.data() }))
        .catch(error => ({ error: error }))
}

export function unsubscribeFromHelpRequests() {
    if (unsubscribe != null) {
        unsubscribe()
    }
}

export async function getUser(userId) {
    await setAuthorizationHeader(httpRequestConfig)
    return await axios.get(apiUrl + '/users/' + userId, httpRequestConfig)
}

export async function getUserProfile(userId) {
    await setAuthorizationHeader(httpRequestConfig)
    return await axios.get(apiUrl + '/users/' + userId + '/profile', httpRequestConfig)
}

export async function saveHelpRequest(formData) {
    await setAuthorizationHeader(httpRequestConfig)
    return await axios.post(apiUrl + '/help-requests', formData, httpRequestConfig)
}

export async function registerUser(user) {
    await setAuthorizationHeader(httpRequestConfig)
    return await axios.post(apiUrl + '/users', user, httpRequestConfig)
}

// Get a list of possible users that helped complete a help request.
// List of users is based on any conversations that have a message after the posted date of the HelpRequest.
export async function getPossibleHelpers(helpRequestCreatedDate, userUid) {
    return db.collection('inbox')
        .where('userIds', 'array-contains', userUid)
        .where('lastMessageDatetime', '>', new Date(helpRequestCreatedDate).toISOString())
        .orderBy('lastMessageDatetime', 'desc')
        .limit(10)
        .get()
        .then(querySnapshot => {
            const possibleHelpers = []

            querySnapshot.forEach(conversation => {
                const user = conversation.data().users.filter(user => user.uid !== userUid)[0]
                possibleHelpers.push(user)
            })

            return possibleHelpers
        })
}

async function setAuthorizationHeader(httpRequestConfig) {
    const idToken = await firebase.getUserIdToken()
    httpRequestConfig.headers.Authorization = 'Bearer ' + idToken
    return httpRequestConfig
}
