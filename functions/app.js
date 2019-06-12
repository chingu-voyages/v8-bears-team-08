'use strict'

require('firebase-admin').initializeApp()
const express = require('express')
const cors = require('cors')({origin: true})
const Busboy = require('busboy')
const getRawBody = require('raw-body')
const contentType = require('content-type')
const firebaseHelper = require('./helpers/firebase-helper')
const Response = require('./helpers/http-response')

const app = express()
app.use(express.json())
app.use(cors)
app.use(firebaseHelper.validateFirebaseIdToken)
app.use(addRawbodyToRequest)
app.use(convertRawbodyToBody)
app.use(canRequestorWriteToResource)

app.use('/users', require('./users/users-controller'))
app.use('/help-requests', require('./help-requests/help-requests-controller'))
app.use('/compliments', require('./compliments/compliments-controller'))

app.use(function catchAll404(req, res, next) {
    next(Response(404))
})

app.use(errorHandler)


/*
 * Custom Middleware functions
 */
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err)
    }
    res.status(err.code).json(err.message)
}

function canRequestorWriteToResource(req, res, next) {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        if (req.user.firebase.sign_in_provider === 'anonymous') {
            return next(Response(403, 'Guest user cannot write to this resource'))
        }

        const requestorId = req.user.uid
        if (!requestorId) {
            return next(Reponse(403, 'User not logged in or unable to verify user'))
        }

        let incomingDataUid

        // Creating/updating a help-request is done via a form and the data is sent as JSON in the "data" field.
        // Marking a help-request as complete will not be via a form
        if (req.originalUrl.startsWith('/help-requests')) {
            if (req.body.data) {
                incomingDataUid = JSON.parse(req.body.data).user.uid
            } else {
                // Can't check this yet... I need to have the help request creator's uid to match it but 
                // that would need to be pulled out of the DB.
                // Help Requests should be moved to the /users/:uid/help-requets collection and then use a collection group query
                // to list all help requests. https://cloud.google.com/firestore/docs/query-data/queries#collection-group-query
                return next()
            }
        } 
        else if (req.originalUrl.startsWith('/users')) {
            incomingDataUid = req.body.uid || req.originalUrl.split('/')[2]
        } 
        else if (req.originalUrl.startsWith('/compliments')) {
            incomingDataUid = req.user.uid
        }

        if (incomingDataUid === requestorId) {
            return next()
        } else {
            return next(Response(403))
        }
    } else {
        return next()
    }
}

function addRawbodyToRequest(req, res, next) {
    if (req.rawBody === undefined && req.method === 'POST' && req.headers['content-type'].startsWith('multipart/form-data')) {
        const options = {
            length: req.headers['content-length'],
            limit: '10mb',
            encoding: contentType.parse(req).parameters.charset
        }

        getRawBody(req, options)
            .then(string => {
                req.rawBody = string
                return next()
            })
            .catch(err => {
                return next(err)
            })
    } else {
        return next()
    }
}

function convertRawbodyToBody(req, res, next) {
    if (req.method === 'POST' && req.headers['content-type'].startsWith('multipart/form-data')) {
        const busboy = new Busboy({ headers: req.headers })

        busboy.on('field', (fieldName, value) => {
            req.body[fieldName] = value
        })

        busboy.on('file', (fieldName, file, filename, encoding, mimeType) => {
            let fileBuffer = new Buffer('')

            file.on('data', (data) => {
                fileBuffer = Buffer.concat([fileBuffer, data])
            })

            file.on('end', () => {
                if (filename && fileBuffer.length > 0) {
                    if (!req.files) {
                        req.files = []
                    }

                    req.files.push({
                        fieldName,
                        'originalName': filename,
                        encoding,
                        mimeType,
                        buffer: fileBuffer
                    })
                }
            })
        })

        busboy.on('finish', () => {
            return next()
        })

        busboy.end(req.rawBody)
        req.pipe(busboy)
    } else {
        return next()
    }
}

module.exports = app