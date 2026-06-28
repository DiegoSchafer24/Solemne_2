import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/db.js';
import { createGameServer } from './online/colyseus.js';

const port = Number(process.env.PORT ?? 3001);
const onlinePort = Number(process.env.ONLINE_PORT ?? 3002);

async function bootstrap() {
  try {
    await connectDatabase();
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed');
    console.error(error);
  }

  const gameServer = createGameServer();

  app.listen(port, () => {
    console.log(`Shooter backend running on port ${port}`);
  });

  await gameServer.listen(onlinePort);
  console.log(`Colyseus online rooms running on port ${onlinePort}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start shooter backend');
  console.error(error);
  process.exit(1);
});
