import {
  CommentsColumn,
  CommentsColumns,
  DbTables,
  PostsColumn,
  PostsColumns,
  UserColumn,
  UserColumns,
} from '../../common/types/dbTypes';
import { pool } from '../db';
import { ErrorTypes, FieldError, generateErrorType } from './errors';

type updateFieldOverload<T> = {
  (field: T, conditionalValue: string): {
    whereColumnMatchesValue: (column: T, conditionalValue: string) => Promise<void>;
  };
  (field: 'points', conditionalValue: number): {
    whereColumnMatchesValue: (column: T, conditionalValue: number) => Promise<void>;
  };
};

interface DbQueryMethods<T, U> {
  findValue: (columnOfInterest: U) => {
    where: (column: U) => { equals: (value: string) => Promise<string> };
  };
  findValues: (columnsOfInterest: U[]) => {
    where: (column: U) => { equals: (value: string) => Promise<T> };
  };
  insertRow: (options: T) => Promise<void>;
  updateField: updateFieldOverload<U>;
}

type DbQueryOverload = {
  (table: DbTables.users): DbQueryMethods<Partial<UserColumns>, UserColumn>;
  (table: DbTables.posts): DbQueryMethods<Partial<PostsColumns>, PostsColumn>;
  (table: DbTables.comments): DbQueryMethods<Partial<CommentsColumns>, CommentsColumn>;
};

export const dbQuery: DbQueryOverload = (table: DbTables) => {
  return {
    findValue: (columnOfInterest) => {
      return {
        where: (column) => {
          return {
            equals: async (value) => {
              try {
                const {
                  rows: [{ [columnOfInterest]: result }],
                } = await pool.query(`SELECT ${columnOfInterest} FROM ${table} WHERE ${column} = $1`, [
                  value,
                ]);

                return result;
              } catch (err) {
                const message = ErrorTypes.AccountNotFound;
                throw new FieldError({
                  message,
                  errors: [{ field: columnOfInterest, message }],
                });
              }
            },
          };
        },
      };
    },
    findValues: (columnsOfInterest) => {
      return {
        where: (column) => {
          return {
            equals: async (value) => {
              try {
                const res = await pool.query(
                  `SELECT ${columnsOfInterest} FROM ${table} WHERE ${column} = $1`,
                  [value]
                );

                if (res.rowCount === 0) {
                  const message = generateErrorType(column);
                  throw new FieldError({
                    message,
                    errors: columnsOfInterest.map((column) => {
                      return { field: column, message };
                    }),
                  });
                }

                const [rows] = res.rows;
                return rows;
              } catch (err) {
                throw err;
              }
            },
          };
        },
      };
    },
    insertRow: async (columns) => {
      try {
        const parsedColumns = Object.keys(columns);
        const values = Object.values(columns);
        const valueIDs = Object.values(columns).map((_, i) => `$${i + 1}`);

        await pool.query(`INSERT INTO ${table} (${parsedColumns}) VALUES (${valueIDs})`, values);
      } catch (err: any) {
        const field = err.detail.substring(5, err.detail.indexOf(')'));
        const message = `Sorry, that ${field} is already taken`;

        console.error('DB insertion error:', err);
        throw new FieldError({
          message,
          errors: [{ field, message }],
        });
      }
    },
    updateField: (field, value) => {
      return {
        whereColumnMatchesValue: async (column, conditionalValue) => {
          await pool.query(`UPDATE ${table} SET ${field} = $1 WHERE ${column} = $2`, [
            value,
            conditionalValue,
          ]);
        },
      };
    },
  };
};

export const dbUsers = dbQuery(DbTables.users);
export const dbPosts = dbQuery(DbTables.posts);
export const dbComments = dbQuery(DbTables.comments);
