import 'express-async-errors'; // Must be first
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { initSocket } from './socket';
import leadRoutes from './routes/leads';
import clientRoutes from './routes/clients';
import userRoutes from './routes/users';
import settingsRoutes from './routes/settings';
import logsRoutes from './routes/logs';
import webhookRoutes from './routes/webhooks';
import dashboardRoutes from './routes/dashboard';
import authRoutes from './routes/auth';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter, authLimiter } from './middleware/rateLimiter';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = initSocket(httpServer);
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Apply Global Rate Limiter to all API routes
app.use('/api', apiLimiter);

// Routes
app.use('/api/leads', leadRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Stricter limiter for Auth
app.use('/api/auth', authLimiter, authRoutes);

// Error Handler (Must be last)
app.use(errorHandler);

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Use httpServer.listen instead of app.listen
httpServer.listen(PORT, () => {
    console.log(`NHFG CRM API Server running on port ${PORT}`);
});
