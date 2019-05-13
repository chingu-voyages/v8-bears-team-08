export default function conversation(user1, user2) {
    return {
        users: [
            {
                uid: user1.uid,
                name: user1.name,
                photoURL: user1.photoURL
            },
            {
                uid: user2.uid,
                name: user2.name,
                photoURL: user2.photoURL
            }
        ],
        userIds: [user1.uid, user2.uid],
        created: new Date().toISOString()
    }
}