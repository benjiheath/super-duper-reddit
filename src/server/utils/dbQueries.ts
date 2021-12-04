import { DbTables, PostsColumn, PostsColumns, UserColumn, UserColumns } from '../../common/types/dbTypes';
import { pool } from '../db';
import { ErrorTypes, FieldError } from './errors';

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
  insertRow: (options: T) => Promise<void>;
  updateField: updateFieldOverload<U>;
}

type DbQueryOverload = {
  (table: DbTables.users): DbQueryMethods<Partial<UserColumns>, UserColumn>;
  (table: DbTables.posts): DbQueryMethods<Partial<PostsColumns>, PostsColumn>;
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
        throw new FieldError({ message, errors: [{ field: columnOfInterest, message }] });
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
        const value = err.detail.substring(err.detail.lastIndexOf('(') + 1, err.detail.lastIndexOf(')'));
        const message = `The ${field} '${value}' is already taken`;

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
