const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await mongoose.connection.dropDatabase();
});

describe('GET /health', () => {
  it('returns status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('Todo API', () => {
  it('POST /api/todos creates a todo', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({ title: 'Buy milk' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Buy milk');
    expect(res.body.completed).toBe(false);
  });

  it('GET /api/todos returns all todos', async () => {
    await request(app).post('/api/todos').send({ title: 'First' });
    await request(app).post('/api/todos').send({ title: 'Second' });
    const res = await request(app).get('/api/todos');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it('PATCH /api/todos/:id toggles completion', async () => {
    const { body: created } = await request(app)
      .post('/api/todos')
      .send({ title: 'Toggle me' });
    const res = await request(app)
      .patch(`/api/todos/${created._id}`)
      .send({ completed: true });
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  it('DELETE /api/todos/:id removes the todo', async () => {
    const { body: created } = await request(app)
      .post('/api/todos')
      .send({ title: 'Delete me' });
    await request(app).delete(`/api/todos/${created._id}`);
    const res = await request(app).get('/api/todos');
    expect(res.body.length).toBe(0);
  });

  it('PATCH /api/todos/:id with bad id returns 404', async () => {
    const res = await request(app)
      .patch('/api/todos/000000000000000000000000')
      .send({ completed: true });
    expect(res.status).toBe(404);
  });
});
