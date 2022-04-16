import session, { SessionOptions } from 'express-session';
import { CorsOptions } from 'cors';
import { PoolConfig } from 'pg';

const PostgreSqlStore = require('connect-pg-simple')(session);

interface PgConfig {
  conString: string;
  poolConfig: PoolConfig;
}

interface Urls {
  client: string;
}

export class Config {
  private env: NodeJS.ProcessEnv;
  isProd: boolean;
  port: number;
  pg: PgConfig;
  urls: Urls;
  corsOptions: CorsOptions;
  sessionOptions: SessionOptions;
  esCookieSecret: string;
  sgApiKey: string | undefined;

  constructor(env: NodeJS.ProcessEnv) {
    this.env = env;
    this.isProd = env.NODE_ENV === 'production';
    this.port = Number(env.PORT) || 3000;

    this.pg = {
      conString: this.env.DB_CONSTRING ?? 'postgres://postgres:pass@localhost:5433/srdb',
      poolConfig: {
        user: this.env.DB_USER ?? 'postgres',
        password: (this.env.DB_PASSWORD as string) ?? 'pass',
        host: this.env.DB_HOST ?? 'localhost',
        // port: 5433,
        port: Number(this.env.DB_PORT) || 5433,
        database: this.env.DB_DATABASE ?? 'srdb',
        ssl: this.isProd && { rejectUnauthorized: false },
      },
    };

    this.urls = {
      client: this.env.PROD_URL ?? 'http://localhost:3001',
    };

    this.corsOptions = {
      credentials: true,
      origin: this.isProd ? '*' : this.urls.client,
      methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'DELETE', 'PATCH', 'HEAD'],
    };

    this.esCookieSecret = this.env.ES_COOKIE_SECRET ?? 'coccyx';

    this.sessionOptions = {
      store: new PostgreSqlStore({
        conString: this.pg.conString,
      }),
      secret: this.esCookieSecret,
      resave: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        path: '/',
        secure: this.isProd,
        sameSite: this.isProd ? 'none' : 'lax',
      }, // 1 day
      saveUninitialized: false,
      proxy: this.isProd ? true : undefined,
    };

    this.sgApiKey = this.env.SG_API_KEY;
  }
}
