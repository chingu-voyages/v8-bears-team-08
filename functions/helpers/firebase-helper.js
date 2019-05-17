'use strict'

const Response = require('./http-response')
const firebase = require('firebase-admin')
const uuid4 = require('uuid/v4')

function validateFirebaseIdToken(req, res, next) {
    console.log('Checking if request is authorized with Firebase ID token')
  
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        console.error('No Firebase ID token was passed as a Bearer token in the Authorization header')
        return next(Response(401))
    }
    
    let idToken = req.headers.authorization.split('Bearer ')[1]
    firebase.auth().verifyIdToken(idToken)
        .then((decodedIdToken) => {
            console.log('ID Token correctly decoded')
            req.user = decodedIdToken
            return next()
        })
        .catch((error) => {
            console.error('Error while verifying Firebase ID token')
            return next(Response(401))
        })
}

function saveFileToCloudStorage(file, path, name) {
    return new Promise((resolve, reject) => {
        const storage = firebase.storage()
        const bucket = storage.bucket()
        const uuid = uuid4()

        const myNewFile = bucket.file(`${path}${name}`)

        const options = {
            metadata: {
                contentType: file.mimeType,
                metadata: {
                    firebaseStorageDownloadTokens: uuid
                }
            },
            resumable: false
        }

        myNewFile.save(file.buffer, options)
            .then(() => {
                myNewFile.getMetadata()
                    .then(results => {
                        const metadata = results[0]
                        if (metadata) {
                            const bucketName = metadata.bucket
                            const fullPath = metadata.name
                            const token = metadata.metadata.firebaseStorageDownloadTokens
                            
                            console.log('Successfully got file metadata')
                            resolve(constructUrl(bucketName, fullPath, token))
                        } else {
                            reject('Could not get file metadata after upload')
                        }
                    })
                    .catch(err => reject(err))
            })
            .catch(err => {
                console.log('Failed to save file:', err)
                reject(err)
            })
    })
}

function constructUrl(bucketName, objectFullPath, token) {
    return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(objectFullPath)}?alt=media&token=${token}`
}

module.exports = {
    validateFirebaseIdToken,
    saveFileToCloudStorage
}
