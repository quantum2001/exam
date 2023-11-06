import mongoose from 'mongoose';
import logger from './logger.util';

export async function connectsDB() {
  const dbURI = process.env.MONGO_URI || '';
  try {
    await mongoose.connect(dbURI);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('Error connecting to MongoDB: ', error);
    throw new Error('Error connecting to MongoDB');
  }
}
