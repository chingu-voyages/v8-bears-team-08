'use strict'

const util = require('../helpers/util')

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
    dbCollections.compliments.clear()
}

function collection(collection) {
    return { 
        doc: doc(collection),
        where: where(collection)
    }
}

function where(collection) {
    return function(field, operator, value) {
        let dataToCheck
        if (dbCollections[collection]) {
            dataToCheck = dbCollections[collection]
        } else {
            // This is a nested where clause so 'collection' is actually an array of previously matched documents
            const documents = new Map()
            collection.forEach(item => documents.set(item.uid, item))
            dataToCheck = documents
        }

        const matchingDocuments = []
        dataToCheck.forEach(v => {
            if (evaluateBy[operator](leaf(v, field), value)) {
                matchingDocuments.push(v)
            }
        })

        return {
            where: where(matchingDocuments),
            get: getMultipleDocs(matchingDocuments),
            orderBy: orderBy(matchingDocuments)
        }
    }
}

function orderBy(documents) {
    return function(field, direction) {
        // TODO: implement sorting if needed
        
        return {
            get: getMultipleDocs(documents),
            limit: limit(documents)
        }
    }
}

function limit(documents) {
    return function(numResults) {

        return {
            get: getMultipleDocs(documents.slice(0, numResults))
        }
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
        return Promise.resolve()
    }
}

firestore.Timestamp = {
    fromDate: jest.fn((date) => {
        return date
    })
}

const evaluateBy = {
    '==': (a, b) => a == b,
    'array-contains': (arr, items) => arr.includes(items) 
}

function leaf(obj, path) {
    return path.split('.').reduce((value,el) => value[el], obj)
}

function makeRandomFirestoreId() {
    return util.createRandomId()
}

module.exports = {
    initializeApp,
    firestore
}