const express = require('express')
const router = express.Router()
const controller = require('./users-controller')


router.get('/:userId', controller.getUserById)

module.exports = router