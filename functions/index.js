'use strict'

const functions = require('firebase-functions')
const app = require('./app')
module.exports.app = functions.https.onRequest(app)