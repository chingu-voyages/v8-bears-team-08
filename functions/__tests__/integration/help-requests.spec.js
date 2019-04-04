'use strict'

/*
 *
 * Tests for the /helps-requests route
 * 
 */
const request = require('supertest')
const app = require('../../app')
//const User = require('../../users/user')
// this is the mocked version of firebase-admin
const db = require('firebase-admin').firestore()
jest.mock('../../helpers/firebase-helper')

const validToken = "1234567890"
// This is the user that is being added to req.user during token validation
const user = {
    uid: "user-id1",
    name: "John Doe",
    photoURL: "https://pbs.twimg.com/profile_images/1055263632861343745/vIqzOHXj.jpg",
    email: "johndoe@fake-email.com"
}

const helpRequest = {
    title: "a ride to the dentist in Long Island",
    location: "11221",
    userId: user.uid,
    tags: ["Urgent", "Transportation"]
}

beforeEach(() => {
    // clear the helpsRequests from the "db"
    db.clear()
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
    const response = await createHelpRequest(helpRequest)
    expect(response.body.uid).toBeDefined()
    expect(response.body.title).toEqual(helpRequest.title)
    expect(response.body.location).toEqual(helpRequest.location)
    expect(response.body.userId).toEqual(helpRequest.userId)
    expect(response.body.tags).toEqual(helpRequest.tags)
    expect(response.body.created).toBeDefined()
})