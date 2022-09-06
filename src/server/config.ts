import { CorsOptions } from 'cors';
import { config as dotenvConfig } from 'dotenv';
import session, { SessionOptions } from 'express-session';
import { PoolConfig } from 'pg';

dotenvConfig();
const PostgreSqlStore = require('connect-pg-simple')(session);

export interface Config {
  isProd: boolean;
  port: number;
  poolConfig: PoolConfig;
  urls: { client: string; api: string };
  corsOptions: CorsOptions;
  sessionOptions: SessionOptions;
  sendgridApiKey?: string;
}

export const getEnv = (value: string) => {
  const envValue = process.env[value];

  if (!envValue) {
    throw new Error(`Value "${value}" not found in environment variables`);
  } else {
    return envValue;
  }
};

export const getConfig = (): Config => {
  const isProd = getEnv('NODE_ENV') === 'production';
  const urls = { api: getEnv('API_URL'), client: getEnv('CLIENT_URL') };
  const port = Number(getEnv('PORT'));
  const sendgridApiKey = getEnv('SENDGRID_API_KEY');

  const poolConfig: PoolConfig = {
    connectionString: getEnv('DB_CONSTRING'),
    ssl: isProd ? { rejectUnauthorized: false } : undefined,
  };

  const corsOptions: CorsOptions = {
    credentials: true,
    origin: urls.client,
  };

  const sessionOptions: SessionOptions = {
    store: new PostgreSqlStore({ conString: poolConfig.connectionString }),
    secret: getEnv('SESSION_COOKIE_SECRET'),
    resave: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
    }, // 1 day
    saveUninitialized: false,
    proxy: isProd ? true : undefined,
  };

  return {
    isProd,
    urls,
    port,
    poolConfig,
    corsOptions,
    sessionOptions,
    sendgridApiKey,
  };
};
