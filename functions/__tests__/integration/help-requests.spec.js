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
    location: "11221",
    userId: user1.uid,
    tags: ["Urgent"]
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
    expect(response.body.userId).toEqual(helpRequest3.userId)
    expect(response.body.tags).toEqual(helpRequest3.tags)
    expect(response.body.created).toBeDefined()
})

test('GET /help-requests should return a list of help requests sorted by creation date in desc order', async () => {

})