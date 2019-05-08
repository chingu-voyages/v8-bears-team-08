'use strict'

/*
 *
 * Tests for the /inbox & /inbox/:uid/messages route
 * 
 */
const { validToken, user1, user2, conversation1, conversation1Messages } = require('../../test-global-data')
const request = require('supertest')
const app = require('../../app')
const firebaseHelper = require('../../helpers/firebase-helper')
jest.mock('../../helpers/firebase-helper')

test('GET /inbox should return a list of conversations in the users inbox', async () => {
    firebaseHelper.setRequestingUser(user1)

    return request(app)
        .get('/inbox')
        .set('Authorization', 'Bearer ' + validToken)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
            expect(response.body).toEqual(expect.arrayContaining([conversation1]))
        })
})

