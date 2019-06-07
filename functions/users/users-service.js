'use strict'

const admin = require('firebase-admin')
const db = admin.firestore()
const { UserAlreadyExistsException, UserNotFoundException } = require('../helpers/exceptions')
const User = require('./user')
const HelpRequest = require('../help-requests/help-request')

async function create(userData) {
    const userDoc = await db.collection('users').doc(userData.uid).get()
    if (userDoc.data()) {
        throw UserAlreadyExistsException(userData.uid)
    }

    // Created date should be set by the server
    delete userData.created
    
    const user = User(userData)
    await db.collection('users').doc(user.uid).set(user.getFieldsOnly())
    return user
}

async function getById(uid, includePrivateInfo = false) {
    const userDoc = await db.collection('users').doc(uid).get()
    if (!userDoc.data()) {
        throw UserNotFoundException(uid)
    }
    
    const user = User(userDoc.data())
    if (!includePrivateInfo) {
        user.stripPrivateData()
    }

    return user
}

async function getProfileById(uid, includePrivateInfo = false) {
    const user = await getById(uid, includePrivateInfo)

    const hrQuerySnapshot = await db.collection('help-requests').where('user.uid', '==', user.uid).get()
    const helpRequests = []
    hrQuerySnapshot.forEach(doc => {
        const helpRequest = HelpRequest.createFromStore(doc.data())
        helpRequests.push(helpRequest)
    })

    const coQuerySnapshot = await db.collection('compliments').where('complimenteeUid', '==', user.uid).get()
    const compliments = []
    coQuerySnapshot.forEach(doc => {
        const compliment = doc.data()
        compliments.push(compliment)
    })

    return {...user, helpRequests, compliments}
}

async function update(uid, userData) {
    const user = await getById(uid, true)

    user.update(userData)
    return await db.collection('users').doc(uid).update(user.getFieldsOnly())
}

module.exports = {
    create,
    getById,
    getProfileById,
    update
}