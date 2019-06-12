'use strict'

function UserAlreadyExistsException(uid) {
    const e = Object.create(UserAlreadyExistsException.prototype)
    e.value = uid
    e.message = 'User already exists'
    
    return e
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

function HelpRequestNotFoundException(uid) {
    const e = Object.create(HelpRequestNotFoundException)
    e.value = uid
    e.message = 'HelpRequest not found'

    return e
}

function FailedToUploadFileException(message) {
    const e = Object.create(FailedToUploadFileException.prototype)
    e.message = message

    return e
}

module.exports = {
    UserAlreadyExistsException,
    UserNotFoundException,
    InvalidDataException,
    HelpRequestNotFoundException,
    FailedToUploadFileException
}
