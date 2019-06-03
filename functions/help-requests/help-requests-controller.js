'use strict'

const express = require('express')
const router = express.Router()
const firebaseHelper = require('../helpers/firebase-helper')
const path = require('path')
const util = require('../helpers/util')
const helpRequestsService = require('./help-requests-service')
const Response = require('../helpers/http-response')
const { InvalidDataException } = require('../helpers/exceptions')


// routes
router.post('/', createHelpRequest)

// route handlers
async function createHelpRequest(req, res, next) {
    const helpRequest = JSON.parse(req.body.data)
    helpRequest.uid = util.createRandomId()

    if (req.files && req.files.length > 0) {
        try {
            const file = req.files[0]
            const extension = path.extname(file.originalName.toLowerCase()) || file.mimeType.split('/')[1]
            helpRequest.photoURL = await firebaseHelper.saveFileToCloudStorage(file, 'help-request-photos/', `${helpRequest.uid}${extension}`)
        } catch(e) {
            console.log('failed to save file:', e)
            next(Response(500, 'Failed to create due to file upload error'))
            return
        }
    }

    helpRequestsService.create(helpRequest)
        .then(helpRequest => res.status(201).json(helpRequest))
        .catch(e => e instanceof InvalidDataException ? next(Response(400, e.message)) : next(Response(500, e)))
}

module.exports = router
