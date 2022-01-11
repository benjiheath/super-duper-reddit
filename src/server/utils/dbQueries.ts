import { CommentsVoteColumn, DbPostFavorite, PostsFavoriteColumn } from './../types/dbTypes';
import { UserType, PostVoteType, PostFavoriteType } from './../../common/types/entities';
import { handlePostRemovedStatus, sanitizeKeys } from './misc';
import { pool } from '../db';
import { ErrorTypes, FieldError, generateErrorType } from './errors';
import { CommentType, PostType } from '../../common/types/entities';
import {
  CommentsColumn,
  DbComment,
  DbCommentVote,
  DbPost,
  DbPostVote,
  DbTables,
  DbUser,
  PostsColumn,
  PostsVoteColumn,
  UserColumn,
} from '../types/dbTypes';

type updateFieldOverload<T, U> = {
  (field: T, conditionalValue: string): {
    whereColumnMatchesValue: (column: T, conditionalValue: string) => Promise<U>;
  };
};

interface DbQueryMethods<T, U, V> {
  selectAll: (options?: {
    whereConditions?: string | string[];
    limit?: number;
    orderBy?: U;
    direction?: 'ASC' | 'DESC';
    sanitize?: boolean;
  }) => Promise<V[]>;
  findValue: (columnOfInterest: U) => {
    where: (column: U) => { equals: (value: string) => Promise<Partial<T>> };
  };
  findValues: (columnsOfInterest: U[]) => {
    where: (column: U) => { equals: (value: string) => Promise<Partial<T>> };
  };
  insertRow: (options: Partial<T>, appendQuery?: string) => Promise<V[]>;
  updateField: updateFieldOverload<U, V>;
  getSum: (column: U) => {
    where: (column: U) => { equals: (value: string) => Promise<number> };
  };
}

type DbQueryOverload = {
  (table: DbTables.users): DbQueryMethods<DbUser, UserColumn, UserType>;
  (table: DbTables.posts): DbQueryMethods<DbPost, PostsColumn, PostType>;
  (table: DbTables.comments): DbQueryMethods<DbComment, CommentsColumn, CommentType>;
  (table: DbTables.postsFavorites): DbQueryMethods<DbPostFavorite, PostsFavoriteColumn, PostFavoriteType>;
  (table: DbTables.postsVotes): DbQueryMethods<DbPostVote, PostsVoteColumn, PostVoteType>;
  (table: DbTables.commentsVotes): DbQueryMethods<DbCommentVote, CommentsVoteColumn, any>;
};

export const dbQuery: DbQueryOverload = (table: DbTables) => {
  return {
    selectAll: async (options) => {
      try {
        const whereConditions = options?.whereConditions ? `WHERE ${options.whereConditions}` : '';
        const limitClause = options?.limit ? `LIMIT ${options.limit}` : '';
        const sortDirection = options?.direction ? `${options.direction}` : 'DESC';
        const orderByClause = options?.orderBy ? `ORDER BY ${options.orderBy} ${sortDirection}` : '';

        const { rows } = await pool.query(
          `SELECT * FROM ${table} ${whereConditions} ${limitClause} ${orderByClause}`
        );

        // camelCase keys for client
        const sanitizedRows = rows.map((row) => sanitizeKeys(row));

        // if current_status = removed, overwrite obj 'body' value
        const removedStatusHandled = handlePostRemovedStatus(sanitizedRows);

        return removedStatusHandled;
      } catch (err) {
        throw err;
      }
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
    insertRow: async (columns, appendQuery) => {
      try {
        const parsedColumns = Object.keys(columns);
        const values = Object.values(columns);
        const valueIDs = Object.values(columns).map((_, i) => `$${i + 1}`);

        const { rows } = await pool.query(
          `INSERT INTO ${table} (${parsedColumns}) VALUES (${valueIDs}) ${appendQuery ?? ''} RETURNING *`,
          values
        );
        const sanitizedRows = rows.map((row) => sanitizeKeys(row));

        return sanitizedRows;
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
          const { rows } = await pool.query(
            `UPDATE ${table} SET ${field} = $1 WHERE ${column} = $2 RETURNING *`,
            [value, conditionalValue]
          );

          const [sanitizedRows] = rows.map((row) => sanitizeKeys(row));

          return sanitizedRows;
        },
      };
    },
    getSum: (columnToBeSummed) => {
      return {
        where: (column) => {
          return {
            equals: async (value) => {
              try {
                const { rows } = await pool.query(
                  `SELECT SUM(${columnToBeSummed}) FROM ${table} WHERE ${column} = $1`,
                  [value]
                );
                // TODO - add where conditions
                return Number(rows[0].sum);
              } catch (err) {
                throw err;
              }
            },
          };
        },
      };
    },
  };
};

export const dbUsers = dbQuery(DbTables.users);
export const dbPosts = dbQuery(DbTables.posts);
export const dbComments = dbQuery(DbTables.comments);
export const dbPostsFavorites = dbQuery(DbTables.postsFavorites);
export const dbPostsVotes = dbQuery(DbTables.postsVotes);
export const dbCommentsVotes = dbQuery(DbTables.commentsVotes);
