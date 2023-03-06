const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Notes = mongoose.model('Note');

describe('Note Endpoints', () => {
  let noteId = '';
  let token = '';

  beforeEach(async () => {
    // signup test user
    await request(app)
      .post('/api/auth/signup')
      .send({
        user: {
          email: 'testuser@test.com',
          password: 'testpassword'
        }
      })

    // login and get access token
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        user: {
          email: 'testuser@test.com',
          password: 'testpassword'
        }
      });

      token = res.body.user.token;
  });

  describe('POST /api/notes', () => {
    test('should create a new note for the authenticated user', async () => {
      const response = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          note: {
            content: "test note"
          }
        })
        .expect(200);

      expect(response.body.data[0].id).toBeDefined();
      noteId = response.body.data[0].id;
    });
  });

  describe('GET /api/notes/:id', () => {
    test('should get a note by ID for the authenticated user', async () => {
      const response = await request(app)
        .get(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.data[0].id).toBeDefined();
    });
  });

  describe.skip('PUT /api/notes/:id', () => {
    test('should update an existing note by ID for the authenticated user', async () => {
      const response = await request(app)
        .put(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          note: {
            content: 'updated test note'
          }
        })
        .expect(200);

      expect(response.body.data[0].content).toBe('updated test note');
    });
  });

  describe.skip('DELETE /api/notes/:id', () => {
    test('should delete a note by ID for the authenticated user', async () => {
      await request(app)
        .delete(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
    });
  });

  describe.skip('POST /api/notes/:id/share', () => {
    test('should share a note with another user for the authenticated user', async () => {
      const response = await request(app)
        .get(`/api/notes/${noteId}/share`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          user: {
            id: secondUserId
          }
        })
        .expect(201);
    });
  });

  describe.skip('GET /api/search', () => {
    test('search for notes based on keywords for the authenticated user', async () => {
      const response = await request(app)
        .get(`/api/search?content=note`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.data[0].id).toBeDefined();
    });
  });
})

