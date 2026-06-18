import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/db.js';

const port = Number(process.env.PORT ?? 3001);

async function bootstrap() {
  try {
    await connectDatabase();
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed');
    console.error(error);
  }

  app.listen(port, () => {
    console.log(`Shooter backend running on port ${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start shooter backend');
  console.error(error);
  process.exit(1);
});
