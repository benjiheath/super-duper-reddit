import { FieldErrorData } from '../../common/types';

export interface LooseObject {
  [key: string]: any;
}

export type FieldErrorResponse = { message: string; errors: FieldErrorData[] };
