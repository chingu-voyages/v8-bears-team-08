'use strict'

/*
 * This file is a Multer storage engine for saving files to Google Cloud Storage (Firebase storage)
 */
const firebase = require('firebase-admin')
const uuid4 = require('uuid/v4')
const Path = require('path')
 

function FirebaseStorage(opts) {
    this.getDestination = opts.destination
}

FirebaseStorage.prototype._handleFile = function(req, file, callback) {
    this.getDestination(req, file, function(err, path) {
        if (err) {
            return callback(err)
        }

        const bucket = firebase.storage().bucket()
        const uuid = uuid4()
        const extension = Path.extname(file.originalname.toLowerCase())
        const gcsObjectFullPath = `${path}${uuid}-${Date.now()}${extension}`
        const gcsObject = bucket.file(gcsObjectFullPath)
        
        const writeStream = gcsObject
            .createWriteStream({
                metadata: {
                    contentType: file.mimetype,
                    metadata: {
                        firebaseStorageDownloadTokens: uuid
                    }
                },
                resumable: false
            }
        )

        file.stream
            .pipe(writeStream)
            .on('error', (err) => callback(err))
            .on('finish', () => {
                gcsObject.getMetadata()
                    .then(results => {
                        const metadata = results[0]
                        if (metadata) {
                            const bucketName = metadata.bucket
                            const fullPath = metadata.name
                            const token = metadata.metadata.firebaseStorageDownloadTokens

                            callback(null, {
                                gcsObjectUrl: constructUrl(bucketName, fullPath, token)
                            })
                        } else {
                            callback('Could not get file metadata after upload')
                        }
                    })
                    .catch(err => callback(err))
            })
    })
}

function constructUrl(bucketName, objectFullPath, token) {
    return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(objectFullPath)}?alt=media&token=${token}`
}

FirebaseStorage.prototype._removeFile = function _removeFile(req, file, cb) {
    
}

module.exports = function(opts) {
    return new FirebaseStorage(opts)
}