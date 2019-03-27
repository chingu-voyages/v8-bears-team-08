const admin = require('firebase-admin')
const db = admin.firestore();

async function getUserData(userId) {
    const userDoc = db.collection('users').doc(userId)
    try {
        let user = await userDoc.get()
        console.log('success', user.data())
        return user.data()
    } catch (error) {
        console.log('error', error)
        return {error: error}
    }
}

module.exports.getUserData = getUserData