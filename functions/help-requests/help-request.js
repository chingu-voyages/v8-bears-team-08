'use strict'

function HelpRequest(data) {
    const helpRequest = Object.create(HelpRequest.prototype)
    helpRequest.uid = data.uid
    helpRequest.title = data.title
    helpRequest.location = data.location
    helpRequest.created = data.created || new Date().toISOString()
    helpRequest.user = {}
    helpRequest.user.uid = data.user.uid
    helpRequest.user.name = data.user.name
    
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
           && this.user.uid
           && this.user.name
}

HelpRequest.prototype.toJson = function() {
    return {
        uid: this.uid,
        title: this.title,
        location: this.location,
        created: this.created,
        user: {
            uid: this.user.uid,
            name: this.user.name
        },
        ...(this.tags && { tags: this.tags })
    }
}

module.exports = HelpRequest