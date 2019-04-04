'use strict'

const User = require('../users/user')

const dbData = new Map()

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
    dbData.clear()
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
        id: docId || makeRandomFirestoreId(),
        get: jest.fn(function() {
            return Promise.resolve({
                data: jest.fn(() => {
                    if (dbData.has(docId)) {
                        return dbData.get(docId)
                    } else {
                        return undefined
                    }
                })
            })
        }),
        set: jest.fn((userData) => {
            const user = User(userData)
            dbData.set(user.uid, user)
            return Promise.resolve(user)
        }),
        update: jest.fn((userData) => {
            const user = dbData.get(userData.uid)
            user.update(userData)

            return Promise.resolve(user)
        })
    }
}

function makeRandomFirestoreId() {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const length = 20
    let id = "";
  
    for (var i = 0; i < length; i++)
    id += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return id;
}

module.exports = {
    initializeApp,
    firestore
}