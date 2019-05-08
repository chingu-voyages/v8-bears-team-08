'use strict'

const admin = require('firebase-admin')
const db = admin.firestore()

async function getInboxForUser(userId) {
    const conversationSnapshot = await db.collection('inbox').where('userIds', 'array-contains', userId).get()
    const conversations = []
    conversationSnapshot.forEach(doc => {
        conversations.push(doc.data())
    })

    return conversations
}

module.exports = {
    getInboxForUser
}