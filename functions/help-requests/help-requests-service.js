'use strict'

const admin = require('firebase-admin')
const db = admin.firestore()
const util = require('../helpers/util')
const { InvalidDataException, HelpRequestNotFoundException } = require('../helpers/exceptions')
const HelpRequest = require('./help-request')

async function getById(uid) {
    const helpRequestDoc = await db.collection('help-requests').doc(uid).get()
    if (!helpRequestDoc.data()) {
        throw HelpRequestNotFoundException(uid)
    }

    return HelpRequest.createFromStore(helpRequestDoc.data())
}

async function create(data) {
    const helpRequest = HelpRequest(data)
    helpRequest.uid = util.createRandomId()

    if (helpRequest.photoFile) {
        try {
            const file = helpRequest.photoFile
            const extension = path.extname(file.originalName.toLowerCase()) || file.mimeType.split('/')[1]
            helpRequest.photoURL = await firebaseHelper.saveFileToCloudStorage(file, 'help-request-photos/', `${helpRequest.uid}${extension}`)
        } catch(e) {
            console.log('failed to save file:', e)
            throw FailedToUploadFileException('Failed to save file')
        }
    }

    if (!helpRequest.hasRequiredFields()) {
        throw InvalidDataException("Invalid or missing data, " + JSON.stringify(helpRequest.getFieldsOnly()))
    }

    await db.collection('help-requests').doc(helpRequest.uid).set(helpRequest.getFieldsOnly())
    return helpRequest
}

async function update(uid, incomingData) {
    const helpRequest = await getById(uid)

    // TODO: update firebase-admin mock to handle batches
    if (helpRequest.status === 'active' && incomingData.status === 'complete') {
        // This update is to mark a help request as complete.
        // We need to add the help request to the helping user's document.
        helpRequest.update(incomingData)
        const helpRequestRef = db.collection('help-requests').doc(uid)
        const helpingUserRef = db.collection('users').doc(helpRequest.helpedByUser.uid)
        
        const batch = db.batch()
        batch.set(helpRequestRef, helpRequest.getFieldsOnly(), { merge: true })
        batch.set(helpingUserRef, { helpRequestsHelpedOn: admin.firestore.FieldValue.arrayUnion(uid) }, { merge: true })
        batch.commit()
            .catch(e => console.log('fail', e))
    } else {
        helpRequest.update(incomingData)
        await db.collection('help-requests').doc(uid).set(helpRequest.getFieldsOnly(), { merge: true })    
    }
    

    return
}

module.exports = {
    create,
    update,
    getById
}