'use strict';

const admin = require('firebase-admin')
admin.initializeApp()
const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')({origin: true})
const dao = require('./dao')

const app = express()
app.use(cors)
app.use(validateFirebaseIdToken)


app.get('/users/:userId', (req, res) => {
    console.log(req.params)
    let userId = req.params.userId
    
    if (req.user.uid === req.params.userId) {
        userData = dao.getPrivateUserData(userId)
    } else {
        dao.getPublicUserData(userId)
            .then((userData) => {
                console.log('userdata', userData)
                res.status(200).send(userData)
            })
            .catch(() => {
                res.status(500).send('Internal server error')
            })
    }
        
})

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