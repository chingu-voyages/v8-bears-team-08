'use strict'

const User = require('../users/user')

const users = new Map()

function initializeApp(config) {

}

// Mock of the firestore api.
// Also include an extra 'clear' function which can be called from tests to empty the "db"
function firestore() {
    return { 
        collection, 
        clear 
    }
}

function clear() {
    users.clear()
}

firestore.Timestamp = {
    fromDate: jest.fn((date) => {
        return date
    })
}

function collection(collection) {
    return { doc }
}

function doc(docId) {
    return {
        get: jest.fn(function() {
            return Promise.resolve({
                data: jest.fn(() => {
                    if (users.has(docId)) {
                        return users.get(docId)
                    } else {
                        return undefined
                    }
                })
            })
        }),
        set: jest.fn((userData) => {
            const user = User(userData)
            users.set(user.uid, user)
            
            return Promise.resolve(user)
        }),
        update: jest.fn((userData) => {
            const user = users.get(userData.uid)
            user.update(userData)

            return Promise.resolve(user)
        })
    }
}

module.exports = {
    initializeApp,
    firestore
}