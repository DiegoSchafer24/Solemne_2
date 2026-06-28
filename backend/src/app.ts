import cors from 'cors';
import express from 'express';
import { errorHandler } from './middlewares/error.middleware.js';
import { notFoundHandler } from './middlewares/not-found.middleware.js';
import authRoutes from './routes/auth.routes.js';
import healthRoutes from './routes/health.routes.js';
import onlineMatchRoutes from './routes/online-match.routes.js';
import onlineRoomRoutes from './routes/online-room.routes.js';
import settingsRoutes from './routes/settings.routes.js';

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL ?? 'http://localhost:5173'
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/matches/online', onlineMatchRoutes);
app.use('/api/rooms/online', onlineRoomRoutes);
app.use('/api/settings', settingsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
