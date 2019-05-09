'use strict'

// Get firstname and the first letter of the last name
export function getDisplayName(name) {
    const nameParts = name.split(' ')
    const lastInitial = nameParts.pop().substring(0, 1) + '.'
    const firstName = nameParts.join(' ')

    return `${firstName} ${lastInitial}`
}

// Conversation document IDs will be made up of both user uids: <smaller uid>-<larger uid>.
// This way we can always find a thread between 2 users just by its document ID
export function createConversationUidFromUserUids(uid1, uid2) {
    if (uid1 < uid2) {
        return `${uid1}-${uid2}`
    } else {
        return `${uid2}-${uid1}`
    }
}