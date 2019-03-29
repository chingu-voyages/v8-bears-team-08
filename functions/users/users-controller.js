'use strict'

const express = require('express')
const router = express.Router()
const usersService = require('./users-service')
const Response = require('../helpers/http-response')
const { UserAlreadyExistsException } = require('../helpers/exceptions')

// routes
router.use(canRequestorAccessResorce)
router.post('/', newUser)
router.get('/:uid', getById)
//router.get('/:uid/public', getById)
//router.get('/:uid/private', getById)
router.put('/:uid', updateUser)

module.exports = router


// route handlers
function newUser(req, res, next) {
    usersService.create(req.user)
        .then(user => res.status(200).send(user))
        .catch(e => e instanceof UserAlreadyExistsException ? 
            next(Response(200, e.message)) : next(Response(e)))
}

function getById(req, res, next) {
    usersService.getById(req.params.uid)
        .then(user => user ? res.status(200).send(user) : next(Response(404, 'User not found')))
        .catch(e => next(Response(e)))
}

function updateUser(req, res, next) {
    usersService.update(req.params.uid, req.body)
        .then()
        .catch(e => console.error(e))
}

function canRequestorAccessResorce(req, res, next) {
    requestorId = req.user.uid
    if (req.params.uid && requestorId !== req.params.uid && (req.method == "POST" || req.method == "PUT")) {
        return next(Response(403))
    }
    if (req.params.uid && requestorId !== req.params.uid && req.path.includes('/private')) {
        return next(Response(403))
    }
    
    return next()
}