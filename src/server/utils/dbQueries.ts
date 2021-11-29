import { DbTables, PostsColumn, PostsColumns, UserColumn, UserColumns } from '../../common/types/dbTypes';
import { pool } from '../db';
import { ErrorTypes, FieldError } from './errors';

// export class DbQuery {
//   table: DbTables;

//   constructor(table: DbTables) {
//     this.table = table;
//     return this;
//   }

//   async getOneValue<T>(
//     valueOfInterest: string,
//     TypeOfvalueToBeChecked: string | number,
//     valueToBeChecked: string
//   ): Promise<string | number> {
//     const { rows: match } = await pool.query(
//       `SELECT ${valueOfInterest} FROM ${this.table} WHERE ${TypeOfvalueToBeChecked} = $1`,
//       [valueToBeChecked]
//     );
//     const [{ [valueOfInterest]: result }] = match;

//     return result;
//   }

//   async findUserValue(
//     columnOfInterest: UserColumn,
//     conditionColumn: UserColumn,
//     conditionValue: string
//   ): Promise<string | void> {
//     try {
//       const {
//         rows: [{ [columnOfInterest]: result }],
//       } = await pool.query(`SELECT ${columnOfInterest} FROM users WHERE ${conditionColumn} = $1`, [
//         conditionValue,
//       ]);

//       return result;
//     } catch (err) {
//       const message = ErrorTypes.AccountNotFound;
//       throw new FieldError({ message, errors: [{ field: columnOfInterest, message }] });
//     }
//   }

//   async insertRow(options: DbTableInsertOptions) {
//     try {
//       const columns = Object.keys(options.columns);
//       const values = Object.values(options.columns);
//       const valueIDs = Object.values(options.columns).map((_, i) => `$${i + 1}`);

//       await pool.query(`INSERT INTO ${this.table} (${columns}) VALUES (${valueIDs})`, values);
//     } catch (err: any) {
//       const field = err.detail.substring(5, err.detail.indexOf(')'));
//       const value = err.detail.substring(err.detail.lastIndexOf('(') + 1, err.detail.lastIndexOf(')'));
//       const message = `The ${field} '${value}' is already taken`;

//       console.error('DB insertion error:', err);
//       throw new FieldError({ message, errors: [{ field, message }] });
//     }
//   }
// }

interface DbQueryMethods<T, U> {
  findValue: (columnOfInterest: U, conditionColumn: U, conditionValue: string) => Promise<string | void>;
  insertRow: (options: T) => Promise<void>;
}

type DbQueryOverload = {
  (table: DbTables.users): DbQueryMethods<Partial<UserColumns>, UserColumn>;
  (table: DbTables.posts): DbQueryMethods<Partial<PostsColumns>, PostsColumn>;
};

export const dbQuery: DbQueryOverload = (table: DbTables) => {
  return {
    findValue: async (columnOfInterest, conditionColumn, conditionValue: string): Promise<string | void> => {
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
        throw new FieldError({ message, errors: [{ field, message }] });
      }
    },
  };
};
