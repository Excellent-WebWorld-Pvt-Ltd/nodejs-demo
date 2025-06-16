const request = require('supertest');
const assert = require('assert');
const app = require('../app'); // Make sure your app.js exports the app

const User = require('../models/User');
const TokenBlacklist = require('../models/TokenBlacklist');

let token = '';
let userId = '';

describe('Auth API Tests (Supertest + Assert)', () => {

  // Remove any test user before running tests
  beforeAll(async () => {
    await User.destroy({ where: { email: 'testuser@example.com' } });
  });


  describe('POST /api/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/register')
        .send({
          name: 'Test User',
          email: 'testuser@example.com',
          password: 'password123',
          image: 'testimage.jpg',
          token: 'testPushToken'
        });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.status, true);
      assert.ok(res.body.data.token);
      assert.ok(res.body.data.user);
      userId = res.body.data.user.id;
    });

    it('should not register with existing email', async () => {
      const res = await request(app)
        .post('/api/register')
        .send({
          name: 'Test User',
          email: 'testuser@example.com',
          password: 'password123',
          image: 'testimage.jpg',
          token: 'testPushToken'
        });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.status, false);
      assert.strictEqual(res.body.message, 'Email already in use');
    });
  });

  describe('POST /api/login', () => {
    it('should login successfully', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({
          email: 'testuser@example.com',
          password: 'password123',
          token: 'testPushToken'
        });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.status, true);
      assert.ok(res.body.data.jwtToken);
      token = res.body.data.jwtToken;
    });

    it('should fail with invalid password', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({
          email: 'testuser@example.com',
          password: 'wrongpassword'
        });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.status, false);
      assert.strictEqual(res.body.message, 'Invalid credentials');
    });
  });

  describe('GET /api/profile', () => {
    it('should fetch profile with valid token', async () => {
      const res = await request(app)
        .get('/api/profile')
        .set('Authorization', `Bearer ${token}`);

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.status, true);
      assert.strictEqual(res.body.data.email, 'testuser@example.com');
    });

    it('should fail without token', async () => {
      const res = await request(app)
        .get('/api/profile');

      assert.strictEqual(res.status, 401);
      assert.strictEqual(res.body.status, false);
    });
  });

  describe('GET /api/logout', () => {
    it('should logout successfully', async () => {
      const res = await request(app)
        .get('/api/logout')
        .set('Authorization', `Bearer ${token}`);

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.status, true);
      assert.strictEqual(res.body.message, 'Logged out successfully');

      const blacklisted = await TokenBlacklist.findOne({ where: { token } });
      assert.ok(blacklisted);
    });

    it('should fail without token', async () => {
      const res = await request(app)
        .get('/api/logout');

      assert.strictEqual(res.status, 401);
      assert.strictEqual(res.body.status, false);
      assert.strictEqual(res.body.message, 'Token required');
    });
  });

});
