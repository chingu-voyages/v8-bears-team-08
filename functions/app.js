'use strict';

require('firebase-admin').initializeApp()
const express = require('express')
const cors = require('cors')({origin: true})
const Busboy = require('busboy')
const getRawBody = require('raw-body')
const contentType = require('content-type')
const firebaseHelper = require('./helpers/firebase-helper')

const app = express()
app.use(express.json())
app.use(cors)
app.use(firebaseHelper.validateFirebaseIdToken)
app.use(canRequestorAccessResource)
app.use((req, res, next) => {
    console.log('checking for rb', req.method, req.headers, req.rawBody)
    if (req.rawBody === undefined && req.method === 'POST' && req.headers['content-type'].startsWith('multipart/form-data')) {
        console.log('inside checking')
        getRawBody(req, {
            length: req.headers['content-length'],
            limit: '10mb',
            encoding: contentType.parse(req).parameters.charset
        }, function(err, string){
            if (err) return next(err)
            req.rawBody = string
            next()
        })
    } else {
        next()
    }
})

app.use((req, res, next) => {
    console.log('reading for rb')
    if (req.method === 'POST' && req.headers['content-type'].startsWith('multipart/form-data')) {
        console.log('inside reading')
        const busboy = new Busboy({ headers: req.headers })
        let fileBuffer = new Buffer('')
        req.files = {
            file: []
        }

        busboy.on('field', (fieldname, value) => {
            console.log('adding field', fieldname, value)
            req.body[fieldname] = value
            console.log('done adding: new req.body:', req.body)
        })

        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            console.log('adding file', filename)
            file.on('data', (data) => {
                fileBuffer = Buffer.concat([fileBuffer, data])
            })

            file.on('end', () => {
                const file_object = {
                    fieldname,
                    'originalname': filename,
                    encoding,
                    mimetype,
                    buffer: fileBuffer
                }

                req.files.file.push(file_object)
            })
        })

        busboy.on('finish', () => {
            console.log('busboy done', req.body)
            next()
        })


        busboy.end(req.rawBody)
        req.pipe(busboy)
    } else {
        next()
    }
})

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
    res.status(response.code).json(response.message)
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