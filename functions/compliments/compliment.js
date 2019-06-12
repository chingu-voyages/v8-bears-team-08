'use strict'
const util = require('../helpers/util')

function Compliment(data) {
    const compliment = Object.create(Compliment.prototype)
    compliment.uid = util.createRandomId()
    compliment.compliment = data.compliment
    compliment.complimenteeUid = data.complimenteeUid
    compliment.complimenter = {}
    compliment.complimenter.uid = data.complimenter.uid
    compliment.complimenter.name = data.complimenter.name
    compliment.complimenter.photoURL = data.complimenter.photoURL || undefined
    compliment.created = new Date().toISOString()

    return compliment
}

Compliment.createFromStore = function(dataFromStore) {
    return Object.assign(Object.create(Compliment.prototype), dataFromStore)
}

Compliment.prototype.hasRequiredFields = function() {
    return this.uid
           && this.compliment
           && this.created
           && this.complimenteeUid
           && this.complimenter.uid
           && this.complimenter.name
}

Compliment.prototype.getFieldsOnly = function() {
    const compliment = {
        uid: this.uid,
        compliment: this.compliment,
        complimenteeUid: this.complimenteeUid,
        created: this.created
    }

    compliment.complimenter = {
        uid: this.complimenter.uid,
        name: this.complimenter.name,
        ...(this.complimenter.photoURL && { photoURL: this.complimenter.photoURL })
    }

    return compliment
}

module.exports = Compliment