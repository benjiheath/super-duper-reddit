import { Pool } from 'pg';
import { config } from './config';

const { user, password, host, port, database } = config.pg;

export const pool = new Pool({
  user,
  password,
  host,
  port,
  database,
});
