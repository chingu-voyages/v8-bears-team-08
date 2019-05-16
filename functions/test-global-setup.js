'use strict'

const db = require('firebase-admin').firestore()
const User = require('./users/user')
const HelpRequest = require('./help-requests/help-request')
const { user1, user2, helpRequest1, helpRequest2, compliment1 } = require('./test-global-data')

async function initializeTestDb() {
    db.clear()
    await db.collection('users').doc(user1.uid).set(User(user1))
    await db.collection('users').doc(user2.uid).set(User(user2))
    await db.collection('help-requests').doc(helpRequest1.uid).set(HelpRequest(helpRequest1))
    await db.collection('help-requests').doc(helpRequest2.uid).set(HelpRequest(helpRequest2))
    await db.collection('compliments').doc(compliment1.uid).set(compliment1)
}

initializeTestDb()
