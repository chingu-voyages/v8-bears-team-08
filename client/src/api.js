import config from './config'
import firebase from './helpers/firebase'
import axios from 'axios'

const db = firebase.firestore()
const apiUrl = config.backendUrl
let unsubscribe = null

const httpRequestConfig = {
    headers: {
        'Authorization': "Bearer " + firebase.auth().currentUser.getIdToken()
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

export function unsubscribeFromHelpRequests() {
    if (unsubscribe != null) {
        unsubscribe()
    }
}

export async function getUserProfile(userId) {
    return await axios.get(apiUrl + '/users/' + userId + '/profile', httpRequestConfig)
}