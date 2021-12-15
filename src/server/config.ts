export const config = {
  pg: {
    user: process.env.DB_USER || 'postgres',
    pw: (process.env.DB_PW as string) || 'pgdocker',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5433,
    database: process.env.DB_NAME || 'srdb',
    conString: process.env.DB_CONSTRING || 'postgres://postgres:pgdocker@localhost:5433/srdb',
  },
  urls: {
    client: {
      dev: 'http://localhost:3001',
      prod: 'http://localhost:3000',
    },
    server: 'http://localhost:3000',
  },
  esCookieSecret: (process.env.ES_COOKIE_SECRET as string) || 'blah',
  sgApiKey: process.env.SG_API_KEY,
};
