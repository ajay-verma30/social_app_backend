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

    // Fixed Assertions to match your exact controller response layout
    expect(response.statusCode).toBe(201); 
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('username', newUser.userName);
  });
});