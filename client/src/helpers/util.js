'use strict'

// Get firstname and the first letter of the last name
export function getDisplayName(name) {
    const nameParts = name.split(' ')
    const lastInitial = nameParts.pop().substring(0, 1) + '.'
    const firstName = nameParts.join(' ')

    return `${firstName} ${lastInitial}`
}