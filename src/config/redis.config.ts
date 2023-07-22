import Redis from 'ioredis';

// Connection URL
const url: string = process.env.REDIS_URL;

// Connect to Redis
const redis = new Redis(url);

export default redis;
