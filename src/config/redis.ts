import { createClient } from 'redis';
import Logger from './logger';

const logger = Logger.logger;

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (error) => {
  logger.error(`Redis Client Error: ${error}`);
});

redisClient.connect()
  .then(() => logger.info('Connected to Redis'))
  .catch((error) => logger.error(`Failed to connect to Redis: ${error}`));

export default redisClient;