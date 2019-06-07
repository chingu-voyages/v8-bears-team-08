'use strict'

/*
 *
 * Tests for the /users route
 * 
 */
const { validToken, user1, user2, helpRequest2 } = require('../../test-global-data')
const request = require('supertest')
const app = require('../../app')
const User = require('../../users/user')
const firebaseHelper = require('../../helpers/firebase-helper')
jest.mock('../../helpers/firebase-helper')

const user3 = User({
    uid: "userid3",
    name: "Bob Smith",
    photoURL: "https://pbs.twimg.com/profile_images/1055263632861343745/vIqzOHXj.jpg",
    email: "bob.smith@fake-email.com",
    about: "About me",
    location: "11221",
    created: new Date().toISOString()
})

async function createUser(userToCreate) {
    return request(app)
        .post('/users')
        .set('Authorization', 'Bearer ' + validToken)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(userToCreate)
        .expect('Content-Type', /json/)
        .expect(201)
        .then(response => response)
}
  
test('POST /users should create a new user', async () => {
    firebaseHelper.setRequestingUser(user3)
    
    const response = await createUser(user3.getFieldsOnly())
    expect(response.body.uid).toBe(user3.uid)
    expect(response.body.name).toBe(user3.name)
    expect(response.body.photoURL).toBe(user3.photoURL)
    expect(response.body.email).toBe(user3.email)
    expect(response.body.created).toBeDefined()
})

test('GET /users/:uid should return a valid user object', async () => {
    firebaseHelper.setRequestingUser(user1)

    return request(app)
        .get('/users/' + user1.uid)
        .set('Authorization', 'Bearer ' + validToken)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
            expect(response.body.uid).toBe(user1.uid)
            expect(response.body.name).toBe(user1.name)
            expect(response.body.photoURL).toBe(user1.photoURL)
            expect(response.body.email).toBe(user1.email)
            expect(response.body.created).toBeDefined()
        })
})

test('GET /users/:uid where requesting user != requested user, private data such as email should not returned', async () => {
    firebaseHelper.setRequestingUser(user1)

    return request(app)
        .get('/users/' + user2.uid)
        .set('Authorization', 'Bearer ' + validToken)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
            expect(response.body.uid).toBe(user2.uid)
            expect(response.body.name).toBe(user2.name)
            expect(response.body.photoURL).toBe(user2.photoURL)
            expect(response.body.created).toBeDefined()
            // the real test is this, it needs to be undefined
            expect(response.body.email).toBeUndefined()
        })
})

test('GET /users/:invalidId should return 404', () => {
    firebaseHelper.setRequestingUser(user1)

    return request(app)
        .get('/users/invalidUserId')
        .set('Authorization', 'Bearer ' + validToken)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404)
        .then(response => {
            expect(response.body.error.status).toBe("NOT_FOUND")
            expect(response.body.error.message).toBe("User not found: invalidUserId")
        })
})

test('PUT /users/:uid should update the user', async () => {
    firebaseHelper.setRequestingUser(user1)
    const newPhotoURL = "http://photourl..."
    const about = "About me"

    await request(app)
        .put('/users/' + user1.uid)
        .set('Authorization', 'Bearer ' + validToken)
        .set('Content-Type', 'application/json')
        .send({
            photoURL: newPhotoURL,
            about: about
        })
        .expect(200)
        .then()

    return request(app)
        .get(`/users/${user1.uid}`)
        .set('Authorization', 'Bearer ' + validToken)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
            expect(response.body.uid).toBe(user1.uid)
            expect(response.body.name).toBe(user1.name)
            expect(response.body.photoURL).toBe(newPhotoURL)
            expect(response.body.email).toBe(user1.email)
            expect(response.body.about).toBe(about)
            expect(response.body.created).toBeDefined()
        })
})

test('GET /users/:uid/profile should get the full user profile including helprequests and compliments', async () => {
    firebaseHelper.setRequestingUser(user1)

    return request(app)
        .get('/users/' + user2.uid + '/profile')
        .set('Authorization', 'Bearer ' + validToken)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
            expect(response.body.uid).toBe(user2.uid)
            expect(response.body.email).toBeUndefined()
            expect(response.body.helpRequests[0]).toEqual({
                uid: helpRequest2.uid,
                title: helpRequest2.title,
                description: helpRequest2.description,
                location: helpRequest2.location,
                tags: helpRequest2.tags,
                neededAsap: helpRequest2.neededAsap,
                neededDatetime: helpRequest2.neededDatetime,
                created: response.body.helpRequests[0].created,
                status: helpRequest2.status,
                user: {
                    uid: user2.uid,
                    name: user2.name,
                    photoURL: user2.photoURL
                }
            })
        })
})