import { handlePostRemovedStatus } from './misc';
import {
  CommentsColumn,
  DbComment,
  DbPost,
  DbTables,
  DbUser,
  PostsColumn,
  UserColumn,
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
  selectAll: (options?: {
    whereConditions?: string | string[];
    limit?: number;
    orderBy?: U;
    direction?: 'ASC' | 'DESC';
  }) => Promise<T[]>;
  findValue: (columnOfInterest: U) => {
    where: (column: U) => { equals: (value: string) => Promise<Partial<T>> };
  };
  findValues: (columnsOfInterest: U[]) => {
    where: (column: U) => { equals: (value: string) => Promise<Partial<T>> };
  };
  insertRow: (options: Partial<T>) => Promise<T[]>;
  updateField: updateFieldOverload<U>;
}

type DbQueryOverload = {
  (table: DbTables.users): DbQueryMethods<DbUser, UserColumn>;
  (table: DbTables.posts): DbQueryMethods<DbPost, PostsColumn>;
  (table: DbTables.comments): DbQueryMethods<DbComment, CommentsColumn>;
};

export const dbQuery: DbQueryOverload = (table: DbTables) => {
  return {
    selectAll: async (options) => {
      const whereConditions = options?.whereConditions ? `WHERE ${options.whereConditions}` : '';
      const limitClause = options?.limit ? `LIMIT ${options.limit}` : '';
      const orderByClause = options?.orderBy ? `ORDER BY ${options.orderBy}` : '';
      const sortDirection = options?.direction ? `${options.direction}` : 'DESC';

      const { rows } = await pool.query(
        `SELECT * FROM ${table} ${whereConditions} ${limitClause} ${orderByClause} ${sortDirection}`
      );

      // if current_status = removed, overwrite obj 'body' value
      const removedStatusHandled = handlePostRemovedStatus(rows);

      // if no items has current_status = removed, simply return rows
      if (!removedStatusHandled) {
        return rows;
      }

      return removedStatusHandled;
    },
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

        const { rows } = await pool.query(
          `INSERT INTO ${table} (${parsedColumns}) VALUES (${valueIDs}) RETURNING *`,
          values
        );
        return rows;
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
