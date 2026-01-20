import request from 'supertest';
import express from 'express';
import { createServer } from 'http';

// Minimal app setup for testing health check
const app = express();
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

describe('GET /health', () => {
    it('should return 200 OK', async () => {
        const res = await request(app).get('/health');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('ok');
    });
});
