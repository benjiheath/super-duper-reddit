import _ from 'lodash';
import { RequestHandler } from 'express';
import { DateTime } from 'luxon';
import { DbComment, DbPost } from '../database/database.types';
import { LooseObject } from '../types/utils';

export const getTimeAgo = (date: string) => {
  const dateISO = new Date(Date.parse(date)).toISOString();
  const now = DateTime.local();
  const past = DateTime.fromISO(dateISO);

  const rel = past.toRelative({ base: now });
  return rel as string;
};

export const stringifyValue = (value: string) => (typeof value === 'string' ? `'${value}'` : value);

export const parseDtoValues = <A extends LooseObject>(values: A) =>
  _.mapValues(values, (v) => {
    switch (typeof v) {
      case 'string':
        return `'${v}'`;
      case 'undefined':
        return null;
      default:
        return v;
    }
  });

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

/**
 allows request handlers to automatically forward errors to the error-handling middleware
 */
export const wrapHandler = <A extends Function>(handler: A): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};

export const getWrappedHandlers = <A>(handlers: { [K in keyof A]: Function }) => {
  const wrappedHandlers = _.mapValues(handlers, (handler) => wrapHandler(handler));
  return wrappedHandlers as Record<keyof typeof handlers, RequestHandler>;
};
