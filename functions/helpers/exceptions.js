'use strict'

module.exports = {
    UserAlreadyExistsException,
    UserNotFoundException
}

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
    const e = {}
    e.value = uid
    e.message = 'User not found'
    
    return e
}