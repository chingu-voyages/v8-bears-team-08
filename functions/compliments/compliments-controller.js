'use strict'

const express = require('express')
const router = express.Router()
const complimentsService = require('./compliments-service')
const usersService = require('../users/users-service')
const Response = require('../helpers/http-response')
const { InvalidDataException } = require('../helpers/exceptions')

// routes
router.post('/', createCompliment)

// route handlers
async function createCompliment(req, res, next) {
    const complimenter = await usersService.getById(req.user.uid)
    const compliment = req.body
    compliment.complimenter = complimenter.getFieldsOnly()

    complimentsService.create(compliment)
        .then(compliment => res.status(201).json(compliment))
        .catch(e => e instanceof InvalidDataException ? 
            next(Response(400, e.message)) : next(Response(500, e)))
}

module.exports = router
