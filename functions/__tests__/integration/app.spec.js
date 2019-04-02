'use strict'

/*
 *
 * Tests for app / routes
 * 
 */

const request = require('supertest')
const app = require('../../app')
jest.mock('../../helpers/firebase-helper')

const validToken = "1234567890"
const invalidToken = "0987654321"

test('should respond with a 404 for all unknown urls', () => {
    return request(app)
        .get('/')
        .set('Authorization', 'Bearer ' + validToken)
        .expect(404)
})

test('should respond with a 404 for all unknown urls', () => {
    return request(app)
        .get('/test')
        .set('Authorization', 'Bearer ' + validToken)
        .expect(404)
})

test('should respond with a 401 for all requests with an invalid Bearer token', () => {
    return request(app)
        .get('/')
        .set('Authorization', 'Bearer ' + invalidToken)
        .expect(401)
})