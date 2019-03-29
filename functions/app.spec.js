const request = require('supertest');
const app = require('./app');

const validToken = "1234567890"
const invalidToken = "0987654321"

test('should respond with a 404 for all unknown urls', (done) => {
    request(app)
        .get('/')
        .set('Authorization', 'Bearer ' + validToken)
        .expect(404, done)
})
test('should respond with a 404 for all unknown urls', (done) => {
    request(app)
        .get('/test')
        .set('Authorization', 'Bearer ' + validToken)
        .expect(404, done)
})