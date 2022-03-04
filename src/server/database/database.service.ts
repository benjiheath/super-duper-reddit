import { LooseObject } from './../types/misc';
import { UserColumn } from './../types/dbTypes';
import { Pool, QueryResult } from 'pg';
import { DbUser } from '../types/dbTypes';
import { CreateDbUserDto, EditDbUserDto } from './database.types';
import { pool } from './db';
import _ from 'lodash';

export class DatabaseService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  private getFirst<A>(res: QueryResult<A>) {
    return res.rows[0];
  }

  private withConn<A>(f: (conn: Pool) => Promise<A>): Promise<A> {
    return f(this.pool).catch((e) => {
      console.log({ e });

      throw new Error(e);
    });
  }

  private stringifyStrings<A extends LooseObject>(values: A) {
    return _.mapValues(values, (v) => (typeof v === 'string' ? `'${v}'` : v));
  }

  createUser(dto: CreateDbUserDto): Promise<DbUser> {
    const values = this.stringifyStrings(dto);
    return this.withConn(async (conn) =>
      this.getFirst(
        await conn.query<DbUser>(
          `INSERT INTO "users" 
              ("username", "password", "email")
           VALUES 
              (${values.username}, ${values.password}, ${values.email})
           RETURNING *`
        )
      )
    );
  }

  getUser(usernameOrId: string): Promise<DbUser> {
    return this.withConn(async (conn) =>
      this.getFirst(
        await conn.query<DbUser>(
          `SELECT * 
           FROM "users"
           WHERE "username" = ${usernameOrId}
           OR "id" = ${usernameOrId}`
        )
      )
    );
  }

  getUserValue(usernameOrId: string, value: UserColumn): Promise<Partial<DbUser>> {
    return this.withConn(async (conn) =>
      this.getFirst(
        await conn.query<Partial<DbUser>>(
          `SELECT ${value} 
           FROM "users"
           WHERE "username" = ${usernameOrId}
           OR "id" = ${usernameOrId}`
        )
      )
    );
  }

  updateUser(userId: string, dto: EditDbUserDto): Promise<DbUser> {
    return this.withConn(async (conn) =>
      this.getFirst(
        await conn.query<DbUser>(
          `UPDATE "users"
           SET 
              username = ${dto.username}, 
              password = ${dto.password}, 
              email = ${dto.email},
              reset_pw_token = ${dto.reset_pw_token}
           WHERE "id" = ${userId}
           RETURNING * `
        )
      )
    );
  }

  addResetPasswordToken(userId: string, token: string): Promise<DbUser> {
    return this.withConn(async (conn) =>
      this.getFirst(
        await conn.query<DbUser>(
          `UPDATE "users"
           SET "reset_pw_token" = ${token}
           WHERE "id" = ${userId}
           RETURNING * `
        )
      )
    );
  }
}

export const databaseService = new DatabaseService(pool);
