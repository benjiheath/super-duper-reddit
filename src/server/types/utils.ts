import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { Session, SessionData } from 'express-session';

export interface LooseObject {
  [key: string]: any;
}

export type NumericProps<A> = {
  [K in keyof A]: A[K] extends number ? K : never;
}[keyof A];

export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];

export type SrSession = Session & Partial<SessionData>;

/**
 * Request Handling
 */

export type WithSessionData<A> = A & { session: SessionData };

export type RequestWithoutArgs = WithSessionData<ExpressRequest>;
export type RequestWithBody<A> = WithSessionData<ExpressRequest<never, never, A>>;
export type RequestWithParams<A> = WithSessionData<ExpressRequest<A>>;
export type RequestWithQuery<A> = WithSessionData<ExpressRequest<never, never, never, A>>;
export type RequestMixed<A = unknown, B = unknown, C = unknown, Res = unknown> = WithSessionData<
  ExpressRequest<A, Res, C, B>
>;
export type AnyRequest<A = unknown> =
  | RequestWithoutArgs
  | RequestWithBody<A>
  | RequestWithParams<A>
  | RequestWithQuery<A>
  | RequestMixed;

type SrResponse<A> = Response<A>;

type SrReqHandler<A, B> = (req: A, res: SrResponse<B>, next: NextFunction) => void;

export namespace Handler {
  export type NoArgs<A = unknown> = SrReqHandler<RequestWithoutArgs, A>;
  export type WithBody<A, B = unknown> = SrReqHandler<RequestWithBody<A>, B>;
  export type WithParams<A, B = unknown> = SrReqHandler<RequestWithParams<A>, B>;
  export type WithQuery<A, B = unknown> = SrReqHandler<RequestWithQuery<A>, B>;
  export type Mixed<A, B, C, D = unknown> = SrReqHandler<RequestMixed<A, B, C, D>, B>;
}
