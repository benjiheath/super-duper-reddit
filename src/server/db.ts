import { Pool } from 'pg';
import { config } from './config';

const { user, pw, host, port, database } = config.pg;

export const pool = new Pool({
  user: user,
  password: pw,
  host: host,
  port: port,
  database: database,
});
