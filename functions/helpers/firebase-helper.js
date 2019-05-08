'use strict'

const Response = require('./http-response')
const admin = require('firebase-admin')

module.exports = {
    validateFirebaseIdToken
}

function validateFirebaseIdToken(req, res, next) {
    console.log('Checking if request is authorized with Firebase ID token')
  
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        console.error('No Firebase ID token was passed as a Bearer token in the Authorization header')
        return next(Response(401))
    }
    let idToken = req.headers.authorization.split('Bearer ')[1]
    admin.auth().verifyIdToken(idToken)
        .then((decodedIdToken) => {
            console.log('ID Token correctly decoded')
            req.user = decodedIdToken
            return next()
        })
        .catch((error) => {
            console.error('Error while verifying Firebase ID token')
            return next(Response(401))
        })
}