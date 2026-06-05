const request  = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../../app');
const pool = require('../../db/conn');


describe('User Management API integrations', () =>{
    beforeAll(async()=>{
        try{
            const schemaPath = path.join(__dirname, '../../db/schema.sql');
            const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

            await pool.query(schemaSql);
        }
        catch(error){
            console.error("Error Seeding Test schema", error);
            throw error
        }
    });


    afterAll(async()=>{
        await pool.end();
        })

        it('POST /users should successfully register a new user table entry', async()=>{
            const newUser = {
                email: 'test@test.com',
                password: 'Test1234'
            };

            const response = await request(app)
            .post('/users/register')
            .send(newUser);

            expect(response.statusCode).toBe(201); // Or 200, matching your router design
    expect(response.body).toHaveProperty('email', newUser.email);
        
    })
});

