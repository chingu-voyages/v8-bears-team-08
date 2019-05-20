'use strict'

function User(userData) {
    const user = Object.create(User.prototype)
    user.uid = userData.uid
    user.name = userData.name
    user.firstName = userData.firstName
    user.lastName = userData.lastName
    user.email = userData.email
    user.location = userData.location
    user.emailVerifications = userData.emailVerifications
    user.created = userData.created || new Date().toISOString()
    
    // optional
    user.photoURL = userData.picture || userData.photoURL
    user.about = userData.about

    return user
}

User.prototype.update = function({name, photoURL, about, firstName, lastName}) {
    if (name) this.name = name
    if (photoURL) this.photoURL = photoURL
    if (about) this.about = about
    if (firstName) this.firstName = firstName
    if (lastName) this.lastName = lastName
}

User.prototype.stripPrivateData = function() {
    delete this.email
}

User.prototype.getFieldsOnly = function() {
    return {
        uid: this.uid,
        name: this.name,
        email: this.email,
        location: this.location,
        created: this.created,
        firstName: this.firstName,
        lastName: this.lastName,
        emailVerifications: this.emailVerifications,
        ...(this.photoURL && { photoURL: this.photoURL }),
        ...(this.about && { about: this.about })
    }
}

module.exports = User