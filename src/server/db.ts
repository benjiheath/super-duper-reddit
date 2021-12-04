import { Pool } from 'pg';

const e = process.env;

export const pool = new Pool({
  user: e.LOCAL_DB_USER,
  password: e.LOCAL_DB_PW as string,
  host: e.LOCAL_DB_HOST,
  port: e.LOCAL_DB_PORT as number | undefined,
  database: e.LOCAL_DB_DB,
});
