import _ from 'lodash';
import { DateTime } from 'luxon';
import { CommentType, NestedComment, PostType } from '../../common/types/entities';
import { CommentsColumn, DbComment, DbPost, PostsColumn, UserColumn } from '../types/dbTypes';
import { dbCommentsVotes, dbPostsFavorites, dbPostsVotes } from './dbQueries';

export const getTimeAgo = (date: string) => {
  const dateISO = new Date(Date.parse(date)).toISOString();
  const now = DateTime.local();
  const past = DateTime.fromISO(dateISO);

  const rel = past.toRelative({ base: now });
  return rel as string;
};

export const createSQLWhereConditionsFromList = <T>(
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

export const handlePostRemovedStatus = <T extends CommentType | PostType>(postsOrComments: T[]): T[] => {
  if (postsOrComments.length === 0) {
    return postsOrComments;
  }

  const cleanedPostsOrComments = postsOrComments.map((postOrComment) => {
    const contentType = 'title' in postOrComment ? 'post' : 'comment';

    if (postOrComment.currentStatus === 'removed') {
      return { ...postOrComment, body: `User has removed this ${contentType}` };
    } else {
      return postOrComment;
    }
  });

  return cleanedPostsOrComments;
};

export const appendCommentsToPost = (post: PostType, comments: CommentType[]) => {
  const postComments = comments.filter((comment) => comment.postId === post.id);
  return {
    ...post,
    comments: postComments,
  };
};

export const insertPoints = async (posts: PostType[]) => {
  const postsWithPoints = await Promise.all(
    posts.map(async (post) => {
      const voteCount = await dbPostsVotes.getSum('vote_status').where('post_id').equals(post.id);

      return {
        ...post,
        points: voteCount,
      };
    })
  );

  return postsWithPoints;
};

export const insertPointsAndVoteStatus = async (posts: PostType[], userId: string): Promise<PostType[]> => {
  const postsWithPointsAndVoteStatus = await Promise.all(
    posts.map(async (post) => {
      const voteCount = await dbPostsVotes.getSum('vote_status').where('post_id').equals(post.id);
      const [postVote] = await dbPostsVotes.selectAll({
        whereConditions: `user_id = '${userId}' AND post_id = '${post.id}'`,
      });

      if (postVote && postVote.postId === post.id) {
        return { ...post, points: voteCount, userVoteStatus: postVote.voteStatus };
      } else {
        return {
          ...post,
          points: voteCount,
          userVoteStatus: null,
        };
      }
    })
  );

  return postsWithPointsAndVoteStatus;
};

/**
 * Inserting total points (voteCount), user's vote status (userVoteStatus), and relative updatedAt (createdAtRelative)
 */
export const makeCommentClientReady = async (comment: CommentType, userId: string): Promise<CommentType> => {
  const voteCount = await dbCommentsVotes.getSum('vote_status').where('comment_id').equals(comment.id);
  const [commentVote] = await dbCommentsVotes.selectAll({
    whereConditions: `user_id = '${userId}' AND comment_id = '${comment.id}'`,
  });
  const createdAtRelative = getTimeAgo(comment.createdAt);

  return {
    ...comment,
    points: voteCount,
    userVoteStatus: commentVote ? commentVote.voteStatus : null,
    createdAtRelative,
  };
};

/**
 * Inserting total points (voteCount), userVoteStatus, userFavoriteStatus, createdAtRelative. Also fetching the post's comments & then nesting them
 */
export const insertPointsAndComments = async (
  post: PostType,
  comments: CommentType[],
  userId: string
): Promise<PostType> => {
  const voteCount = await dbPostsVotes.getSum('vote_status').where('post_id').equals(post.id);
  const [postVote] = await dbPostsVotes.selectAll({
    whereConditions: `user_id = '${userId}' AND post_id = '${post.id}'`,
  });
  const [userFavoriteStatus] = await dbPostsFavorites.selectAll({
    whereConditions: `user_id = '${userId}' AND post_id = '${post.id}'`,
  });

  const createdAtRelative = getTimeAgo(post.createdAt);

  const postCommentsRaw = comments.filter((comment) => comment.postId === post.id);
  const postComments = await asyncMap(postCommentsRaw, (postComment) =>
    makeCommentClientReady(postComment, userId)
  );

  const nestComments = (commentList: CommentType[], isRecursiveCall?: boolean): NestedComment[] => {
    const nestedComments = commentList.map((comment) => {
      if (comment.parentCommentId && !isRecursiveCall) {
        return null;
      }

      const children = postComments.filter(
        (filteredComment) => filteredComment.parentCommentId === comment.id
      );
      const childrenNested = nestComments(children, true);
      const commentWithChildren = { ...comment, children: childrenNested };
      return commentWithChildren;
    });

    const nullsRemoved = nestedComments.filter((c) => c !== null);
    return nullsRemoved as NestedComment[];
  };

  const nestedComments = nestComments(postComments);

  const userHasVoted = postVote && postVote.postId === post.id;

  return {
    ...post,
    comments: nestedComments,
    points: voteCount,
    userVoteStatus: userHasVoted ? postVote.voteStatus : null,
    userFavoriteStatus: userFavoriteStatus ? true : false,
    createdAtRelative,
  };
};

export const asyncMap = async <T, U>(list: T[], callback: (item: T) => Promise<T>) => {
  const result = await Promise.all(list.map(callback));

  return result;
};

export const sanitizeKeys = <T extends DbPost | DbComment>(postOrComment: T): T => {
  const camelCased = _.mapKeys(postOrComment, (value, key) => _.camelCase(key));
  return camelCased as unknown as T;
};
