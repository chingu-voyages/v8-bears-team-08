'use strict';

require('firebase-admin').initializeApp()
const express = require('express')
const cors = require('cors')({origin: true})
const firebaseHelper = require('./helpers/firebase-helper')

const app = express()
app.use(express.json())
app.use(cors)
app.use(firebaseHelper.validateFirebaseIdToken)
app.use(canRequestorAccessResource)

app.use('/users', require('./users/users-controller'))
app.use('/help-requests', require('./help-requests/help-requests-controller'))
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

function canRequestorAccessResource(req, res, next) {
    const requestorId = req.user.uid

    if (req.params.uid && requestorId !== req.params.uid && (req.method == "POST" || req.method == "PUT" || req.method == "DELETE")) {
        return next(Response(403))
    }

    // if (req.params.uid && requestorId !== req.params.uid && req.path.includes('/private')) {
    //     return next(Response(403))
    // }
    
    return next()
}
module.exports = app