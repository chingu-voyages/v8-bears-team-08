'use strict'

const admin = require('firebase-admin')
const db = admin.firestore()
const { InvalidDataException } = require('../helpers/exceptions')
const HelpRequest = require('./help-request')

async function create(data) {
    const docRef = db.collection('help-requests').doc()
    const helpRequest = HelpRequest({ ...data, uid: docRef.id, created: new Date().toISOString()})

    if (!helpRequest.hasRequiredFields()) {
        throw InvalidDataException("Invalid or missing data")
    }

    return await db.collection('help-requests').doc(helpRequest.uid).set(helpRequest.toJson())
}

module.exports = {
    create
}