import {
  DbTables,
  UserColumn,
  PostsColumn,
  CommentsColumn,
  PostsFavoriteColumn,
  PostsVoteColumn,
  CommentsVoteColumn,
  DbComment,
  DbCommentVote,
  DbPost,
  DbPostFavorite,
  DbPostVote,
  DbUser,
} from '../database/database.types';
import { pool } from '../main';
import { NumericProps } from '../types/utils';
import { append } from './misc.utils';

interface GoOptions {
  returnAllRows?: boolean;
}

export const queryBuilder = <A, B>(table: DbTables) => {
  let query: string = '';
  let returningAllRows: boolean = false;
  // just make util to extract sum/count - call it in the methods that call this function

  const go = async <C = A[]>(options?: GoOptions) => {
    returningAllRows = options?.returnAllRows ?? returningAllRows;

    if (returningAllRows) {
      appendQuery(`RETURNING *`);
    }
    const { rows } = await pool.query<C>(query);
    return rows;
  };

  const appendQuery = (SQL: string) => {
    query = append(query).with(SQL);
  };

  const where = (column: B) => {
    appendQuery(`WHERE ${column}`);
    return { equals };
  };

  const equals = (value: string) => {
    appendQuery(`= '${value}'`);
    return { limit, orderBy, and, or, go };
  };

  const and = (column: B) => {
    appendQuery(`AND ${column}`);
    return { equals };
  };

  const or = (column: B) => {
    appendQuery(`OR ${column}`);
    return { equals };
  };

  const limit = (limit: number) => {
    appendQuery(`LIMIT ${limit}`);
    return { orderBy, go };
  };

  const orderBy = (column: B, direction: 'ASC' | 'DESC' = 'DESC') => {
    appendQuery(`ORDER BY ${column} ${direction}`);
    return { go };
  };

  const onConflict = (columns: B | B[]) => {
    appendQuery(`ON CONFLICT (${columns})`);
    return { doUpdateColumn };
  };

  const doUpdateColumn = (column: B) => {
    appendQuery(`DO UPDATE SET ${column}`);
    return { withValue };
  };

  const withValue = (value: string | number) => {
    appendQuery(`= '${value}'`);
    return { where, go };
  };

  const selectAll = () => {
    query = `SELECT * FROM ${table}`;
    return { where, limit, go };
  };

  const select = (columns: B | B[]) => {
    query = `SELECT ${columns} FROM ${table}`;
    return { where, go };
  };

  const insertRow = (options: Partial<A>) => {
    const columns = Object.keys(options);
    const values = Object.values(options).map((val) => (typeof val === 'number' ? val : `'${val}'`));
    query = `INSERT INTO ${table} (${columns}) VALUES (${values})`;
    returningAllRows = true;
    return { onConflict, go };
  };

  const updateColumn = (column: B) => {
    query = `UPDATE ${table} SET ${column}`;
    returningAllRows = true;
    return { withValue };
  };

  const getSum = (column: NumericProps<A>) => {
    query = `SELECT SUM(${column}) FROM ${table}`;
    return { where, go };
  };

  return { select, selectAll, insertRow, updateColumn, getSum };
};

export const dbUsers = queryBuilder<DbUser, UserColumn>(DbTables.users);
export const dbPosts = queryBuilder<DbPost, PostsColumn>(DbTables.posts);
export const dbComments = queryBuilder<DbComment, CommentsColumn>(DbTables.comments);
export const dbPostsFavorites = queryBuilder<DbPostFavorite, PostsFavoriteColumn>(DbTables.postsFavorites);
export const dbPostsVotes = queryBuilder<DbPostVote, PostsVoteColumn>(DbTables.postsVotes);
export const dbCommentsVotes = queryBuilder<DbCommentVote, CommentsVoteColumn>(DbTables.commentsVotes);
