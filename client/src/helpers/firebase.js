import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
import config from '../config'

// only initialize firebase once
if (!firebase.apps.length) {
    firebase.initializeApp(config.firebase)
}

export default firebase