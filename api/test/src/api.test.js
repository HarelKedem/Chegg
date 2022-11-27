// import supertest from 'supertest'
// import { app } from '../app.js'
//use the supertest object as our API


//test GET or READ call on localhost:3001/api/ endpoint
const request = require('supertest');
const app = require("../../../server");
const api = request(app)


describe('Api test suite', () => {
    it('tests /destinations endpoints', async() => {
        const response = await api.get("/api/people/1");
        console.log("responce: ", response)
        expect(response.body).toEqual({
               "gender": "male",
               "height": "172",
               "name": "Luke Skywalker",
               "vehicles": ["Snowspeeder"]
            });
        expect(response.statusCode).toBe(200);
        // Testing a single element in the array
        expect(response.body.vehicles).toEqual(expect.arrayContaining(['Snowspeeder']));

    });

    // Insert other tests below this line

    // Insert other tests above this line
});
// test('GET call', async () => {
//     await api
//         .get('/api/items')
//         .expect(200)
//         .expect('Content-Type', /application\/json/)
// })
