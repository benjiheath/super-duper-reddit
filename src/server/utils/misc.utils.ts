import _ from 'lodash';
import { DateTime } from 'luxon';
import { Query } from 'react-query';
import { DbComment, DbPost } from '../database/database.types';
import { LooseObject, SrRequestHandler } from '../types/utils';

export const getTimeAgo = (date: string) => {
  const dateISO = new Date(Date.parse(date)).toISOString();
  const now = DateTime.local();
  const past = DateTime.fromISO(dateISO);

  const rel = past.toRelative({ base: now });
  return rel as string;
};

export const stringifyValue = (value: string) => (typeof value === 'string' ? `'${value}'` : value);

export const stringifyObjValues = <A extends LooseObject>(values: A) =>
  _.mapValues(values, (v) => (typeof v === 'string' ? `'${v}'` : v));

export const parseColumnAndValue = (obj: LooseObject) => {
  const [[column, rawValue]] = Object.entries(obj);
  const value = stringifyValue(rawValue);
  return { column, value };
};

export const mapAsync = async <A, B>(list: B[], callback: (item: B) => Promise<A extends B ? B : A>) => {
  const result = await Promise.all(list.map(callback));

  return result;
};

export const sanitizeKeys = <T extends DbPost | DbComment>(postOrComment: T): T => {
  const camelCased = _.mapKeys(postOrComment, (value, key) => _.camelCase(key));
  return camelCased as unknown as T;
};

export const append = (string1: string) => {
  return { with: (string2: string) => string1.concat(` ${string2}`) };
};

export const asyncWrap =
  <A, B = Query>(fn: SrRequestHandler<A, B>): SrRequestHandler<A, B> =>
  (req, res, next) => {
    //TODO find workaround to using Promise.resolve
    Promise.resolve(fn(req, res, next)).catch(next);
  };
