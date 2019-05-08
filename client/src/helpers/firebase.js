import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
import config from '../config'

// only initialize firebase once
if (!firebase.apps.length) {
    firebase.initializeApp(config.firebase)
}

export function getDb() {
    return firebase.firestore()
}

export function isUserLoggedIn() {
    return firebase.auth().currentUser != null
}

export function signOut() {
    if (isUserLoggedIn()) {
        firebase.auth().signOut()
    }
}

export function getUserIdToken() {
    if (!isUserLoggedIn()) {
        return Promise.resolve("")
    }
    return firebase.auth().currentUser.getIdToken(true)
}

export function getUser() {
    if (!isUserLoggedIn()) {
        return ""
    }
    return firebase.auth().currentUser
}

export function onAuthStateChanged(callback) {
    firebase.auth().onAuthStateChanged(callback)
}

export function getAuth() {
    return firebase.auth()
}

export default firebase