'use strict'

const admin = require('firebase-admin')
const db = admin.firestore()
const { UserAlreadyExistsException, UserNotFoundException } = require('../helpers/exceptions')
const User = require('./user')
const HelpRequest = require('../help-requests/help-request')

async function create(userData) {
    if (await getById(userData.uid)) {
        throw UserAlreadyExistsException(userData.uid)
    }

    const user = User(userData)
    return await db.collection('users').doc(user.uid).set(user.getFieldsOnly())
}

async function getById(uid, includePrivateInfo = false) {
    const userDoc = await db.collection('users').doc(uid).get()

    if (userDoc.data()) {
        const user = User(userDoc.data())
        if (!includePrivateInfo) {
            user.stripPrivateData()
        }
        return user
    } else {
        return undefined
    }
}

async function getProfileById(uid, includePrivateInfo = false) {
    const user = User(await getById(uid, includePrivateInfo))
    if (!user) {
        throw UserNotFoundException(uid)
    }

    const hrQuerySnapshot = await db.collection('help-requests').where('user.uid', '==', user.uid).get()
    const helpRequests = []
    hrQuerySnapshot.forEach(doc => {
        const helpRequest = HelpRequest(doc.data())
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
    const user = User(await getById(uid, true))
    if (!user) {
        throw UserNotFoundException(uid)
    }

    user.update(userData)
    return await db.collection('users').doc(uid).update(user.getFieldsOnly())
}

module.exports = {
    create,
    getById,
    getProfileById,
    update
}