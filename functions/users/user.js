'use strict'

function User(userData) {
    const user = Object.create(User.prototype)
    user.uid = userData.uid
    user.name = userData.name
    user.email = userData.email
    user.created = userData.created || new Date().toISOString()
    
    // optional
    user.photoURL = userData.picture || userData.photoURL
    user.about = userData.about

    return user
}

User.prototype.update = function({name, photoURL, about}) {
    if (name) this.name = name
    if (photoURL) this.photoURL = photoURL
    if (about) this.about = about
}

User.prototype.stripPrivateData = function() {
    delete this.email
}

User.prototype.getFieldsOnly = function() {
    return {
        uid: this.uid,
        name: this.name,
        photoURL: this.photoURL,
        email: this.email,
        ...(this.about && { about: this.about }),
        ...(this.created && { created: this.created })
    }
}

module.exports = User