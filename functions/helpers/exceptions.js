'use strict'

function UserAlreadyExistsException(uid) {
    const e = Object.create(UserAlreadyExistsException.prototype)
    e.value = uid
    e.message = 'User already exists'
    
    return e
}
UserAlreadyExistsException.prototype.toString = function() {
    return `${this.value}: ${this.message}`
}

function UserNotFoundException(uid) {
    const e = Object.create(UserNotFoundException.prototype)
    e.value = uid
    e.message = 'User not found'
    
    return e
}

function InvalidDataException(message) {
    const e = Object.create(InvalidDataException.prototype)
    e.message = message

    return e
}

module.exports = {
    UserAlreadyExistsException,
    UserNotFoundException,
    InvalidDataException
}
