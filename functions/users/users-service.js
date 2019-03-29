'use strict'

const admin = require('firebase-admin')
const db = admin.firestore();
const { UserAlreadyExistsException } = require('../helpers/exceptions')
const User = require('./user')

module.exports = {
    create,
    getById,
    update
}

async function create(userData) {
    if (await getById(userData.uid)) {
        throw UserAlreadyExistsException(userData.uid)
    }

    const user = User(userData, admin.firestore.Timestamp.fromDate(new Date()))
    await db.collection('users').doc(userData.uid).set(user)

    return user
}

async function getById(uid) {
    const userDoc = await db.collection('users').doc(uid).get()
    return userDoc.data()
}

async function update(uid, userData) {
    const user = User.update(userData)
    await db.collection('users').doc(uid).update(user)
    return user
}