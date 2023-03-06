const request = require('supertest');
const server = require('../index');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Note = mongoose.model('Note');

describe('Note Endpoints', () => {
  let noteId = '';
  let token = '';

  beforeAll(async () => {
    await User.deleteMany({});
    await Note.deleteMany({});
    await request(server)
      .post('/api/auth/signup')
      .send({
        user: {
          email: 'testuser@test.com',
          password: 'testpassword'
        }
      })
  
    // login and get access token
    const res = await request(server)
      .post('/api/auth/login')
      .send({
        user: {
          email: 'testuser@test.com',
          password: 'testpassword'
        }
      });
    token = res.body.user.token;
  });

  afterAll(async () => {
    server.close();
    await mongoose.connection.close();
  });

  describe('POST /api/notes', () => {
    test('should create a new note for the authenticated user', async () => {
      const response = await request(server)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({ note: { content: "test note" } })
        .expect(200);

      expect(response.body.note[0].id).toBeDefined();
      noteId = response.body.note[0].id;
    });
  });

  describe('GET /api/notes/:id', () => {
    test('should get a note by ID for the authenticated user', async () => {
      const response = await request(server)
        .get(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.note[0]._id).toBeDefined();
    });
  });

  describe('PUT /api/notes/:id', () => {
    test('should update an existing note by ID for the authenticated user', async () => {
      const response = await request(server)
        .put(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ note: { content: 'UPDATED test note' }})
        .expect(204);

        const response2 = await request(server)
          .get(`/api/notes/${noteId}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200);

        expect(response2.body.note[0].content).toBe('UPDATED test note');
    });
  });

  describe('POST /api/notes/:id/share', () => {
    test('should share a note with another user for the authenticated user', async () => {
      // Create a second user to share the note with
      const authRes = await request(server)
        .post('/api/auth/signup')
        .send({
          user: {
            email: 'testuser2@test.com',
            password: 'testpassword2'
          }
      });
      const secondUserId = authRes.body.user.id;

      await request(server)
        .post(`/api/notes/${noteId}/share`)
        .set('Authorization', `Bearer ${token}`)
        .send({ user: { id: secondUserId } })
        .expect(204);
    });
  });

  describe('GET /api/search', () => {
    test('search for notes based on keywords for the authenticated user', async () => {
      const response = await request(server)
        .get(`/api/search?content=note`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.note[0]._id).toBeDefined();
    });
  });

  describe('DELETE /api/notes/:id', () => {
    test('should delete a note by ID for the authenticated user', async () => {
      await request(server)
        .delete(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
    });
  });

});

