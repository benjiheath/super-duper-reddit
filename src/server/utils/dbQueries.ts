import { pool } from '../db';
import { DbTableInsertOptions, Table, UserColumn } from '../types/dbTypes';
import { ErrorTypes, FieldError } from './errors';

export const getValueFromDB = async <T>(
  table: Table,
  valueOfInterest: string,
  TypeOfvalueToBeChecked: string | number,
  valueToBeChecked: string
): Promise<string | number> => {
  const { rows: match } = await pool.query(
    `SELECT ${valueOfInterest} FROM ${table} WHERE ${TypeOfvalueToBeChecked} = $1`,
    [valueToBeChecked]
  );
  const [{ [valueOfInterest]: result }] = match;

  return result;
};

export const findUserValue = async (
  columnOfInterest: UserColumn,
  conditionColumn: UserColumn,
  conditionValue: string
): Promise<string | void> => {
  try {
    const {
      rows: [{ [columnOfInterest]: result }],
    } = await pool.query(`SELECT ${columnOfInterest} FROM users WHERE ${conditionColumn} = $1`, [
      conditionValue,
    ]);

    return result;
  } catch (err) {
    const message = ErrorTypes.AccountNotFound;
    throw new FieldError({ message, errors: [{ field: columnOfInterest, message }] });
  }
};

export const insertRow = async (options: DbTableInsertOptions) => {
  try {
    const columns = Object.keys(options.columns);
    const values = Object.values(options.columns);
    const valueIDs = Object.values(options.columns).map((_, i) => `$${i + 1}`);

    await pool.query(`INSERT INTO ${options.table} (${columns}) VALUES (${valueIDs})`, values);
  } catch (err: any) {
    const field = err.detail.substring(5, err.detail.indexOf(')'));
    const value = err.detail.substring(err.detail.lastIndexOf('(') + 1, err.detail.lastIndexOf(')'));
    const message = `The ${field} '${value}' is already taken`;

    throw new FieldError({ message, errors: [{ field, message }] });
  }
};
