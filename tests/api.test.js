import request from 'supertest';
import app from '../app.js';

describe('API', () => {
  it('GET / returns welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('Welcome to the Subscription Tracker API');
  });

  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET /api returns version info', async () => {
    const res = await request(app).get('/api');
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('subdub API');
  });
});
