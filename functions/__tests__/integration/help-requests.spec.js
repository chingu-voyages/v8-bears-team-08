'use strict'

/*
 *
 * Tests for the /helps-requests route
 * 
 */
const { validToken, user1, user2, helpRequest1 } = require('../../test-global-data')
const request = require('supertest')
const app = require('../../app')
const firebaseHelper = require('../../helpers/firebase-helper')
jest.mock('../../helpers/firebase-helper')
const HelpRequest = require('../../help-requests/help-request')

const helpRequest3 = HelpRequest({
    title: "a jump start",
    description: "I left my lights on.  Can you help?",
    location: "11221",
    tags: ["Urgent"],
    neededDatetime: new Date().toISOString(),
    user: {
        uid: user1.uid,
        name: user1.name,
        photoURL: "https://pbs.twimg.com/profile_images/1055263632861343745/vIqzOHXj.jpg"
    }
})

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
    const response = await createHelpRequest(helpRequest3.toJson())
    expect(response.body.uid).toBeDefined()
    expect(response.body.title).toEqual(helpRequest3.title)
    expect(response.body.location).toEqual(helpRequest3.location)
    expect(response.body.user.uid).toEqual(helpRequest3.user.uid)
    expect(response.body.user.name).toEqual(helpRequest3.user.name)
    expect(response.body.tags).toEqual(helpRequest3.tags)
    expect(response.body.created).toBeDefined()
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