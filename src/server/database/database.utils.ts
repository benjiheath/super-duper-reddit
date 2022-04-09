import { LooseObject } from '../../common/types';

export const stringifyValue = (value: string) => {
  return typeof value === 'string' ? `'${value}'` : value;
};

export const parseColumnAndValue = (obj: LooseObject) => {
  const [[column, rawValue]] = Object.entries(obj);
  const value = stringifyValue(rawValue);
  return { column, value };
};
