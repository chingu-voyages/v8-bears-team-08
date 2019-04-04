'use strict'

const express = require('express')
const router = express.Router()
const usersService = require('./users-service')
const Response = require('../helpers/http-response')
const { UserAlreadyExistsException, UserNotFoundException } = require('../helpers/exceptions')

// routes
router.post('/', createUser)
router.get('/:uid', getById)
router.put('/:uid', updateUser)

// route handlers
function createUser(req, res, next) {
    usersService.create({ ...req.user, ...req.body })
        .then(user => res.status(201, "User created").send(user))
        .catch(e => e instanceof UserAlreadyExistsException ? 
            next(Response(200, e.message)) : next(Response(500, e)))
}

function getById(req, res, next) {
    usersService.getById(req.params.uid, req.params.uid == req.user.uid)
        .then(user => user ? res.status(200).send(user) : next(Response(404, 'User not found')))
        .catch(e => next(Response(e)))
}

function updateUser(req, res, next) {
    usersService.update(req.params.uid, req.body)
        .then(user => res.status(200, "User updated").send(user))
        .catch(e => e instanceof UserNotFoundException ?
            next(Response(404, "User not found")) : next(Response(500, e)))
}
module.exports = router