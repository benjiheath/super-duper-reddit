import _ from 'lodash';
import { stringifyObjValues as stringifyDtoValues } from '../utils/misc.utils';
import { parseColumnAndValue } from './database.utils';
import { Pool, QueryResult } from 'pg';
import {
  AddCommentToPostRequest,
  UpdateCommentVotesDto,
  IdentifierCheckResult,
  UpdatePostVotesDto,
  CheckIdentifierDto,
  CreatePostRequest,
  CreateDbUserDto,
  EditPostRequest,
  EditDbUserDto,
  GetPostDto,
  GetUserDto,
  UserColumn,
  DbComment,
  DbPost,
  DbUser,
} from './database.types';

export class DatabaseService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  private getFirst<A>(res: QueryResult<A>) {
    return res.rows[0];
  }

  private parseRows<A>(res: QueryResult<A>) {
    return res.rows;
  }

  private withConn<A>(f: (conn: Pool) => Promise<A>): Promise<A> {
    return f(this.pool).catch((e) => {
      throw e;
    });
  }

  checkInsertion(dto: CreateDbUserDto): Promise<DbUser> {
    const { username, password, email } = stringifyDtoValues(dto);

    return this.withConn(async (conn) =>
      this.getFirst(
        await conn.query<DbUser>(
          `INSERT INTO "users" 
              ("username", "password", "email")
           VALUES 
              (${username}, ${password}, ${email})
           RETURNING *`
        )
      )
    );
  }

  createUser(dto: CreateDbUserDto): Promise<DbUser> {
    const { username, password, email } = stringifyDtoValues(dto);

    return this.withConn(async (conn) =>
      this.getFirst(
        await conn.query<DbUser>(
          `INSERT INTO "users" 
              ("username", "password", "email")
           VALUES 
              (${username}, ${password}, ${email})
           RETURNING *`
        )
      )
    );
  }

  checkUserIdentifier(identifier: CheckIdentifierDto): Promise<any> {
    const [[column, value]] = Object.entries(stringifyDtoValues(identifier));

    return this.withConn(async (conn) =>
      this.getFirst(
        await conn.query<CheckIdentifierDto>(
          `SELECT ${column}
           FROM "users"
           WHERE ${column} = ${value}`
        )
      )
    );
  }

  async checkUserIdentifiers(dto: Partial<CreateDbUserDto>): Promise<IdentifierCheckResult[] | null> {
    const { username, email } = stringifyDtoValues(dto);

    const result = await this.withConn(async (conn) =>
      this.getFirst(
        await conn.query<CheckIdentifierDto>(
          `SELECT (
            SELECT "username"
            FROM "users"
            WHERE "username" = ${username} 
          ),
          (
            SELECT "email"
            FROM "users"
            WHERE "email" = ${email}
            )`
        )
      )
    ).then((res) =>
      Object.entries(res)
        .map(([column, value]) => (value ? column : null))
        .filter((r) => r !== null)
    );

    return result.length ? (result as unknown as Promise<IdentifierCheckResult[]>) : null;
  }

  getUser(identifier: GetUserDto): Promise<DbUser> {
    const { column, value } = parseColumnAndValue(identifier);

    return this.withConn(async (conn) =>
      this.getFirst(
        await conn.query<DbUser>(
          `SELECT * 
           FROM "users"
           WHERE "${column}" = ${value}`
        )
      )
    );
  }

  getUserValues(usernameOrId: string, values: UserColumn | UserColumn[]): Promise<Partial<DbUser>> {
    return this.withConn(async (conn) =>
      this.getFirst(
        await conn.query<Partial<DbUser>>(
          `SELECT ${values} 
           FROM "users"
           WHERE "username" = '${usernameOrId}'
           OR "id" = '${usernameOrId}'`
        )
      )
    );
  }

  updateUser(userId: string, dto: EditDbUserDto): Promise<DbUser> {
    return this.withConn(async (conn) =>
      this.getFirst(
        await conn.query<DbUser>(
          `UPDATE "users"
           SET 
              username = ${dto.username}, 
              password = ${dto.password}, 
              email = ${dto.email},
              reset_pw_token = ${dto.resetPwToken}
           WHERE "id" = ${userId}
           RETURNING * `
        )
      )
    );
  }

  addResetPasswordToken(userId: string, token: string): Promise<DbUser> {
    return this.withConn(async (conn) =>
      this.getFirst(
        await conn.query<DbUser>(
          `UPDATE "users"
           SET "reset_pw_token" = ${token}
           WHERE "id" = ${userId}
           RETURNING * `
        )
      )
    );
  }

  checkUserResetPasswordToken(token: string): Promise<Pick<DbUser, 'resetPwToken'>> {
    return this.withConn(async (conn) =>
      this.getFirst(
        await conn.query<{ resetPwToken: string }>(
          `SELECT
           FROM "users"
           WHERE "reset_pw_token" = '${token}'`
        )
      )
    );
  }

  deleteUserResetPasswordToken(token: string): Promise<void> {
    return this.withConn(async (conn) => {
      await conn.query(
        `UPDATE "users"
         SET "reset_pw_token" = NULL
         WHERE "reset_pw_token" = '${token}'`
      );
    });
  }

  getPosts(userId: string): Promise<DbPost[]> {
    return this.withConn(async (conn) =>
      this.parseRows(
        await conn.query<DbPost>(
          `SELECT
            posts.id, posts.body, posts.title,
            "content_url" as "contentUrl",
            "url_slugs" as "urlSlugs",
            "created_at" as "createdAt",
            "updated_at" as "updatedAt",
            "creator_user_id" as "creatorUserId",
            "creator_username" as "creatorUsername",
            "current_status" as "currentStatus",
              (SELECT SUM(posts_votes.vote_status) as "points" 
                FROM posts_votes 
                WHERE posts_votes.post_id = posts.id),
              (SELECT COUNT(post_id) as "commentCount"
                FROM comments WHERE post_id = posts.id),
              (SELECT vote_status
                FROM posts_votes
                WHERE posts_votes.post_id = posts.id
                AND '${userId}' = posts_votes.user_id)
                AS "userVoteStatus",
              (SELECT user_id
                FROM posts_favorites
                WHERE posts_favorites.post_id = posts.id
                AND '${userId}' = posts_favorites.user_id)
                AS "userFavoriteStatus"
           FROM "posts"
           ORDER BY "updated_at" DESC`
        )
      )
    );
  }

  getPost(dto: GetPostDto): Promise<DbPost> {
    const { userId, postId, postSlugs } = stringifyDtoValues(dto);
    return this.withConn(async (conn) =>
      this.getFirst(
        await conn.query<DbPost>(
          `SELECT
            posts.id, posts.body, posts.title,
            "content_url" as "contentUrl",
            "url_slugs" as "urlSlugs",
            "created_at" as "createdAt",
            "updated_at" as "updatedAt",
            "creator_user_id" as "creatorUserId",
            "creator_username" as "creatorUsername",
            "current_status" as "currentStatus",
              (SELECT SUM(posts_votes.vote_status) as "points" 
                FROM posts_votes 
                WHERE posts_votes.post_id = posts.id),
              (SELECT COUNT(post_id) as "commentCount"
                FROM comments WHERE post_id = posts.id),
              (SELECT vote_status
                FROM posts_votes
                WHERE posts_votes.post_id = posts.id
                AND ${userId} = posts_votes.user_id)
                AS "userVoteStatus",
              (SELECT user_id
                FROM posts_favorites
                WHERE posts_favorites.post_id = posts.id
                AND ${userId} = posts_favorites.user_id)
                AS "userFavoriteStatus"
           FROM "posts"
           WHERE 
            ${postId ? `${postId} = posts.id` : `${postSlugs} = posts.url_slugs`}`
        )
      )
    );
  }

  getComments(userId: string, postId?: string): Promise<DbComment[]> {
    return this.withConn(async (conn) =>
      this.parseRows(
        await conn.query<DbComment>(
          `SELECT
            "id", "body",
            "post_id" as "postId",
            "parent_comment_id" as "parentCommentId",
            "created_at" as "createdAt",
            "updated_at" as "updatedAt",
            "creator_user_id" as "creatorUserId",
            "creator_username" as "creatorUsername",
            "current_status" as "currentStatus",
            (SELECT SUM(comments_votes.vote_status) as "points" 
                FROM comments_votes 
                WHERE comments_votes.comment_id = comments.id),
            (SELECT vote_status
                FROM comments_votes
                WHERE comments_votes.comment_id = comments.id
                AND '${userId}' = comments_votes.user_id)
                AS "userVoteStatus"
            FROM "comments"
            ${postId ? `WHERE '${postId}' = comments.post_id` : ''}
            ORDER BY updated_at DESC`
        )
      )
    );
  }

  createPost(dto: CreatePostRequest): Promise<Pick<DbPost, 'id' | 'title'>> {
    const { userId, username, contentUrl, title, body } = stringifyDtoValues(dto);
    return this.withConn(async (conn) =>
      this.getFirst(
        await conn.query<DbPost>(`
          INSERT INTO "posts" (
            "creator_user_id", "creator_username", "content_url", "title", "body"
          )
          VALUES (
            ${userId}, ${username}, ${contentUrl}, ${title}, ${body}
          )
          RETURNING id, title
        `)
      )
    );
  }

  editPost(dto: EditPostRequest): Promise<QueryResult> {
    const { userId, username, contentUrl, title, body, postSlugs } = stringifyDtoValues(dto);
    return this.withConn(
      async (conn) =>
        await conn.query(`
          UPDATE "posts"
            SET 
              "creator_user_id" = ${userId},
              "creator_username" = ${username},
              "content_url" = ${contentUrl},
              "title" = ${title}, 
              "body" = ${body}
            WHERE
              url_slugs = ${postSlugs}
              AND
              creator_user_id = ${userId}
        `)
    );
  }

  removePost(postId: string): Promise<QueryResult> {
    return this.withConn(
      async (conn) =>
        await conn.query(`
          UPDATE "posts"
            SET "current_status" = 'removed'
            WHERE "id" = '${postId}'
        `)
    );
  }

  updatePostSlugs(postId: string, slugs: string): Promise<QueryResult> {
    return this.withConn(
      async (conn) =>
        await conn.query(`
        UPDATE "posts"
        SET "url_slugs" = '${slugs}'
        WHERE id = '${postId}'
      `)
    );
  }

  updatePostVotes(dto: UpdatePostVotesDto): Promise<QueryResult> {
    const { voteValue, postId, userId } = stringifyDtoValues(dto);
    return this.withConn(
      async (conn) =>
        await conn.query<DbPost>(`
          INSERT INTO "posts_votes" (
            "vote_status", "user_id", "post_id"
          )
          VALUES (
            ${voteValue}, ${userId}, ${postId}
          )
          ON CONFLICT ("post_id", "user_id")
            DO UPDATE
              SET "vote_status" = ${voteValue}
        `)
    );
  }

  updateCommentVotes(dto: UpdateCommentVotesDto): Promise<QueryResult> {
    const { voteValue, commentId, userId } = stringifyDtoValues(dto);
    return this.withConn(
      async (conn) =>
        await conn.query<DbPost>(`
          INSERT INTO "comments_votes" (
            "vote_status", "user_id", "comment_id"
          )
          VALUES (
            ${voteValue}, ${userId}, ${commentId}
          )
          ON CONFLICT ("comment_id", "user_id")
            DO UPDATE
              SET "vote_status" = ${voteValue}
        `)
    );
  }

  togglePostFavorite(postId: string, userId: string): Promise<{ userFavoriteStatus: string }> {
    return this.withConn(async (conn) =>
      this.getFirst(
        await conn.query<any>(`
          SELECT toggle_favorite('${postId}', '${userId}') as "userFavoriteStatus"
        `)
      )
    );
  }

  addCommentToPost(dto: AddCommentToPostRequest): Promise<QueryResult> {
    const { userId, username, parentCommentId, body, postId } = stringifyDtoValues(dto);
    return this.withConn(
      async (conn) =>
        await conn.query<DbPost>(`
          INSERT INTO "comments" (
            "creator_user_id", 
            "creator_username", 
            "parent_comment_id", 
            "body", 
            "post_id"
          )
          VALUES (
            ${userId}, 
            ${username}, 
            ${parentCommentId}, 
            ${body}, 
            ${postId}
          )
        `)
    );
  }
}
