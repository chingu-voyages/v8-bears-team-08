'use strict'

const express = require('express')
const router = express.Router()
const inboxService = require('./inbox-service')
const Response = require('../helpers/http-response')

// routes
router.get('/', getInboxForUser)
//router.get('/:uid/messages', getMessages)
//router.post('/:uid', sendMessage)

// route handlers
function getInboxForUser(req, res, next) {
    inboxService.getInboxForUser(req.user.uid)
        .then(inboxConversations => res.status(200).send(inboxConversations))
        .catch(e => next(Response(e)))
}

module.exports = router