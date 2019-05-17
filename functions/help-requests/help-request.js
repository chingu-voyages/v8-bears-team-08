'use strict'

function HelpRequest(data) {
    const helpRequest = Object.create(HelpRequest.prototype)
    helpRequest.uid = data.uid
    helpRequest.title = data.title
    helpRequest.description = data.description
    helpRequest.location = data.location
    helpRequest.created = data.created || new Date().toISOString()
    helpRequest.neededAsap = data.neededAsap ? true : false
    helpRequest.neededDatetime = data.neededDatetime ? new Date().toISOString(data.neededDatetime) : undefined
    helpRequest.photoURL = data.photoURL
    helpRequest.status = data.status ? data.status : 'active'
    if (data.user) {
        helpRequest.user = {}
        helpRequest.user.uid = data.user.uid
        helpRequest.user.name = data.user.name
        helpRequest.user.photoURL = data.user.photoURL
    }
    
    if (data.tags) {
        if (Array.isArray(data.tags)) {
            helpRequest.tags = data.tags
        } else {
            helpRequest.tags = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.len > 0)
        }
    }
    
    return helpRequest
}

HelpRequest.prototype.update = function({title, description, location, neededAsap, neededDatetime, photoURL}) {
    if (title) this.title = title
    if (location) this.location = location
    if (description) this.description = description
    if (neededAsap) this.neededAsap = neededAsap
    if (neededDatetime) this.neededDatetime = neededDatetime
    if (photoURL) this.photoURL = photoURL
}

HelpRequest.prototype.hasRequiredFields = function() {
    return this.uid
           && this.title
           && this.description
           && this.location
           && this.created
           && this.user
           && this.user.uid
           && this.user.name
           && this.status
           && (this.neededAsap || this.neededDatetime)
}

HelpRequest.prototype.getFieldsOnly = function() {
    const helpRequest = {
        uid: this.uid,
        title: this.title,
        description: this.description,
        location: this.location,
        created: this.created,
        status: this.status,
        ...(this.tags && { tags: this.tags }),
        ...(this.neededDatetime && { neededDatetime: this.neededDatetime }),
        ...(this.neededAsap && { neededAsap: this.neededAsap }),
        ...(this.photoURL && { photoURL: this.photoURL })
    }

    if (this.user) {
        helpRequest.user = {
            uid: this.user.uid,
            name: this.user.name,
            ...(this.user.photoURL && { photoURL: this.user.photoURL })
        }
    }

    return helpRequest
}

module.exports = HelpRequest