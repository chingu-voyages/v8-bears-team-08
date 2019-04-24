'use strict'

// Mock of the firebase-admin api
function initializeApp(config) {

}

// Mock of the firestore api.
// Also include an extra 'clear' function which can be called from tests to empty the "db"
const dbCollections = {
    users: new Map(),
    'help-requests': new Map(),
    compliments: new Map(),
    inbox: new Map()
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

function collection(collection) {
    return { 
        doc: doc(collection),
        where: jest.fn((field, operator, value) => {
            const matchingDocuments = []
            dbCollections[collection].forEach((v, k, m) => {
                if (evaluateBy[operator](leaf(v, field), value)) {
                    matchingDocuments.push(v)
                }
            })

            return { 
                get: getMultipleDocs(matchingDocuments)
            }
        })
    }
}

function doc(collection) {
    return function(documentId) {
        const docId = documentId || makeRandomFirestoreId()

        return {
            id: docId,
            get: getSingleDoc(collection, docId),
            set: set(collection, docId),
            update: set(collection, docId)
        }
    }
}

function getMultipleDocs(docs) {
    return function() {
        return Promise.resolve(docs.map(document => {
            return {
                id: document.uid,
                data: data(document)
            }
        }))
    }
}

function getSingleDoc(collection, docId) {
    return function() {
        return Promise.resolve({
            // will return the document or undefined if the document doesn't exist
            data: data(dbCollections[collection].get(docId))
        })
    }
}

function data(data) {
    return function() {
        return data
    }
}

function set(collection, docId) {
    return function(data) {
        dbCollections[collection].set(docId, data)
        return Promise.resolve(data)
    }
}

firestore.Timestamp = {
    fromDate: jest.fn((date) => {
        return date
    })
}

const evaluateBy = {
    '==': (a, b) => a == b
}

function leaf(obj, path) {
    return path.split('.').reduce((value,el) => value[el], obj)
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