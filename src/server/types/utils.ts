import { RequestHandler } from 'express';
import { Query } from 'pg';

export interface LooseObject {
  [key: string]: any;
}

export type NumericProps<A> = {
  [K in keyof A]: A[K] extends number ? K : never;
}[keyof A];

export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];

export type SrRequestHandler<A, B = Query> = RequestHandler<LooseObject, {}, A, B>;

export type SrRequestHandlerWithQuery<A, B = any> = RequestHandler<LooseObject, {}, A, B>;

export interface RequestWithBody<A> extends Omit<Request, 'body'> {
  session: { userID: string; username: string };
  body: A;
}
