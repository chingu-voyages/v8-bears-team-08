'use strict'

const express = require('express')
const router = express.Router()
const helpRequestsService = require('./help-requests-service')
const Response = require('../helpers/http-response')
const { InvalidDataException, HelpRequestNotFoundException } = require('../helpers/exceptions')


// routes
router.get('/:uid', getById)
router.post('/', createHelpRequest)
router.put('/:uid', updateHelpRequest)

// route handlers
function getById(req, res, next) {
    helpRequestsService.getById(req.params.uid)
        .then(helpRequest => res.status(200).json(helpRequest))
        .catch(e => { console.log('ee', e); e instanceof HelpRequestNotFoundException ?
            next(Response(404, `${e.message}: ${e.value}`)) : next(Response(500, e))})
}

async function createHelpRequest(req, res, next) {
    // Help Requests are created via a form.  The form data is sent in the "data" field as JSON
    const helpRequest = JSON.parse(req.body.data)
    if (req.files && req.files.length > 0) {
        helpRequest.photoFile = req.files[0]
    }

    helpRequestsService.create(helpRequest)
        .then(helpRequest => res.status(201).json(helpRequest))
        .catch(e => e instanceof InvalidDataException ? 
            next(Response(400, e.message)) : next(Response(500, e)))
}

async function updateHelpRequest(req, res, next) {
    helpRequestsService.update(req.params.uid, req.body)
        .then(() => res.status(200).send())
        .catch(e => e instanceof HelpRequestNotFoundException ? 
            next(Response(404, `${e.message}: ${e.value}`)) : next(Response(500, e)))
}

module.exports = router
