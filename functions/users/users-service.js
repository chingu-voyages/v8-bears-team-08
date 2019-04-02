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
    await db.collection('users').doc(user.uid).set(user)
    return user
}

async function getById(uid) {
    const userDoc = await db.collection('users').doc(uid).get()
    if (userDoc.data()) {
        return User(userDoc.data())
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
    await db.collection('users').doc(uid).update(user)
    return user
}

module.exports = {
    create,
    getById,
    update
}