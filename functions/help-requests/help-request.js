'use strict'

function HelpRequest(data) {
    const helpRequest = Object.create(HelpRequest.prototype)
    helpRequest.uid = data.uid
    helpRequest.title = data.title
    helpRequest.location = data.location
    helpRequest.created = data.created || new Date().toISOString()
    helpRequest.userId = data.userId
    
    // optional
    helpRequest.tags = data.tags
    
    return helpRequest
}

HelpRequest.prototype.update = function({title, location}) {
    if (title) this.title = title
    if (location) this.location = location
}

HelpRequest.prototype.hasRequiredFields = function() {
    return this.uid
           && this.title
           && this.location
           && this.created
           && this.userId
}

HelpRequest.prototype.toJson = function() {
    return {
        uid: this.uid,
        title: this.title,
        location: this.location,
        created: this.created,
        userId: this.userId,
        ...(this.tags && { tags: this.tags })
    }
}

module.exports = HelpRequest