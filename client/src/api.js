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
        .onSnapshot(querySnapshot => {
            const messages = []

            querySnapshot.forEach(document => {
                messages.push(document.data())
            })

            successCallback({ messages })
        }, error => errorCallback({ error }))
        

}

export function createConversation(conversationUid) {
    return Promise.resolve({
        users: [
            {
                uid: "9vqLlEez3VlFIsDy2MXr",
                name: "Christine Maldonado",
                photoURL: "https://tinyfac.es/data/avatars/8B510E03-96BA-43F0-A85A-F38BB3005AF1-500w.jpeg"
            },
            {
                uid: "20SAbLeTJIPEhXE0XDh2OaW40nA2",
                name: "Nektarios Hagihristos",
                photoURL: "https://lh4.googleusercontent.com/-fTG95M892m4/AAAAAAAAAAI/AAAAAAAAPhQ/cAoGwmlxiwQ/photo.jpg"
            }
        ],
        userIds: ["9vqLlEez3VlFIsDy2MXr", "20SAbLeTJIPEhXE0XDh2OaW40nA2"],
        created: "2019-05-09T16:34:12.348Z"
    })
}

export function sendMessage(conversationUid) {

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

export async function getUserProfile(userId) {
    httpRequestConfig = await setToken(httpRequestConfig)
    return await axios.get(apiUrl + '/users/' + userId + '/profile', httpRequestConfig)
}

async function setToken(httpRequestConfig) {
    const idToken = await firebase.getUserIdToken()
    httpRequestConfig.headers.Authorization = "Bearer " + idToken
    return httpRequestConfig
}