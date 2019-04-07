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
    title: "a ride to the dentist in Long Island",
    location: "11221",
    userId: user1.uid,
    tags: ["Urgent", "Transportation"]
}

const helpRequest2 = {
    title: "help moving a couch",
    location: "11222",
    userId: user2.uid,
    tags: ["Physical"]
}


module.exports = {
    validToken,
    user1,
    user2,
    helpRequest1,
    helpRequest2
}