import { FieldErrorData } from '../../../common/types/forms';

export interface LooseObject {
  [key: string]: any;
}

export type FieldErrorResponse = { message: string; errors: FieldErrorData[] };
