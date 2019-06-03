import moment from 'moment'
moment.updateLocale('en', {
    calendar : {
        lastDay: '[Yesterday,] LT',
        sameDay: 'LT',
        nextDay: '[Tomorrow,] LT',
        lastWeek: 'L, LT',
        nextWeek: 'L, LT',
        sameElse: 'L, LT'
    }
})

// Get firstname and the first letter of the last name
export function getDisplayName(name) {
    if (!name) {
        return name
    }

    const nameParts = name.split(' ')
    const lastInitial = nameParts.pop().substring(0, 1) + '.'
    const firstName = nameParts.join(' ')

    return `${firstName} ${lastInitial}`
}

// Conversation document IDs will be made up of both user uids: <smaller uid>-<larger uid>.
// This way we can always find a thread between 2 users just by its document ID
export function createConversationUidFromUserUids(uid1, uid2) {
    if (uid1 === uid2) {
        return undefined
    }

    if (uid1 < uid2) {
        return `${uid1}-${uid2}`
    } else {
        return `${uid2}-${uid1}`
    }
}

export function getCalendarLocaleTime(datetime) {
    return moment(new Date(datetime)).calendar()
}

export function getRelativeLocaleTime(datetime) {
    const now = moment(new Date())
    const theDatetime = moment(new Date(datetime))
    
    if (now.diff(theDatetime, 'hours') <= 4) {
        return theDatetime.fromNow()
    } else {
        return 'on ' + theDatetime.calendar()
    }
}

export function getRelativeTime(datetime) {
    const theDatetime = moment(new Date(datetime))
    return theDatetime.fromNow()
}

export function createGuestUser(uid) {
    return {
        uid,
        isGuest: true,
        displayName: 'Guest',
        firstName: 'Guest',
        lastName: 'Guest',
        location: '11221'
    }
}