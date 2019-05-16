'use strict'

const express = require('express')
const router = express.Router()
const Multer = require('multer')
const FirebaseStorage = require('../helpers/FirebaseStorage')
const helpRequestsService = require('./help-requests-service')
const Response = require('../helpers/http-response')
const { InvalidDataException } = require('../helpers/exceptions')

const storage = FirebaseStorage({
    destination: function (req, file, callback) {
        callback(null, 'help-request-photos/')
    }
})
const upload = Multer({ storage: storage })

// routes
router.post('/', createHelpRequest)
//router.post('/', upload.single('photo'), createHelpRequest)
//router.route('/').post(upload.single('photo'), createHelpRequest)

// route handlers
function createHelpRequest(req, res, next) {
    // formdata doesnt send json so the user object has to be reconstructed
    console.log('BODY', req.body)
    console.log('BODYF', req.body.title)
    const body = req.body
    body.user = {}
    body.user.uid = req.body.userUid
    body.user.name = req.body.userName
    body.user.photoURL = req.body.userPhotoURL

    if (req.files) {
        console.log('files!', req.files)
        body.photoURL = req.file.gcsObjectUrl
    }

    helpRequestsService.create(body)
        .then(helpRequest => next(Response(201, helpRequest)))
        .catch(e => e instanceof InvalidDataException ? next(Response(400, e.message)) : next(Response(500, e)))
}

module.exports = router
