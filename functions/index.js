'use strict'

const functions = require('firebase-functions')
const app = require('./app')

// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
module.exports.app = functions.https.onRequest(app)