import session, { SessionOptions } from 'express-session';
import { CorsOptions } from 'cors';
import { PoolConfig } from 'pg';
import connectPgSimple, { PGStore } from 'connect-pg-simple';

interface PgConfig {
  conString: string;
  poolConfig: PoolConfig;
}

interface Urls {
  client: string;
}

export class Config {
  private _env: NodeJS.ProcessEnv;
  private _pgStoreType: typeof PGStore;
  private _pgStore: PGStore;

  isProd: boolean;
  port: number;
  poolConfig: PoolConfig;
  urls: Urls;
  corsOptions: CorsOptions;
  sessionOptions: SessionOptions;
  esCookieSecret: string;
  sgApiKey: string | undefined;

  constructor(env: NodeJS.ProcessEnv, createPgStore: typeof connectPgSimple, expressSession: typeof session) {
    this._env = env;
    this.isProd = env.NODE_ENV === 'production';
    this.port = Number(env.PORT) || 3000;

    this.poolConfig = {
      connectionString: this._env.DB_CONSTRING ?? 'postgres://postgres:pass@localhost:5433/srdb',
      ssl: this.isProd && { rejectUnauthorized: false },
    };

    this._pgStoreType = createPgStore(expressSession);
    this._pgStore = new this._pgStoreType({ conString: this.poolConfig.connectionString });

    this.urls = {
      client: this._env.PROD_URL ?? 'http://localhost:3001',
    };

    this.corsOptions = {
      credentials: true,
      origin: this.isProd ? '*' : this.urls.client,
      methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'DELETE', 'PATCH', 'HEAD'],
    };

    this.esCookieSecret = this._env.ES_COOKIE_SECRET ?? 'coccyx';

    this.sessionOptions = {
      store: this._pgStore,
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

    this.sgApiKey = this._env.SG_API_KEY;
  }
}
