'use strict'

const admin = require('firebase-admin')
const db = admin.firestore()
const { InvalidDataException } = require('../helpers/exceptions')
const Compliment = require('./compliment')

async function create(data) {
    const compliment = Compliment(data)

    if (!compliment.hasRequiredFields()) {
        throw InvalidDataException("Invalid or missing data, " + JSON.stringify(compliment.getFieldsOnly()))
    }

    await db.collection('compliments').doc(compliment.uid).set(compliment.getFieldsOnly())
    return compliment
}

module.exports = {
    create
}