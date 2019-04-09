import config from './config'
import firebase from './helpers/firebase'

const db = firebase.firestore()
const apiUrl = config.backendUrl

/**
 * Gets a list of Help Requests directly from the database. 
 * Also sets up a listener to get realtime updates and calls the callback with the 
 *  full list every time the dataset changes
 * @param {function} callback - The function to call with the list of help requests
 */
export function getHelpRequests(callback) {
    db.collection('help-requests').where('status', '==', 'active')
        .onSnapshot(querySnapshot => {
            const helpRequests = []

            querySnapshot.forEach(doc => {
                const helpRequest = doc.data()
                helpRequests.push(helpRequest)
            })
            callback(helpRequests)
    })
}