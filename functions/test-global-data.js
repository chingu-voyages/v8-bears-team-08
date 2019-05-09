'use strict'

const validToken = "1234567890"

const user1 = {
    uid: "user-id1",
    name: "John Doe",
    photoURL: "https://pbs.twimg.com/profile_images/1055263632861343745/vIqzOHXj.jpg",
    email: "johndoe@fake-email.com"
}

const user2 = {
    uid: "user-id2",
    name: "Jane Doe",
    photoURL: "https://pbs.twimg.com/profile_images/1055263632861343745/vIqzOHXj.jpg",
    email: "janedoe@fake-email.com"
}

const helpRequest1 = {
    uid: "hr-1",
    title: "a ride to the dentist in Long Island",
    description: "I can get my own ride home.  Thanks!",
    location: "11221",
    tags: ["Transportation"],
    neededDatetime: new Date().toISOString(),
    created: new Date().toISOString(),
    user: {
        uid: user1.uid,
        name: user1.name,
        photoURL: "https://pbs.twimg.com/profile_images/1055263632861343745/vIqzOHXj.jpg"
    }
}

const helpRequest2 = {
    uid: "hr-2",
    title: "help moving a couch",
    description: "The couch is light but I can't move it myself",
    location: "11222",
    tags: ["Physical", "Furniture"],
    neededAsap: true,
    created: new Date().toISOString(),
    user: {
        uid: user2.uid,
        name: user2.name,
        photoURL: "https://pbs.twimg.com/profile_images/1055263632861343745/vIqzOHXj.jpg"
    }
}

const compliment1 = {
    uid: "co-1",
    complimenteeUid: "user-id2",
    created: new Date().toISOString(),
    compliment: "Jane is really nice and smart. Thanks for helping me edit my resume!",
    complimenter: {
        uid: "user-id1",
        name: "John Doe",
        photoURL: "https://pbs.twimg.com/profile_images/1055263632861343745/vIqzOHXj.jpg"
    }
}


module.exports = {
    validToken,
    user1,
    user2,
    helpRequest1,
    helpRequest2,
    compliment1
}