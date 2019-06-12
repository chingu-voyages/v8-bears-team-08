'use strict'

function HelpRequest(data) {
    const helpRequest = Object.create(HelpRequest.prototype)
    helpRequest.uid = data.uid
    helpRequest.title = data.title
    helpRequest.description = data.description
    helpRequest.location = data.location
    helpRequest.created = new Date().toISOString()
    helpRequest.neededAsap = data.neededAsap ? true : false
    helpRequest.neededDatetime = data.neededAsap ? '0000-00-00T00:00:00.000Z' : new Date(data.neededDatetime).toISOString()
    helpRequest.photoURL = data.photoURL
    helpRequest.status = 'active'
    helpRequest.user = data.user
    
    if (data.tags) {
        if (Array.isArray(data.tags)) {
            helpRequest.tags = data.tags
        } else {
            helpRequest.tags = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.len > 0)
        }
    }

    return helpRequest
}

HelpRequest.createFromStore = function(dataFromStore) {
    return Object.assign(Object.create(HelpRequest.prototype), dataFromStore)
}

HelpRequest.prototype.update = function({title, description, location, neededAsap, neededDatetime, photoURL, status, helpedByUser}) {
    const beforeUpdate = Object.assign({}, this)

    if (title) this.title = title
    if (location) this.location = location
    if (description) this.description = description
    if (neededAsap) this.neededAsap = neededAsap
    if (neededDatetime) this.neededDatetime = neededDatetime
    if (photoURL) this.photoURL = photoURL

    if (status === 'complete' && this.status === 'active') {
        // This update is to mark a help request as complete
        if (helpedByUser && helpedByUser.uid && helpedByUser.name) {
            this.helpedByUser = helpedByUser
        }
        this.status = 'complete'
        this.completedDatetime = new Date().toISOString()
    }

    if (JSON.stringify(beforeUpdate) !== JSON.stringify(this.getFieldsOnly())) {
        this.updatedDatetime = new Date().toISOString()
    }
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
           && this.neededDatetime
           && typeof this.neededAsap !== 'undefined'
           && this.neededAsap !== null
}

HelpRequest.prototype.getFieldsOnly = function() {
    const helpRequest = {
        uid: this.uid,
        title: this.title,
        description: this.description,
        location: this.location,
        created: this.created,
        status: this.status,
        neededAsap: this.neededAsap,
        neededDatetime: this.neededDatetime,
        ...(this.tags && { tags: this.tags }),
        ...(this.photoURL && { photoURL: this.photoURL }),
        ...(this.updatedDatetime && { updatedDatetime: this.updatedDatetime }),
        ...(this.helpedByUser && { helpedByUser: this.helpedByUser }),
        ...(this.completedDatetime && { completedDatetime: this.completedDatetime })
    }

    helpRequest.user = {
        uid: this.user.uid,
        name: this.user.name,
        ...(this.user.photoURL && { photoURL: this.user.photoURL })
    }

    return helpRequest
}

module.exports = HelpRequest