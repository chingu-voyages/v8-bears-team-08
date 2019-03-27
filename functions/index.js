'use strict';

const admin = require('firebase-admin')
const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')({origin: true})
const Error = require('./helpers/error')
admin.initializeApp()

const app = express()
app.use(cors)
app.use(validateFirebaseIdToken)

app.use('/users', require('./users/users-router'))

app.use(errorHandler)


/*
 * Custom Middleware functions
 */
function errorHandler (errResponse, req, res, next) {
    res.status(errResponse.error.code).send(errResponse)
}

function validateFirebaseIdToken(req, res, next) {
    console.log('Check if request is authorized with Firebase ID token')
  
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        console.error('No Firebase ID token was passed as a Bearer token in the Authorization header')
        return next(Error(401))
    }
  
    let idToken = req.headers.authorization.split('Bearer ')[1]
    admin.auth().verifyIdToken(idToken)
        .then((decodedIdToken) => {
            console.log('ID Token correctly decoded', JSON.stringify(decodedIdToken, null, 2))
            req.user = decodedIdToken
            return next()
        })
        .catch((error) => {
            console.error('Error while verifying Firebase ID token:', error)
            return next(Error(401))
        })
}

// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.app = functions.https.onRequest(app);