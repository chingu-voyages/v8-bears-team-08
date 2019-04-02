'use strict'

/*
 *
 * Tests for the /users route
 * 
 */

const request = require('supertest')
const app = require('../../app')
const User = require('../../users/user')
// this is the mocked version of firebase-admin
const db = require('firebase-admin').firestore()
jest.mock('../../helpers/firebase-helper')

const validToken = "1234567890"
const user = {
    uid: "user-id1",
    name: "John Doe",
    photoURL: "https://pbs.twimg.com/profile_images/1055263632861343745/vIqzOHXj.jpg",
    email: "johndoe@fake-email.com"
}

beforeEach(() => {
    // clear the users from the "db"
    db.clear()
})

async function createUser() {
    return request(app)
        .post('/users')
        .set('Authorization', 'Bearer ' + validToken)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(user)
        .expect('Content-Type', /json/)
        .expect(201)
        .then(response => response)
}
  
test('POST /users should create a new user', async () => {
    const response = await createUser()
    expect(response.body.uid).toBe(user.uid)
    expect(response.body.name).toBe(user.name)
    expect(response.body.photoURL).toBe(user.photoURL)
    expect(response.body.email).toBe(user.email)
    expect(response.body.created).toBeDefined()
})

test('GET /users/:uid should return a valid user object', async () => {
    // First create a user and then try to read it back.
    await createUser()
    return request(app)
        .get('/users/' + user.uid)
        .set('Authorization', 'Bearer ' + validToken)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
            expect(response.body.uid).toBe(user.uid)
            expect(response.body.name).toBe(user.name)
            expect(response.body.photoURL).toBe(user.photoURL)
            expect(response.body.email).toBe(user.email)
            expect(response.body.created).toBeDefined()
        })
})

test('GET /users/:invalidId should return 404', () => {
    return request(app)
        .get('/users/userIdInvalid')
        .set('Authorization', 'Bearer ' + validToken)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404)
        .then(response => {
            expect(response.body.error.status).toBe("NOT_FOUND")
            expect(response.body.error.message).toBe("User not found")
        })
})

test('PUT /users/:uid should update the user', async () => {
    // First create a user and then try to update the photoURL and add an about section
    const newPhotoURL = "http://photourl..."
    const about = "About me"

    await createUser()
    return request(app)
        .put('/users/' + user.uid)
        .set('Authorization', 'Bearer ' + validToken)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
            photoURL: newPhotoURL,
            about: about
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
            expect(response.body.uid).toBe(user.uid)
            expect(response.body.name).toBe(user.name)
            expect(response.body.photoURL).toBe(newPhotoURL)
            expect(response.body.email).toBe(user.email)
            expect(response.body.about).toBe(about)
            expect(response.body.created).toBeDefined()
        })
})