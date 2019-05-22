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
app.use(canRequestorAccessResource)
app.use(addRawbodyToRequest)
app.use(convertRawbodyToBody)

app.use('/users', require('./users/users-controller'))
app.use('/help-requests', require('./help-requests/help-requests-controller'))

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