'use strict'

const express = require('express')
const router = express.Router()
const usersService = require('./users-service')
const Response = require('../helpers/http-response')
const { UserAlreadyExistsException, UserNotFoundException } = require('../helpers/exceptions')

// routes
router.post('/', createUser)
router.get('/:uid', getById)
router.get('/:uid/profile', getProfileById)
router.put('/:uid', updateUser)

// route handlers
function createUser(req, res, next) {
    usersService.create({ ...req.user, ...req.body })
        .then(user => res.status(201).json(user))
        .catch(e => e instanceof UserAlreadyExistsException ? 
            next(Response(200, e.message)) : next(Response(500, e)))
}

function getById(req, res, next) {
    usersService.getById(req.params.uid, req.params.uid == req.user.uid)
        .then(user => res.status(200).json(user))
        .catch(e => e instanceof UserNotFoundException ?
            next(Response(404, `${e.message}: ${e.value}`)) : next(Response(500, e)))
}

function getProfileById(req, res, next) {
    usersService.getProfileById(req.params.uid, req.params.uid == req.user.uid)
        .then(user => res.status(200).json(user))
        .catch(e => e instanceof UserNotFoundException ?
            next(Response(404, `${e.message}: ${e.value}`)) : next(Response(500, e)))
}

function updateUser(req, res, next) {
    usersService.update(req.params.uid, req.body)
        .then(() => res.status(200).send())
        .catch(e => e instanceof UserNotFoundException ?
            next(Response(404, `${e.message}: ${e.value}`)) : next(Response(500, e)))
}

module.exports = router