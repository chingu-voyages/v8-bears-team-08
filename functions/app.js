'use strict';

require('firebase-admin').initializeApp()
const express = require('express')
const cors = require('cors')({origin: true})
const firebaseHelper = require('./helpers/firebase-helper')

const app = express()
app.use(express.json())
app.use(cors)
app.use(firebaseHelper.validateFirebaseIdToken)

app.use('/users', require('./users/users-controller'))
app.use(function(req, res, next) {
    res.status(404).send()
})
app.use(httpResponseHandler)


/*
 * Custom Middleware functions
 */
function httpResponseHandler(response, req, res, next) {
    res.status(response.code).send(response)
}

module.exports = app