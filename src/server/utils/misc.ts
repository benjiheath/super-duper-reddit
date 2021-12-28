import { PostsColumn, CommentsColumn, UserColumn } from './../../common/types/dbTypes';
export const createWhereConditionsFromList = <T>(
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
