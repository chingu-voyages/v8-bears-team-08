'use strict'

/*
 *
 * Tests for the /helps-requests route
 * 
 */
const { validToken, user1 } = require('../../test-global-data')
const request = require('supertest')
const app = require('../../app')
jest.mock('../../helpers/firebase-helper')

const helpRequest3 = {
    title: "a jump start",
    description: "I left my lights on.  Can you help?",
    location: "11221",
    tags: ["Urgent"],
    neededDatetime: "2019-05-24T16:00:00.000Z",
    photoURL: "http://www.photourl.fakeurl/DUOISJ-JSOJSIOJOG.png",
    userUid: user1.uid,
    userName: user1.name,
    userPhotoURL: "https://pbs.twimg.com/profile_images/1055263632861343745/vIqzOHXj.jpg"
}

const helpRequest4 = {
    title: "help",
    description: "the help description",
    location: "11221",
    tags: ["Urgent"],
    neededAsap: true,
    photoURL: "http://www.photourl.fakeurl/DUOISJ-JSOJSIOJOG.png",
    userUid: user1.uid,
    userName: user1.name,
    userPhotoURL: "https://pbs.twimg.com/profile_images/1055263632861343745/vIqzOHXj.jpg"
}

async function createHelpRequest(helpRequestToCreate) {
    return request(app)
        .post('/help-requests')
        .set('Authorization', 'Bearer ' + validToken)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(helpRequestToCreate)
        .expect('Content-Type', /json/)
        .expect(201)
        .then(response => response)
}

test('POST /help-requests should create a new Help Request', async () => {
    const response = await createHelpRequest(helpRequest3)
    
    expect(response.body.uid).toBeDefined()
    expect(response.body.title).toEqual(helpRequest3.title)
    expect(response.body.location).toEqual(helpRequest3.location)
    expect(response.body.user.uid).toEqual(helpRequest3.userUid)
    expect(response.body.user.name).toEqual(helpRequest3.userName)
    expect(response.body.user.photoURL).toEqual(helpRequest3.userPhotoURL)
    expect(response.body.neededAsap).toEqual(false)
    expect(response.body.neededDatetime).toEqual(helpRequest3.neededDatetime)
    expect(response.body.tags).toEqual(helpRequest3.tags)
    expect(response.body.status).toEqual('active')
    expect(response.body.created).toBeDefined()
})

test('creating a help request with ASAP should have correct neededDatetime', async () => {
    const response = await createHelpRequest(helpRequest4)
    
    expect(response.body.neededAsap).toEqual(true)
    expect(response.body.neededDatetime).toEqual('0000-00-00T00:00:00.000Z')
})

// test('GET /help-requests?sort=created should return a list of help requests sorted by creation date in desc order', async () => {
//     request(app)
//         .get('/help-requests')
//         .set('Authorization', 'Bearer ' + validToken)
//         .set('Content-Type', 'application/json')
//         .set('Accept', 'application/json')
//         .expect('Content-Type', /json/)
//         .expect(200)
//         .then(response => {
//
//         })
// })