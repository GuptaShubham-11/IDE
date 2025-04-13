import dotenv from 'dotenv';
dotenv.config({ path: './.env.local' });

import connectDB from './db/db';
import { app } from './app';

connectDB()
  .then(() => {
    app.on('error', (error: any) => {
      console.error('❌ UNEXPECTED ERROR:', error.message);
      process.exit(1);
    });

    const port = process.env.PORT || 8000;
    app.listen(port, () => {
      console.log(`🚀 Server running on port: ${port}`);
    });
  })
  .catch((error) => {
    console.error(`❌ MongoDB connection error:`, error);
    process.exit(1);
  });
