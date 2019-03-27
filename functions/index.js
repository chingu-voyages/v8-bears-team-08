'use strict';

const admin = require('firebase-admin')
const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')({origin: true})
admin.initializeApp()

const app = express()
app.use(cors)
app.use(validateFirebaseIdToken)

app.use('/users', require('./users/users-router'))

app.use(jsonErrorHandler)


/*
 * Custom Middleware functions
 */
function jsonErrorHandler (err, req, res, next) {
    const errResponse = {}

    if (err.code && err.message) {
        // specific errors
        errResponse.error.code = err.code
        errResponse.error.message = err.message
        if (err.code === 404) {
            errResponse.error.status = "NOT_FOUND"
        }
    } else {
        // other generic errors
        errResponse.error.code = 500
        errResponse.error.message = "Internal Server Error"
        errResponse.error.status = "INTERNAL_ERROR"
    }

    res.status(err.code).send(errResponse)
}

function validateFirebaseIdToken(req, res, next) {
    console.log('Check if request is authorized with Firebase ID token')
  
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        console.error('No Firebase ID token was passed as a Bearer token in the Authorization header')
        res.status(403).send('Unauthorized')
        return
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
            res.status(403).send('Unauthorized')
        })
}

// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.app = functions.https.onRequest(app);