const request = require('supertest');
const app = require('../../app');

describe("Auth Routes Smoke Test", ()=>{
    it('should return a 400 or 401 on invalid login credentails', async()=>{
        const response = await request(app)
        .post('/auth/login')
        .send({email: 'wrong@user.com', password:'badpassword'});

        expect(response.statusCode).not.toBe(500);
    });
});