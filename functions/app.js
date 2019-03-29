'use strict';

const admin = require('firebase-admin')
const express = require('express')
const cors = require('cors')({origin: true})
const Error = require('./helpers/http-response')
admin.initializeApp()

const app = express()
app.use(cors)
app.use(validateFirebaseIdToken)

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
module.exports = app