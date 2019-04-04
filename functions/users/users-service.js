'use strict'

const admin = require('firebase-admin')
const db = admin.firestore()
const { UserAlreadyExistsException, UserNotFoundException } = require('../helpers/exceptions')
const User = require('./user')

async function create(userData) {
    if (await getById(userData.uid)) {
        throw UserAlreadyExistsException(userData.uid)
    }

    const user = User(userData)
    await db.collection('users').doc(user.uid).set(user.prepareForDb())
    return user
}

async function getById(uid, isUserRequestingTheirOwnInfo = true) {
    const userDoc = await db.collection('users').doc(uid).get()

    if (userDoc.data()) {
        const user = User(userDoc.data())
        if (!isUserRequestingTheirOwnInfo) {
            user.stripPrivateData()
        }
        return user
    } else {
        return undefined
    }
}

async function update(uid, userData) {
    const user = await getById(uid)
    if (!user) {
        throw UserNotFoundException(uid)
    }

    user.update(userData)
    await db.collection('users').doc(uid).update(user.prepareForDb())
    return user
}

module.exports = {
    create,
    getById,
    update
}