import mongoose from 'mongoose';
import { config } from '../config/config';

export const dbConnect = (): Promise<void> =>
  mongoose
    .connect(config.dbUri)
    .then(() => {
      console.log('Connected to the database');
    })
    .catch((error) => {
      console.error('Database connection error:', error);
    });
