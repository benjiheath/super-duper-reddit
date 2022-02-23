import { FieldErrorData } from '../../common/types';

export interface LooseObject {
  [key: string]: any;
}

export type NumericProps<A> = {
  [K in keyof A]: A[K] extends number ? K : never;
}[keyof A];
