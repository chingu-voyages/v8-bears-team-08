'use strict'

function HelpRequest(data) {
    const helpRequest = Object.create(HelpRequest.prototype)
    helpRequest.uid = data.uid
    helpRequest.title = data.title
    helpRequest.description = data.description
    helpRequest.location = data.location
    helpRequest.created = data.created || new Date().toISOString()
    helpRequest.neededAsap = data.neededAsap || false
    helpRequest.neededDatetime = data.neededDatetime
    helpRequest.user = {}
    helpRequest.user.uid = data.user.uid
    helpRequest.user.name = data.user.name
    helpRequest.user.photoURL = data.user.photoURL
    
    // optional
    helpRequest.tags = data.tags
    
    return helpRequest
}

HelpRequest.prototype.update = function({title, description, location, neededAsap, neededDatetime}) {
    if (title) this.title = title
    if (location) this.location = location
    if (description) this.description = description
    if (neededAsap) this.neededAsap = neededAsap
    if (neededDatetime) this.neededDatetime = neededDatetime
}

HelpRequest.prototype.hasRequiredFields = function() {
    return this.uid
           && this.title
           && this.description
           && this.location
           && this.created
           && this.user.uid
           && this.user.name
           && (this.neededAsap || this.neededDatetime)
}

HelpRequest.prototype.toJson = function() {
    return {
        uid: this.uid,
        title: this.title,
        description: this.description,
        location: this.location,
        created: this.created,
        user: {
            uid: this.user.uid,
            name: this.user.name,
            ...(this.user.photoURL && { photoURL: this.user.photoURL })
        },
        ...(this.tags && { tags: this.tags }),
        ...(this.neededDatetime && { neededDatetime: this.neededDatetime}),
        ...(this.neededAsap && { neededAsap: this.neededAsap})
    }
}

module.exports = HelpRequest