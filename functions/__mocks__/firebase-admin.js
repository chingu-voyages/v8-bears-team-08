'use strict'

// Mock of the firebase-admin api
function initializeApp(config) {

}

// Mock of the firestore api.
// Also include an extra 'clear' function which can be called from tests to empty the "db"
const dbCollections = {
    users: new Map(),
    'help-requests': new Map(),
    compliments: new Map()
}

function firestore() {
    return { 
        collection, 
        clear
    }
}

function clear() {
    dbCollections.users.clear()
    dbCollections['help-requests'].clear()
}

firestore.Timestamp = {
    fromDate: jest.fn((date) => {
        return date
    })
}

function collection(collection) {
    return { 
        doc: doc(collection),
        where: jest.fn((field, operator, value) => {
            return { 
                get: jest.fn(() => {
                    const matchingDocuments = []
                    dbCollections[collection].forEach((v,k,m) => {
                        if (evaluateBy[operator](leaf(v, field), value)) {
                            matchingDocuments.push(v)
                        }
                    })
                    
                    return Promise.resolve(matchingDocuments.map(document => {
                        const doc = {
                            id: document.uid,
                            data: () => document
                        }
                        return doc
                    }))
                })
            }
        })
    }
}
const evaluateBy = {
    '==': (a, b) => a == b
}
function leaf(obj, path) {
    return path.split('.').reduce((value,el) => value[el], obj)
}

function doc(collection) {
    return function doc(documentId) {
        const docId = documentId || makeRandomFirestoreId()

        return {
            id: docId,
            get: jest.fn(function() {
                return Promise.resolve({
                    data: jest.fn(() => {
                        if (dbCollections[collection].has(docId)) {
                            return dbCollections[collection].get(docId)
                        } else {
                            return undefined
                        }
                    })
                })
            }),
            set: jest.fn((data) => {
                dbCollections[collection].set(docId, data)
                return Promise.resolve(data)
            }),
            update: jest.fn((data) => {
                dbCollections[collection].set(docId, data)
                return Promise.resolve(data)
            })
        }
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