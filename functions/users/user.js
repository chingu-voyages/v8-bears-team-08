'use strict'

module.exports = {
    create,
    update
}

function create(userData, timestamp) {
    return {
        uid: userData.uid,
        name: userData.name,
        photoURL: userData.picture,
        email: userData.email,
        about: userData.about,
        created: timestamp
    }
}

function update(userData) {
    const user = {}
    // These are the only editable fields for a user
    if (userData.name) user.name = userData.name
    if (userData.photoURL) user.photoURL = userData.photoURL
    if (userData.about) user.about = userData.about

    return user
}