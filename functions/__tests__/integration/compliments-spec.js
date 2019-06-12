'use strict'

/*
 *
 * Tests for the /compliments route
 * 
 */
const { validToken, user1, user2 } = require('../../test-global-data')
const request = require('supertest')
const app = require('../../app')
jest.mock('../../helpers/firebase-helper')

// complimenter gets added as the currently authenticated user
const compliment = {
    compliment: "You are a great neighbor!",
    complimenteeUid: user2.uid
}

async function createCompliment(complimentToCreate) {
    return request(app)
        .post('/compliments')
        .set('Authorization', 'Bearer ' + validToken)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(complimentToCreate)
        .expect('Content-Type', /json/)
        .expect(201)
        .then(response => response)
}

test('POST /compliments should create a compliment', async () => {
    const response = await createCompliment(compliment)
    
    expect(response.body.uid).toBeDefined()
    expect(response.body.compliment).toEqual(compliment.compliment)
    expect(response.body.complimenteeUid).toEqual(compliment.complimenteeUid)
    expect(response.body.complimenter.uid).toEqual(user1.uid)
    expect(response.body.complimenter.name).toEqual(user1.name)
    expect(response.body.complimenter.photoURL).toEqual(user1.photoURL)
    expect(response.body.created).toBeDefined()
})