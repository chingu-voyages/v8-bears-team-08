'use strict'

/*
 *
 * Tests for the /helps-requests route
 * 
 */
const { validToken, user1, user2 } = require('../../test-global-data')
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
    user: {
        uid: user1.uid,
        name: user1.name,
        photoURL: user1.photoURL
    }
}

async function createHelpRequest(helpRequestToCreate) {
    return request(app)
        .post('/help-requests')
        .set('Authorization', 'Bearer ' + validToken)
        .set('Accept', 'application/json')
        .field('data', JSON.stringify(helpRequestToCreate))
        .expect('Content-Type', /json/)
        .expect(201)
        .then(response => response)
}

test('POST /help-requests should create a new Help Request', async () => {
    const response = await createHelpRequest(helpRequest3)
    
    expect(response.body.uid).toBeDefined()
    expect(response.body.title).toEqual(helpRequest3.title)
    expect(response.body.location).toEqual(helpRequest3.location)
    expect(response.body.user.uid).toEqual(helpRequest3.user.uid)
    expect(response.body.user.name).toEqual(helpRequest3.user.name)
    expect(response.body.user.photoURL).toEqual(helpRequest3.user.photoURL)
    expect(response.body.neededAsap).toEqual(false)
    expect(response.body.neededDatetime).toEqual(helpRequest3.neededDatetime)
    expect(response.body.tags).toEqual(helpRequest3.tags)
    expect(response.body.status).toEqual('active')
    expect(response.body.created).toBeDefined()
})

test('creating a help request with ASAP should have correct neededDatetime', async () => {
    const helpRequestToCreate = {
        neededAsap: true,
        ...helpRequest3
    }
    delete helpRequestToCreate.neededDatetime

    const response = await createHelpRequest(helpRequestToCreate)
    
    expect(response.body.neededAsap).toEqual(true)
    expect(response.body.neededDatetime).toEqual('0000-00-00T00:00:00.000Z')
})

test('marking a help request done', async () => {
    const createdHelpRequest = await createHelpRequest(helpRequest3)
    const uid = createdHelpRequest.body.uid

    // updating HelpRequest3 to mark it as complete
    const helpedByUser = {
        uid: user2.uid,
        name: user2.name,
        photoURL: user2.photoURL
    }
    
    const fieldsToUpdate = {
        status: 'complete',
        helpedByUser: helpedByUser
    }

    // update
    await put(`/help-requests/${uid}`, fieldsToUpdate).expect(200)

    // read back and verify
    const response = await get(`/help-requests/${uid}`).expect(200)
    expect(response.body.uid).toEqual(uid)
    expect(response.body.status).toEqual('complete')
    expect(response.body.helpedByUser).toEqual(helpedByUser)
    expect(response.body.completedDatetime).toBeDefined()
    expect(response.body.updatedDatetime).toBeDefined()
})

test('marking a help request done without a helping user', async () => {
    const createdHelpRequest = await createHelpRequest(helpRequest3)
    const uid = createdHelpRequest.body.uid

    // updating HelpRequest3 to mark it as complete
    const fieldsToUpdate = {
        status: 'complete'
    }

    // update
    await put(`/help-requests/${uid}`, fieldsToUpdate).expect(200)

    // read back and verify
    const response = await get(`/help-requests/${uid}`).expect(200)
    expect(response.body.uid).toEqual(uid)
    expect(response.body.status).toEqual('complete')
    expect(response.body.helpedByUser).not.toBeDefined()
    expect(response.body.completedDatetime).toBeDefined()
    expect(response.body.updatedDatetime).toBeDefined()
})

// helper functions
function post(url, body) {
    const httpRequest = request(app).post(url)
    httpRequest.set('Content-Type', 'application/json')
    httpRequest.set('Accept', 'application/json')
    httpRequest.set('Authorization', 'Bearer ' + validToken)
    httpRequest.send(body)

    return httpRequest
}

function put(url, body) {
    const httpRequest = request(app).put(url)
    httpRequest.set('Content-Type', 'application/json')
    httpRequest.set('Authorization', 'Bearer ' + validToken)
    httpRequest.send(body)
    
    return httpRequest
}

function get(url) {
    const httpRequest = request(app).get(url)
    httpRequest.set('Content-Type', 'application/json')
    httpRequest.set('Authorization', 'Bearer ' + validToken)
    httpRequest.set('Accept', 'application/json')

    return httpRequest
}
