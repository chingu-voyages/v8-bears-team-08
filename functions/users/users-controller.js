'use strict'

const express = require('express')
const router = express.Router()
const usersService = require('./users-service')
const Response = require('../helpers/http-response')
const { UserAlreadyExistsException, UserNotFoundException } = require('../helpers/exceptions')

// routes
router.use(canRequestorAccessResource)
router.post('/', createUser)
router.get('/:uid', getById)
//router.get('/:uid/public', getById)
//router.get('/:uid/private', getById)
router.put('/:uid', updateUser)

// route handlers
function createUser(req, res, next) {
    usersService.create(req.user)
        .then(user => res.status(201, "User created").send(user))
        .catch(e => e instanceof UserAlreadyExistsException ? 
            next(Response(200, e.message)) : next(Response(500, e)))
}

function getById(req, res, next) {
    usersService.getById(req.params.uid)
        .then(user => user ? res.status(200).send(user) : next(Response(404, 'User not found')))
        .catch(e => next(Response(e)))
}

function updateUser(req, res, next) {
    usersService.update(req.params.uid, req.body)
        .then(user => res.status(200, "User updated").send(user))
        .catch(e => e instanceof UserNotFoundException ?
            next(Response(404, "User not found")) : next(Response(500, e)))
}

function canRequestorAccessResource(req, res, next) {
    const requestorId = req.user.uid

    if (req.params.uid && requestorId !== req.params.uid && (req.method == "POST" || req.method == "PUT")) {
        return next(Response(403))
    }

    if (req.params.uid && requestorId !== req.params.uid && req.path.includes('/private')) {
        return next(Response(403))
    }
    
    return next()
}

module.exports = router