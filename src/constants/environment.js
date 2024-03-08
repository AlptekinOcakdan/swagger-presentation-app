import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export const NODE_ENV = process.env.NODE_ENV;
export const PORT = process.env.PORT;
export const MONGO_URI = process.env.MONGO_URI;
export const API_URL = process.env.API_URL;
export const API_PREFIX = process.env.API_PREFIX;
export const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
export const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
export const AWS_REGION = process.env.AWS_REGION;
export const PRODUCTION_SERVER_URL = process.env.PRODUCTION_SERVER_URL;
export const DEVELOPMENT_SERVER_URL = process.env.DEVELOPMENT_SERVER_URL;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const RESET_TOKEN_SECRET = process.env.RESET_TOKEN_SECRET;
