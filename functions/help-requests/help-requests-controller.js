'use strict'

const express = require('express')
const router = express.Router()
const helpRequestsService = require('./help-requests-service')
const Response = require('../helpers/http-response')
const { InvalidDataException } = require('../helpers/exceptions')

// routes
router.post('/', createHelpRequest)

// route handlers
function createHelpRequest(req, res, next) {
    helpRequestsService.create(req.body)
        .then(helpRequest => res.status(201, "Help Request created").send(helpRequest))
        .catch(e => e instanceof InvalidDataException ? 
            next(Response(400, e.message)) : next(Response(500, e)))
}


module.exports = router