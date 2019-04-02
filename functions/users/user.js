'use strict'

function User(userData) {
    const user = Object.create(User.prototype)
    user.uid = userData.uid
    user.name = userData.name
    user.photoURL = userData.picture || userData.photoURL
    user.email = userData.email
    user.about = userData.about
    user.created = userData.created || new Date().toISOString()

    return user
}

User.prototype.update = function({name, photoURL, about}) {
    if (name) this.name = name
    if (photoURL) this.photoURL = photoURL
    if (about) this.about = about
}

module.exports = User