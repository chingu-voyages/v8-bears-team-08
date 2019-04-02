'use strict'

const Response = require('../http-response')

const requestingUser = {
    "name": "John Doe",
    "picture": "https://pbs.twimg.com/profile_images/1055263632861343745/vIqzOHXj.jpg",
    "iss": "https://securetoken.google.com/kindnest-dev-nh2",
    "aud": "kindnest-dev-nh2",
    "auth_time": 1553734463,
    "user_id": "user-id1",
    "sub": "user-id1",
    "iat": 1553734463,
    "exp": 1553738063,
    "email": "johndoe@fake-email.com",
    "email_verified": true,
    "firebase": {
    "identities": {
        "google.com": [
            "123456789012345678901"
        ],
        "email": [
            "johndoe@fake-email.com"
        ]
    },
    "sign_in_provider": "google.com"
    },
    "uid": "user-id1"
}

function validateFirebaseIdToken(req, res, next) {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        console.error('No Firebase ID token was passed as a Bearer token in the Authorization header')
        return next(Response(401))
    }
    let idToken = req.headers.authorization.split('Bearer ')[1]
    if (idToken == "1234567890") {
        req.user = requestingUser
        return next()
    } else {
        return next(Response(401))
    }
}

module.exports = {
    validateFirebaseIdToken
}