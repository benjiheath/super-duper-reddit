import _ from 'lodash';
import { DateTime } from 'luxon';
import { DatabaseError } from 'pg';
import { CommentsColumn, DbComment, DbPost, PostsColumn, UserColumn } from '../types/dbTypes';

export const getTimeAgo = (date: string) => {
  const dateISO = new Date(Date.parse(date)).toISOString();
  const now = DateTime.local();
  const past = DateTime.fromISO(dateISO);

  const rel = past.toRelative({ base: now });
  return rel as string;
};

export const createSQLWhereConditionsFromList = <T>(
  list: T[],
  valueA: PostsColumn | CommentsColumn | UserColumn,
  valueB: keyof T,
  operator: 'OR' | 'AND' = 'OR'
) => {
  const operatorWithSpace = `${operator} `;

  const conditions = list
    .map((item, idx) => `${idx !== 0 ? operatorWithSpace : ''}${valueA} = '${item[valueB]}'`)
    .join(' ');

  return conditions;
};

export const asyncMap = async <T, U>(list: T[], callback: (item: T) => Promise<T>) => {
  const result = await Promise.all(list.map(callback));

  return result;
};

export const sanitizeKeys = <T extends DbPost | DbComment>(postOrComment: T): T => {
  const camelCased = _.mapKeys(postOrComment, (value, key) => _.camelCase(key));
  return camelCased as unknown as T;
};

export const getFieldErrorInfoFromDbError = (err: DatabaseError) => {
  if (!err.detail) {
    throw new Error(`Error parsing info from DbError. The 'detail' property does not exist on the object`);
  }
  const field = err.detail.substring(5, err.detail.indexOf(')'));
  const message = `Sorry, that ${field} is already taken`;

  return { field, message };
};

export const append = (string1: string) => {
  return { with: (string2: string) => string1.concat(` ${string2}`) };
};

export const getFirstElement = <A>(list: A[]) => list[0];
