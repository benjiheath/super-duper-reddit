export const config = {
  pg: {
    user: process.env.DB_USER || 'postgres',
    password: (process.env.DB_PASSWORD as string) || 'pass',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5433,
    database: process.env.DB_DATABASE || 'srdb',
    conString: process.env.DB_CONSTRING || 'postgres://postgres:pass@localhost:5433/srdb',
  },
  urls: {
    client: process.env.NODE_ENV === 'production' ? process.env.PROD_URL : 'http://localhost:3001',
  },
  esCookieSecret: (process.env.ES_COOKIE_SECRET as string) || 'blah',
  sgApiKey: process.env.SG_API_KEY,
};
