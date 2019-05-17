'use strict'

const admin = require('firebase-admin')
const db = admin.firestore()
const { InvalidDataException } = require('../helpers/exceptions')
const HelpRequest = require('./help-request')

async function create(data) {
    // const docRef = db.collection('help-requests').doc()
    // const helpRequest = HelpRequest({ ...data, uid: docRef.id })
    const helpRequest = HelpRequest(data)

    if (!helpRequest.hasRequiredFields()) {
        throw InvalidDataException("Invalid or missing data, " + JSON.stringify(helpRequest.getFieldsOnly()))
    }

    await db.collection('help-requests').doc(helpRequest.uid).set(helpRequest.getFieldsOnly())
    return helpRequest
}

module.exports = {
    create
}