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
  findValue: (columnOfInterest: U, conditionColumn: U, conditionValue: string) => Promise<string>;
  findValues: (columnsOfInterest: U[], conditionColumn: U, conditionValue: string) => any;
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
    findValue: async (columnOfInterest, conditionColumn, conditionValue) => {
      try {
        const {
          rows: [{ [columnOfInterest]: result }],
        } = await pool.query(`SELECT ${columnOfInterest} FROM ${table} WHERE ${conditionColumn} = $1`, [
          conditionValue,
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
    findValues: async (columnsOfInterest, conditionColumn, conditionValue) => {
      try {
        const res = await pool.query(
          `SELECT ${columnsOfInterest} FROM ${table} WHERE ${conditionColumn} = $1`,
          [conditionValue]
        );

        if (res.rowCount === 0) {
          const message = generateErrorType(conditionColumn);
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
