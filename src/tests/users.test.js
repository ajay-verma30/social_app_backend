const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../../app'); 
const pool = require('../../db/conn'); 

describe('User Management API Integration', () => {
  
  beforeAll(async () => {
    try {
      const schemaPath = path.join(__dirname, '../../db/schema.sql');
      const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
      await pool.query(schemaSql);
    } catch (error) {
      console.error('Error Seeding Test schema', error);
      throw error;
    }
  });

  afterAll(async () => {
    await pool.end();
  });

  it('POST /users/register should successfully register a new user table entry', async () => {
    // Service ke mandatory check ke hisaab se saari fields daal di hain
    const newUser = {
      userName: 'ajay_test_user',
      password: 'SuperSecurePassword123!',
      email: 'ajaytest@example.com',
      f_name: 'Ajay',
      l_name: 'Verma',
      birthDate: '1995-01-01'
    };

    const response = await request(app)
      .post('/users/register')
      .send(newUser);

    // Agar registration validation cross karke DB entry banata hai
    // Apne controller behavior ke hisaab se response status check karo (200 ya 201)
    expect(response.statusCode).not.toBe(400);
    expect(response.statusCode).not.toBe(500);
    expect(response.body).toHaveProperty('userName', newUser.userName);
  });
});